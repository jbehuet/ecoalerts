import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ATMOFRANCE_USERNAME, ATMOFRANCE_PWD } from '$env/static/private';
import { logErrorToSupabase } from '$lib/utils/logger.js';

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6h en ms

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

async function fetchIndicesAtmoFrance(code_zone) {
    const loginRes = await fetch(`https://admindata.atmo-france.org/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ATMOFRANCE_USERNAME, password: ATMOFRANCE_PWD })
    });

    if (!loginRes.ok) {
        throw new Error('Login failed');
    }

    const loginData = await loginRes.json();
    const token = loginData.token;

    if (!token) {
        throw new Error('Token missing in login response');
    }

    const now = formatDate(new Date());
    const headers = { 'Authorization': `Bearer ${token}` };

    const pollenUrl = `https://admindata.atmo-france.org/api/v2/data/indices/pollens?format=geojson&date=${now}&date_historique=${now}&code_zone=${code_zone}&with_geom=false`;
    const aqiUrl = `https://admindata.atmo-france.org/api/v2/data/indices/atmo?format=geojson&date=${now}&date_historique=${now}&code_zone=${code_zone}&with_geom=false`;

    const [pollenRes, aqiRes] = await Promise.all([
        fetch(pollenUrl, { headers }),
        fetch(aqiUrl, { headers })
    ]);

    const [pollenData, aqiData] = await Promise.all([
        pollenRes.json(),
        aqiRes.json()
    ]);

    const pollen = pollenData.features?.[0] ? {
        resp: pollenData.features[0].properties.pollen_resp,
        code_qual: pollenData.features[0].properties.code_qual,
    } : null;

    const aqi = aqiData.features?.[0] ? {
        code_qual: aqiData.features[0].properties.code_qual,
        couleur: aqiData.features[0].properties.coul_qual,
    } : null;

    return { pollen, aqi };
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin&forecast_days=1`;

    const weatherRes = await fetch(url);

    if (!weatherRes.ok) {
        throw new Error('Erreur lors de la récupération des données météo');
    }

    const weatherData = await weatherRes.json();

    if (!weatherData.daily) {
        return null;
    }

    return {
        temperature: {
            max: weatherData.daily.temperature_2m_max[0],
            min: weatherData.daily.temperature_2m_min[0],
        },
        uv: weatherData.daily.uv_index_max[0]
    }
}

async function fetchRestrictionsEau(code) {
    const dept = code.slice(0, 2);
    const url = `https://api.vigieau.beta.gouv.fr/api/zones/departement/${dept}`;

    const vigiRes = await fetch(url);

    if (vigiRes.status === 404) {
        return null;
    }
    else if (!vigiRes.ok) {
        throw new Error(`Erreur lors de la récupération des données Vigieau pour le département ${dept}`);
    }

    const zones = await vigiRes.json();

    const niveaux = new Set();
    const liens = new Set();

    for (const zone of zones) {
        if (zone.niveauGravite) niveaux.add(zone.niveauGravite);
        if (zone.arrete?.cheminFichier) liens.add(zone.arrete.cheminFichier);
    }

    const ordre = ['vigilance', 'alerte', 'alerte_renforcee', 'crise'];
    const niveauMax = ordre.find(lvl => niveaux.has(lvl)) || 'aucune';

    return {
        niveauMax,
        liensArretes: Array.from(liens)
    };
}

export async function GET({ url }) {
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const ville = url.searchParams.get('ville');
    const code_zone = url.searchParams.get('code');

    if (!lat || !lon || !ville || !code_zone) {
        return json({ error: 'lat, lon, ville et code requis' }, { status: 400 });
    }

    const { data: cached } = await supabase
        .from('city_environment_data')
        .select('*')
        .eq('city_name', ville)
        .eq('city_code', code_zone)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const isFresh = cached && cached.fetched_at && (Date.now() - new Date(cached.fetched_at).getTime()) < CACHE_DURATION;
    if (isFresh) return json({...cached.data, fetched_at : cached.fetched_at});

    try {
        const results = await Promise.allSettled([
            fetchIndicesAtmoFrance(code_zone),
            fetchWeather(lat, lon),
            fetchRestrictionsEau(code_zone)
        ]);

        const [indicesResult, weatherResult, restrictionsResult] = results;

        const data = {
            pollen: null,
            aqi: null,
            weather: null,
            restrictionsEau: null,
        };

        // Traitement des résultats
        if (indicesResult.status === 'fulfilled') {
            data.pollen = indicesResult.value.pollen;
            data.aqi = indicesResult.value.aqi;
        } else {
            await logErrorToSupabase(indicesResult.reason, {
                source: 'fetchIndices',
                code_zone
            });
        }

        if (weatherResult.status === 'fulfilled') {
            data.weather = weatherResult.value;
        } else {
            await logErrorToSupabase(weatherResult.reason, {
                source: 'fetchWeather',
                lat,
                lon
            });
        }

        if (restrictionsResult.status === 'fulfilled') {
            data.restrictionsEau = restrictionsResult.value;
        } else {
            await logErrorToSupabase(restrictionsResult.reason, {
                source: 'fetchRestrictionsEau',
                code_zone
            });
        }

        await supabase.from('city_environment_data').upsert({
            city_name: ville,
            city_code : code_zone,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            data,
        });

        return json({...data, fetched_at: Date.now(),});
    } catch (error) {
        await logErrorToSupabase(error, {
            source: 'GET /environment',
            ville,
            code_zone
        });
        return json({ error: 'Erreur lors de la récupération des données environnementales :' + error.message }, { status: 500 });
    }
}
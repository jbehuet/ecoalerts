import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ATMOFRANCE_USERNAME, ATMOFRANCE_PWD } from '$env/static/private';

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6h en ms

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export async function GET({ url }) {
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const ville = url.searchParams.get('ville');
    const code = url.searchParams.get('code');

    if (!lat || !lon || !ville || !code) {
        return json({ error: 'lat, lon, ville et code requis' }, { status: 400 });
    }

    const { data: cached } = await supabase
        .from('city_environment_data')
        .select('*')
        .eq('city_name', ville)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const isFresh = cached && cached.fetched_at && (Date.now() - new Date(cached.fetched_at).getTime()) < CACHE_DURATION;

    if (isFresh) return json(cached.data);

    let pollen, aqi, weather = {}, restrictionsEau;
    let token;

    // Auth AtmoFrance
    const loginRes = await fetch(`https://admindata.atmo-france.org/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ATMOFRANCE_USERNAME, password: ATMOFRANCE_PWD })
    });
    const loginData = await loginRes.json();
    token = loginData.token;

    const now = formatDate(new Date());

    if (token) {
        const pollenRes = await fetch(`https://admindata.atmo-france.org/api/v2/data/indices/pollens?format=geojson&date=${now}&date_historique=${now}&code_zone=${code}&with_geom=false`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pollenData = await pollenRes.json();
        if (pollenData.features?.[0]) {
            pollen = {
                resp: pollenData.features[0].properties.pollen_resp,
                code_qual: pollenData.features[0].properties.code_qual,
            };
        }

        const aqiRes = await fetch(`https://admindata.atmo-france.org/api/v2/data/indices/atmo?format=geojson&date=${now}&date_historique=${now}&code_zone=${code}&with_geom=false`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const aqiData = await aqiRes.json();
        if (aqiData.features?.[0]) {
            aqi = {
                code_qual: aqiData.features[0].properties.code_qual,
                couleur: aqiData.features[0].properties.coul_qual,
            };
        }
    }

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin&forecast_days=1`);
    const weatherData = await weatherRes.json();
    if (weatherData.daily) {
        weather = {
            temperature: {
                max: weatherData.daily.temperature_2m_max[0],
                min: weatherData.daily.temperature_2m_min[0],
            },
            uv: weatherData.daily.uv_index_max[0]
        };
    }

    const dept = code.slice(0, 2);
    const vigiRes = await fetch(`https://api.vigieau.beta.gouv.fr/api/zones/departement/${dept}`);
    if (vigiRes.status === 200) {
        const zones = await vigiRes.json();
        const niveaux = new Set();
        const liens = new Set();
        for (const zone of zones) {
            if (zone.niveauGravite) niveaux.add(zone.niveauGravite);
            if (zone.arrete?.cheminFichier) liens.add(zone.arrete.cheminFichier);
        }
        const ordre = ['vigilance', 'alerte', 'alerte_renforcee', 'crise'];
        restrictionsEau = {
            niveauMax: ordre.find(lvl => niveaux.has(lvl)) || 'aucune',
            liensArretes: Array.from(liens)
        };
    }

    const result = { aqi, pollen, weather, restrictionsEau, fetchedAt: new Date() };

    await supabase.from('city_environment_data').upsert({
        city_name: ville,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        data: result,
        fetched_at: new Date()
    });

    return json(result);
}
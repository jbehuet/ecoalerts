import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withErrorLogging } from '@/lib/logger';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ATMOFRANCE_USERNAME = process.env.NEXT_PUBLIC_ATMOFRANCE_USERNAME;
const ATMOFRANCE_PWD = process.env.NEXT_PUBLIC_ATMOFRANCE_PWD;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6h en ms

const formatDate = (date:Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lon, ville, code } = req.query;
    if (!lat || !lon || !ville || !code) return res.status(400).json({ error: 'lat, lon, ville et code requis' });

    const { data: cached, error } = await supabase
        .from('city_environment_data')
        .select('*')
        .eq('city_name', ville as string)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) return res.status(500).json({ error: error });

    const isFresh = cached && cached.fetched_at && (Date.now() - new Date(cached.fetched_at).getTime()) < CACHE_DURATION;

    if (isFresh) {
        return res.status(200).json(cached.data);
    }

    // fetch AtmoFrance
    let pollen, aqi;
    let atmoFranceRes = await fetch(
        `https://admindata.atmo-france.org/api/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: ATMOFRANCE_USERNAME, password: ATMOFRANCE_PWD }),
        });
    const { token } = await atmoFranceRes.json();

    const now = formatDate(new Date())
    atmoFranceRes = await fetch(`https://admindata.atmo-france.org/api/v2/data/indices/pollens?format=geojson&date=${now}&date_historique=${now}&code_zone=${code}&with_geom=false`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    const resPollen = await atmoFranceRes.json();
    pollen = {
        resp : resPollen.features[0].properties.pollen_resp,
        code_qual: resPollen.features[0].properties.code_qual,
    }

    atmoFranceRes = await fetch(`https://admindata.atmo-france.org/api/v2/data/indices/atmo?format=geojson&date=${now}&date_historique=${now}&code_zone=${code}&with_geom=false`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    const resAir = await atmoFranceRes.json();
    aqi = {
        code_qual : resAir.features[0].properties.code_qual,
        couleur: resAir.features[0].properties.coul_qual,
    }


    // fetch weather
    let weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin&forecast_days=1`)
    const weatherData = await weatherRes.json();
    if (weatherData && weatherData.daily) {
        weather = {
            temperature: {
                max : weatherData.daily.temperature_2m_max[0],
                min : weatherData.daily.temperature_2m_min[0],
            },
            uv: weatherData.daily.uv_index_max[0]
        }
    }


    const result = {
        aqi,
        pollen,
        weather,
        fetchedAt: new Date().toISOString()
    };

    await supabase.from('city_environment_data').upsert({
        city_name: ville,
        lat: parseFloat(lat as string),
        lon: parseFloat(lon as string),
        data: result,
        fetched_at: new Date()
    });

    return res.status(200).json(result);
}

export default withErrorLogging(handler);

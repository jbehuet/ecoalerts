import {json} from "@sveltejs/kit";
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY } from '$env/static/private';
import OpenAI from "openai";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6h en ms

export async function POST({ request }) {
    const body = await request.json();
    const { ville, code, aqi, pollen, weather, eau, profile } = body;

    if (!ville) return json({ error: 'ville est requis' }, { status: 400 });

    // Desactive openai
    return json({ conseil: "" });

    const cacheKey = `${ville}_${code}_${profile || 'default'}`.toLowerCase();

    const { data: cached } = await supabase
        .from('conseils_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const now = Date.now();
    const isFresh = cached && cached.created_at && (now - new Date(cached.created_at).getTime()) < CACHE_DURATION;

    if (isFresh) {
        return json({ conseil: cached.message });
    }

    const prompt = `
        Tu es un assistant environnemental. Ta mission est de générer UN SEUL conseil utile, personnalisé, court (max 20 mots) et en français à une personne située à ${ville}.
        Données :
        - Qualité de l'air : ${aqi ? aqi.code_qual + "/5" : "inconnue"}
        - UV : ${weather?.uv ?? 'inconnu'}
        ${weather ? `- Température min/max : ${weather.temperature.min}°C / ${weather.temperature.max}°C` : ''}
        ${pollen ? `- Pollen : ${pollen.code_qual} (type : ${pollen.resp})` : ''}
        ${eau ? `- Restriction eau : ${eau.niveauMax}` : ''}
        ${profile ? `- Profil utilisateur : ${profile}` : ''}
        
        Consignes :
        - Conseil court, concret, actionnable (pas générique)
        - Tente de combiner plusieurs facteurs si pertinent
        - Varie le champ d’action : santé, jardin, mobilité, énergie, eau, activité
        - Utilise un ton naturel, pas robotique
        - Ne met pas d'emojis
    `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (message) {
        await supabase.from('conseils_cache').insert({
            cache_key: cacheKey,
            message,
            created_at: new Date()
        });
    }

    return json({ conseil: message });
}
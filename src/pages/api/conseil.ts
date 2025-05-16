import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import {withErrorLogging} from "@/lib/logger";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6h en ms

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ville, aqi, uv, pollen, weather, profile } = req.body;
    if (!ville) return res.status(400).json({ error: 'ville est requis' });

    const cacheKey = `${ville}_${profile || 'default'}`.toLowerCase();

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
        return res.status(200).json({ conseil: cached.message });
    }

    const prompt = `
        Tu es un assistant environnemental. Donne un conseil utile, court (20 mots max) et pertinent à une personne située à ${ville}.
        L'indice de pollution de l'air est de ${aqi ? aqi.code_qual + "/5" : "inconnu"}.
        L'indice UV est de ${weather ? weather.uv : 'inconnu'}.
        ${weather  ? `La température maximale est de : ${weather.temperature.max}.` : ''}
        ${pollen  ? `Le niveau de pollen est : ${pollen}.` : ''}
        ${profile ? `Profil utilisateur : ${profile}` : ''}
        Donne un seul conseil clair, actionnable et en français.
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

    return res.status(200).json({ conseil: message });
}

export default withErrorLogging(handler)

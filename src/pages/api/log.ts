import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { source, message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'message requis' });

    const { error } = await supabase.from('logs').insert([
        { source, message, context },
    ]);

    if (error) return res.status(500).json({ error: 'supabase insert failed' });
    return res.status(200).json({ status: 'ok' });
}
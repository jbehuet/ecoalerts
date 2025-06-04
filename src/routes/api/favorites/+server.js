import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { supabase } from '$lib/auth/auth.js';
import { JWT_SECRET } from '$env/static/private';

function getUserFromCookies(cookies) {
    const token = cookies.get('access_token');
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded.email) {
            return decoded.email;
        }
    } catch (err) {
        return null;
    }
}

export async function GET({ cookies }) {
    const email = getUserFromCookies(cookies);
    if (!email) return json({ error: 'Non authentifié' }, { status: 401 });

    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('email', email);

    if (error) return json({ error: 'Erreur DB' }, { status: 500 });

    return json({ favorites: data });
}

export async function POST({ cookies, request }) {
    const email = getUserFromCookies(cookies);
    if (!email) return json({ error: 'Non authentifié' }, { status: 401 });

    const body = await request.json();
    const { ville } = body;

    if (!ville) {
        return json({ error: 'Ville requis' }, { status: 400 });
    }

    const { error } = await supabase.from('favorites').insert({
        email,
        city : ville,
        created_at: new Date().toISOString()
    });

    if (error) return json({ error: 'Erreur DB' }, { status: 500 });

    return json({ ok: true });
}

export async function DELETE({ cookies, request }) {
    const email = getUserFromCookies(cookies);
    if (!email) return json({ error: 'Non authentifié' }, { status: 401 });

    const body = await request.json();
    const { ville } = body;
    if (!ville) return json({ error: 'Ville requis' }, { status: 400 });

    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('email', email)
        .eq('city', ville);

    if (error) return json({ error: 'Erreur DB' }, { status: 500 });

    return json({ ok: true });
}
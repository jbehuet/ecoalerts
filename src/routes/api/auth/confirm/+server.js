import { json, redirect } from '@sveltejs/kit';
import { createJWT, generateToken, storeRefreshToken, supabase } from '$lib/auth/auth.js';

export async function GET({ url, cookies }) {
    const token = url.searchParams.get('token');
    if (!token) return json({ error: 'Token requis' }, { status: 400 });

    const { data: tokenEntry, error } = await supabase
        .from('email_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();

    if (!tokenEntry) {
        throw redirect(302, '/');
    }

    const now = Date.now();
    const expires = new Date(tokenEntry.expires_at + 'Z').getTime();

    if (!tokenEntry || tokenEntry.used || now > expires) {
        return json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    await supabase
        .from('email_tokens')
        .update({ used: true })
        .eq('token', token);

    const email = tokenEntry.email;
    const accessToken = createJWT({ email }, '15m');
    const refreshToken = generateToken();

    await storeRefreshToken(email, refreshToken);

    cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 15 //15min
    });

    cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 //30 jours
    });

    throw redirect(302, '/');
}

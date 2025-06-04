import { json } from '@sveltejs/kit';
import { createJWT, supabase } from '$lib/auth/auth.js';

export async function POST({ cookies }) {
    const refreshToken = cookies.get('refresh_token');
    if (!refreshToken) return json({ error: 'Refresh token manquant' }, { status: 401 });

    const { data: session, error } = await supabase
        .from('auth_sessions')
        .select('*')
        .eq('refresh_token', refreshToken)
        .maybeSingle();

    if (!session || new Date() > new Date(session.expires_at)) {
        return json({ error: 'Refresh token invalide ou expiré' }, { status: 403 });
    }

    const newAccessToken = createJWT({ email: session.email }, '15m');

    cookies.set('access_token', newAccessToken, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 15
    });

    return json({ access_token: newAccessToken });
}

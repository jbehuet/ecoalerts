import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { createJWT, supabase } from '$lib/auth/auth.js';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handle = async ({ event, resolve }) => {
    // Gestion des requêtes preflight CORS
    if (event.request.method === 'OPTIONS' && event.url.pathname.startsWith('/api/')) {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const accessToken = event.cookies.get('access_token');
    const refreshToken = event.cookies.get('refresh_token');

    let tokenError = null;

    if (accessToken) {
        try {
            const payload = jwt.verify(accessToken, JWT_SECRET);
            if (payload?.email) {
                event.locals.user = { email: payload.email };
            } else {
                tokenError = new jwt.TokenExpiredError('No access token', new Date());
            }
        } catch (err) {
            tokenError = err;
        }
    } else {
        tokenError = new jwt.TokenExpiredError('No access token', new Date());
    }

    // Tentative de refresh si erreur d'expiration ET refresh présent
    if (tokenError instanceof jwt.TokenExpiredError && refreshToken) {
        const { data: session } = await supabase
            .from('auth_sessions')
            .select('*')
            .eq('refresh_token', refreshToken)
            .maybeSingle();

        if (session) {
            const newAccess = createJWT({ email: session.email }, '15m');
            event.cookies.set('access_token', newAccess, {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 15
            });
            event.locals.user = { email: session.email };
        } else {
            event.locals.user = null;
        }
    }

    const response = await resolve(event);

    if (event.url.pathname.startsWith('/api/')) {
        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
    }

    return response;
};
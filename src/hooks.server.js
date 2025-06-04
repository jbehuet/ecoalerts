import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { createJWT, supabase } from '$lib/auth/auth.js';

export const handle = async ({ event, resolve }) => {
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

    return resolve(event);
};
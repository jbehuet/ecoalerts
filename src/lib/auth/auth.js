import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Crée un JWT signé pour l'utilisateur
 * @param {Object} payload
 * @param {string} [expiresIn='15m']
 * @returns {string} token JWT
 */
export function createJWT(payload, expiresIn = '15m') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Génére un token UUID aléatoire (refresh token)
 * @returns {string} UUID
 */
export function generateToken() {
    return randomUUID();
}

/**
 * Enregistre un refresh token en base
 * @param {string} email
 * @param {string} token
 */
export async function storeRefreshToken(email, token) {
    await supabase.from('auth_sessions').insert({
        email,
        refresh_token: token,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 jours
    });
}
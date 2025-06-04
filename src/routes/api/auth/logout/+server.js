import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    // Supprimer les cookies en les expirant immédiatement
    cookies.delete('access_token', { path: '/' });
    cookies.delete('refresh_token', { path: '/' });

    return json({ ok: true });
}
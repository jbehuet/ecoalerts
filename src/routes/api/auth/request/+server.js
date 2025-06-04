import { json } from '@sveltejs/kit';
import { generateToken, supabase } from '$lib/auth/auth.js';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const BASE_URL = 'https://www.ecoalerts.fr';

export async function POST({ request }) {
    const { email } = await request.json();
    if (!email) return json({ error: 'Email requis' }, { status: 400 });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // Supprimer tous les tokens existants pour cet email
    await supabase.from('email_tokens')
        .delete()
        .eq('email', email);

    await supabase.from('email_tokens').insert({
        email,
        token,
        expires_at: expiresAt,
        used: false
    });
    const magicLink = `${BASE_URL}/api/auth/confirm?token=${token}`;

    const resend = new Resend(RESEND_API_KEY);
    const {error} = await resend.emails.send({
        from: 'no-reply@ecoalerts.fr',
        to: email,
        subject: 'Votre lien magique - EcoAlerts',
        html: `<p>Bonjour,</p><p>Cliquez sur ce lien pour vous connecter à EcoAlerts :</p><p><a href="${magicLink}">${magicLink}</a></p>`
    });

    if (error) {
        return json({ error: 'Erreur envoi e-mail' }, { status: 500 });
    }

    return json({ ok: true });
}
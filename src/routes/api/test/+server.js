import { SUPABASE_URL } from '$env/static/private';

export async function GET() {
    console.log('SUPABASE_URL =', SUPABASE_URL);
    return new Response('✅ TEST OK');
}
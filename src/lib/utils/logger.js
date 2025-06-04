import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);;

export async function logErrorToSupabase(error, context = {}) {
    const { message, stack } =
        error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');

    if (process.env.NODE_ENV === "development") {
        console.error(stack, JSON.stringify(context));
    } else {
        const { error } = await supabase.from('logs').insert([
            { message, stack, context: JSON.stringify(context) },
        ]);
        if (error){
            console.error('Erreur d’insertion dans Supabase log :', insertError.message);
        }
    }
}
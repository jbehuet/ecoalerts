import { NextApiHandler } from "next";

export async function logError(message: string, context: any = {}, source: string = 'client') {
    try {
        await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context, source }),
        });
    } catch (err) {
        console.warn('Erreur non loggable (fallback local)', err);
    }
}

export function withErrorLogging(handler: NextApiHandler): NextApiHandler {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (err) {
            const e = err instanceof Error ? err : new Error('Erreur inconnue');
            await logError('API uncaught error', { message: e.message, stack: e.stack }, "api");
            res.status(500).json({ error: 'Erreur serveur' });
        }
    };
}
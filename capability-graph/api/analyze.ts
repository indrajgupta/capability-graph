// api/analyze.ts
// Vercel Serverless Function entry point for POST /api/analyze

import type { IncomingMessage, ServerResponse } from 'http';
import { executeAnalyze } from '../src/server/analyzeHandler';

export default async function handler(req: any, res: any) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const professionalInformation = body.professional_information;
    const authHeader = req.headers.authorization || req.headers['authorization'];

    const result = await executeAnalyze({
      professionalInformation,
      authToken: authHeader,
      difyApiUrl: process.env.DIFY_API_URL,
      difyApiKey: process.env.DIFY_API_KEY,
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    });

    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error('[Vercel API /api/analyze error]:', error);
    return res.status(500).json({ error: 'Server processing failed' });
  }
}

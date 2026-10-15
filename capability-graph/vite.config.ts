import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { executeAnalyze } from './src/server/analyzeHandler.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-analyze-middleware',
        configureServer(server) {
          server.middlewares.use('/api/analyze', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let bodyText = '';
            req.on('data', chunk => {
              bodyText += chunk;
            });

            req.on('end', async () => {
              try {
                const parsed = bodyText ? JSON.parse(bodyText) : {};
                const authHeader = (req.headers['authorization'] as string) || undefined;

                const liveEnv = loadEnv(mode, process.cwd(), '');
                const result = await executeAnalyze({
                  professionalInformation: parsed.professional_information,
                  authToken: authHeader,
                  difyApiUrl: liveEnv.DIFY_API_URL || process.env.DIFY_API_URL || env.DIFY_API_URL,
                  difyApiKey: liveEnv.DIFY_API_KEY || process.env.DIFY_API_KEY || env.DIFY_API_KEY,
                  supabaseUrl: liveEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL,
                  supabaseAnonKey: liveEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY,
                });

                res.statusCode = result.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result.body));
              } catch (err: any) {
                console.error('[API Middleware /api/analyze error]:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            });
          });
        },
      },
    ],
  };
});

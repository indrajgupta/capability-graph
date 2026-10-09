// src/server/analyzeHandler.ts
// Secure server-side handler for /api/analyze
// Interacts with Dify API using server-side DIFY_API_URL and DIFY_API_KEY.
// Exposes zero secrets to the client.

import { createClient } from '@supabase/supabase-js';

export interface StructuredGraphResult {
  person?: {
    name: string;
    title?: string;
  };
  nodes: Array<{
    id: string;
    type: string;
    name: string;
    description?: string;
    metadata?: Record<string, unknown>;
    evidenceStatus?: string;
  }>;
  relationships: Array<{
    source: string;
    target: string;
    type: string;
    label?: string;
  }>;
  evidence?: Array<{
    id: string;
    title: string;
    type: string;
    url?: string;
    nodeId?: string;
  }>;
  uncertain_items?: Array<{
    item: string;
    reason: string;
  }>;
}

/**
 * Normalizes Dify base URL to ensure proper endpoint construction without duplicates.
 * Case 1: https://api.dify.ai    -> Base: https://api.dify.ai    Endpoint: https://api.dify.ai/v1/workflows/run
 * Case 2: https://api.dify.ai/v1 -> Base: https://api.dify.ai    Endpoint: https://api.dify.ai/v1/workflows/run
 * Never creates: https://api.dify.ai/v1/v1/workflows/run
 */
export function normalizeDifyUrl(rawUrl: string): { baseUrl: string; workflowEndpoint: string } {
  let cleaned = rawUrl.trim().replace(/\/+$/, '');
  if (cleaned.includes('udify.app')) {
    cleaned = 'https://api.dify.ai';
  } else if (cleaned.endsWith('/v1')) {
    cleaned = cleaned.slice(0, -3).replace(/\/+$/, '');
  }
  return {
    baseUrl: cleaned,
    workflowEndpoint: `${cleaned}/v1/workflows/run`,
  };
}

/**
 * Normalizes and extracts structured JSON from Dify outputs (or chatflow answer).
 */
export function extractGraphFromDifyOutputs(outputs: any): StructuredGraphResult {
  let raw: any = outputs;

  if (!raw) {
    throw new Error('Dify returned empty outputs');
  }

  // If outputs contains a known key like result, graph, text, output, answer
  if (typeof raw === 'object' && !raw.nodes && !raw.relationships) {
    const candidateKeys = ['result', 'graph', 'output', 'text', 'answer', 'structured_graph', 'data'];
    for (const key of candidateKeys) {
      if (raw[key] !== undefined) {
        raw = raw[key];
        break;
      }
    }
  }

  // If raw is a string, parse it (handling markdown code fences if present)
  if (typeof raw === 'string') {
    let clean = raw.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    try {
      raw = JSON.parse(clean);
    } catch (e) {
      // Substring extraction if preamble exists
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        raw = JSON.parse(clean.slice(firstBrace, lastBrace + 1));
      } else {
        throw new Error('Failed to parse structured JSON from Dify response string');
      }
    }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid graph structure received from Dify');
  }

  const nodes = Array.isArray(raw.nodes) ? raw.nodes : [];
  let relationships = Array.isArray(raw.relationships)
    ? raw.relationships
    : (Array.isArray(raw.edges) ? raw.edges : []);

  // Filter out invalid Person -> USES_TECHNOLOGY relationships
  relationships = relationships.filter((rel: any) => {
    const sourceNode = nodes.find((n: any) => n.id === rel.source || n.name === rel.source);
    const isPersonSource = sourceNode?.type?.toLowerCase() === 'person' || String(rel.source).toLowerCase() === 'person';
    if (isPersonSource && (rel.type === 'USES_TECHNOLOGY' || rel.type === 'USES')) {
      return false;
    }
    return true;
  });

  return {
    person: raw.person || { name: 'Indraj Gupta' },
    nodes: nodes.map((n: any, idx: number) => ({
      id: String(n.id || `node-${idx}-${n.name?.toLowerCase().replace(/\s+/g, '-')}`),
      type: String(n.type || 'skill').toLowerCase(),
      name: String(n.name || n.label || 'Untitled'),
      description: n.description || '',
      metadata: {
        ...(n.metadata || {}),
        confidence: n.confidence,
      },
      evidenceStatus: (n.evidence_state || n.evidenceStatus || (n.type?.toLowerCase() === 'project' ? 'demonstrated' : 'used')).toLowerCase(),
    })),
    relationships: relationships.map((r: any) => ({
      source: String(r.source),
      target: String(r.target),
      type: String(r.type || 'RELATED_TO').toUpperCase(),
      label: r.label || r.type,
    })),
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
    uncertain_items: Array.isArray(raw.uncertain_items) ? raw.uncertain_items : [],
  };
}

/**
 * Core analysis engine called by server-side /api/analyze route.
 */
export async function executeAnalyze(params: {
  professionalInformation: string;
  authToken?: string | null;
  difyApiUrl?: string;
  difyApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}): Promise<{ status: number; body: Record<string, any> }> {
  const {
    professionalInformation,
    authToken,
    difyApiUrl = process.env.DIFY_API_URL || '',
    difyApiKey = process.env.DIFY_API_KEY || '',
    supabaseUrl = process.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '',
  } = params;

  // 1. Input Validation
  if (!professionalInformation || typeof professionalInformation !== 'string' || !professionalInformation.trim()) {
    return {
      status: 400,
      body: { error: 'Validation error: "professional_information" is required and cannot be empty.' },
    };
  }

  // 2. Supabase Auth Verification (if auth token present)
  let userId = 'user_demo_guest';

  if (supabaseUrl && supabaseAnonKey && authToken) {
    try {
      const cleanToken = authToken.replace(/^Bearer\s+/i, '');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user }, error: authError } = await supabase.auth.getUser(cleanToken);

      if (!authError && user) {
        userId = user.id;
      }
    } catch (err) {
      console.warn('[API /api/analyze] Non-blocking Supabase auth verification:', err);
    }
  }

  // 3. Verify Dify Configuration (Server-Side)
  const effectiveDifyApiKey = difyApiKey.trim();
  const effectiveDifyApiUrl = difyApiUrl.trim();

  if (!effectiveDifyApiKey || !effectiveDifyApiUrl) {
    return {
      status: 503,
      body: {
        error: 'Dify integration is not configured. Please ensure DIFY_API_URL and DIFY_API_KEY are configured in .env.local.',
      },
    };
  }

  // 4. URL Normalization
  const { baseUrl, workflowEndpoint } = normalizeDifyUrl(effectiveDifyApiUrl);

  // Safe debugging logs (never log keys or tokens)
  console.log(`[Dify Safe Log] Dify base URL: ${baseUrl}`);
  console.log(`[Dify Safe Log] Dify final endpoint: ${workflowEndpoint}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    // 5. Call Dify Workflow API
    let difyResponse = await fetch(workflowEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveDifyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          professional_information: professionalInformation.trim(),
        },
        response_mode: 'blocking',
        user: userId,
      }),
      signal: controller.signal,
    });

    console.log(`[Dify Safe Log] HTTP status: ${difyResponse.status}`);

    let rawData: any;
    let responseText = '';

    // Handle case where Dify app mode is configured as chatflow / advanced-chat
    if (difyResponse.status === 400) {
      responseText = await difyResponse.text();
      let isNotWorkflow = false;
      try {
        const parsedErr = JSON.parse(responseText);
        if (parsedErr.code === 'not_workflow_app') {
          isNotWorkflow = true;
        }
      } catch (e) {
        // Not JSON
      }

      if (isNotWorkflow) {
        const chatEndpoint = `${baseUrl}/v1/chat-messages`;
        console.log(`[Dify Safe Log] App mode is chatflow. Invoking endpoint: ${chatEndpoint}`);

        difyResponse = await fetch(chatEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveDifyApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              professional_information: professionalInformation.trim(),
            },
            query: professionalInformation.trim(),
            response_mode: 'blocking',
            user: userId,
          }),
          signal: controller.signal,
        });

        console.log(`[Dify Safe Log] Chatflow HTTP status: ${difyResponse.status}`);
      }
    }

    clearTimeout(timeoutId);

    if (!difyResponse.ok) {
      const errorText = responseText || await difyResponse.text();
      const safeSnippet = errorText.slice(0, 300);
      console.log(`[Dify Safe Log] Response status: ${difyResponse.statusText}`);
      console.log(`[Dify Safe Log] Response body: ${safeSnippet}`);

      return {
        status: 502,
        body: {
          error: `Dify AI workflow service returned status ${difyResponse.status}: ${safeSnippet}`,
        },
      };
    }

    rawData = await difyResponse.json();
    console.log(`[Dify Safe Log] Response status: success (task: ${rawData.task_id || rawData.data?.id || 'ok'})`);
    console.log(`[Dify Safe Log] Response body: received structured payload from Dify`);

    if (rawData.data?.status === 'failed') {
      return {
        status: 502,
        body: {
          error: rawData.data?.error || 'Dify workflow execution failed.',
        },
      };
    }

    // Extract outputs from either workflow outputs or chat answer
    const outputs = rawData.data?.outputs || rawData.outputs || rawData.answer;
    if (!outputs) {
      return {
        status: 502,
        body: {
          error: 'Dify workflow completed but produced no structured outputs.',
        },
      };
    }

    // 6. Parse and extract structured CapabilityGraph JSON
    const structuredGraph = extractGraphFromDifyOutputs(outputs);

    return {
      status: 200,
      body: {
        success: true,
        workflow_run_id: rawData.workflow_run_id || rawData.data?.id || rawData.id,
        user_id: userId,
        data: structuredGraph,
      },
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        status: 504,
        body: { error: 'Dify workflow request timed out after 60 seconds.' },
      };
    }
    console.error('[API /api/analyze Error]:', err.message || err);
    return {
      status: 500,
      body: { error: 'Unable to build your capability graph: Internal server error while contacting AI workflow.' },
    };
  }
}

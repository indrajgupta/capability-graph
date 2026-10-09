// src/services/aiService.ts
// Frontend client for /api/analyze
// Communicates strictly with the secure server-side Dify workflow proxy.
// No fallback mock data is injected on failures.

import { supabase } from '../lib/supabase';
import type { StructuredGraphResult } from '../server/analyzeHandler';

export interface AnalyzeResponse {
  success: boolean;
  data?: StructuredGraphResult;
  error?: string;
  isMockFallback?: boolean;
}

/**
 * Standard test graph for manual "Demo Preview" only.
 * Must NEVER be used as a fallback for user input.
 */
export function getStandardTestFallback(): StructuredGraphResult {
  return {
    person: {
      name: 'Indraj Gupta (Demo Preview)',
      title: 'Full-Stack & AI Engineer',
    },
    nodes: [
      { id: 'person', type: 'person', name: 'Indraj Gupta (Demo Preview)', description: 'Static demonstration graph' },
      { id: 'project-farmseva', type: 'project', name: 'FarmSeva', description: 'Agricultural equipment rental platform.' },
      { id: 'tech-react', type: 'technology', name: 'React', description: 'UI library for dynamic interfaces' },
      { id: 'tech-vite', type: 'technology', name: 'Vite', description: 'Modern frontend build tool' },
      { id: 'tech-supabase', type: 'technology', name: 'Supabase', description: 'Authentication and PostgreSQL database' },
      { id: 'tech-lyzr', type: 'technology', name: 'Lyzr', description: 'Agentic AI integration framework' },
      { id: 'tech-vercel', type: 'technology', name: 'Vercel', description: 'Edge deployment platform' },
      { id: 'skill-react', type: 'skill', name: 'React', description: 'Frontend engineering and component design' },
      { id: 'skill-python', type: 'skill', name: 'Python', description: 'Backend and data scripting' },
      { id: 'skill-ai-integration', type: 'skill', name: 'AI Integration', description: 'Orchestrating agents and AI workflows' },
      { id: 'evidence-github', type: 'evidence', name: 'GitHub Repository', description: 'Source code repository for FarmSeva' },
    ],
    relationships: [
      { source: 'person', target: 'project-farmseva', type: 'BUILT', label: 'BUILT' },
      { source: 'project-farmseva', target: 'tech-react', type: 'USES_TECHNOLOGY', label: 'USES' },
      { source: 'project-farmseva', target: 'tech-vite', type: 'USES_TECHNOLOGY', label: 'USES' },
      { source: 'project-farmseva', target: 'tech-supabase', type: 'USES_TECHNOLOGY', label: 'USES' },
      { source: 'project-farmseva', target: 'tech-lyzr', type: 'USES_TECHNOLOGY', label: 'USES' },
      { source: 'project-farmseva', target: 'tech-vercel', type: 'USES_TECHNOLOGY', label: 'USES' },
      { source: 'person', target: 'skill-react', type: 'HAS_SKILL', label: 'HAS SKILL' },
      { source: 'person', target: 'skill-python', type: 'HAS_SKILL', label: 'HAS SKILL' },
      { source: 'person', target: 'skill-ai-integration', type: 'HAS_SKILL', label: 'HAS SKILL' },
      { source: 'project-farmseva', target: 'evidence-github', type: 'SUPPORTED_BY', label: 'SUPPORTED BY' },
    ],
    evidence: [
      { id: 'ev-github-1', title: 'GitHub Repository', type: 'repository', url: 'https://github.com/indraj/farmseva', nodeId: 'project-farmseva' },
    ],
    uncertain_items: [],
  };
}

export async function analyzeProfessionalInformation(
  text: string
): Promise<AnalyzeResponse> {
  if (!text || !text.trim()) {
    return {
      success: false,
      error: 'Please enter your professional information before analyzing.',
    };
  }

  try {
    // Get session token if Supabase is active
    let token: string | undefined;
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        professional_information: text.trim(),
      }),
    });

    const resJson = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: resJson.error || `Unable to build your capability graph (HTTP ${response.status}).`,
      };
    }

    if (!resJson.data) {
      return {
        success: false,
        error: 'Unable to build your capability graph: Invalid response received from AI workflow.',
      };
    }

    return {
      success: true,
      data: resJson.data as StructuredGraphResult,
    };
  } catch (err: any) {
    console.error('[AI Service Error]:', err);
    return {
      success: false,
      error: err.message || 'Unable to build your capability graph: Network error connecting to analysis server.',
    };
  }
}

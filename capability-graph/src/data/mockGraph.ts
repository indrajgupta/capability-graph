// src/data/mockGraph.ts
// Realistic demo graph data for Indraj Gupta.
// Supports progressive disclosure, capability metrics calculation, and multi-layout rendering.

import type { GraphNodeData, GraphEdgeData, NodeType } from '../types/graph';
import type { Node, Edge } from '@xyflow/react';

export const mockNodes: GraphNodeData[] = [
  // Person (central root anchor)
  {
    id: 'person_indraj',
    type: 'person',
    name: 'Indraj Gupta',
    description: 'AI/ML Developer building software with AI, automation and modern web technologies.',
    evidenceStatus: 'verified',
    metadata: {
      headline: 'AI/ML Developer & Full-Stack Engineer',
      location: 'Bengaluru, India',
      github: 'https://github.com/indraj',
      linkedin: 'https://linkedin.com/in/indraj',
    },
  },

  // Core Capabilities (First major entities around Person)
  {
    id: 'cap_frontend',
    type: 'capability',
    name: 'Frontend Development',
    evidenceStatus: 'demonstrated',
    description: 'Building fluid, responsive, accessible web interfaces with modern reactive architectures.',
    metadata: { domain: 'Web Engineering', level: 'Expert' },
  },
  {
    id: 'cap_fullstack',
    type: 'capability',
    name: 'Full-Stack Development',
    evidenceStatus: 'demonstrated',
    description: 'End-to-end web applications from relational database schema to real-time interactive UI.',
    metadata: { domain: 'Full-Stack Architecture', level: 'Advanced' },
  },
  {
    id: 'cap_ai',
    type: 'capability',
    name: 'AI Integration',
    evidenceStatus: 'demonstrated',
    description: 'Embedding LLMs, reasoning workflows, RAG, and agent frameworks into real-world software.',
    metadata: { domain: 'Applied AI', level: 'Specialist' },
  },
  {
    id: 'cap_db',
    type: 'capability',
    name: 'Database Integration',
    evidenceStatus: 'demonstrated',
    description: 'Relational data modeling, foreign keys, row level security (RLS), and Postgres optimization.',
    metadata: { domain: 'Data Architecture', level: 'Advanced' },
  },
  {
    id: 'cap_auto',
    type: 'capability',
    name: 'Automation',
    evidenceStatus: 'used',
    description: 'Automated CI/CD workflows, build orchestration, and agentic task execution pipelines.',
    metadata: { domain: 'DevOps & Tooling', level: 'Intermediate' },
  },

  // Supporting Skills (Honest evidence states: demonstrated, used, claimed)
  { id: 'skill_aiml',    type: 'skill', name: 'AI/ML',            evidenceStatus: 'demonstrated', description: 'Prompt engineering, RAG, agentic workflows, and LLM orchestration.' },
  { id: 'skill_python',  type: 'skill', name: 'Python',           evidenceStatus: 'demonstrated', description: 'Core programming language for backend AI workflows and data processing.' },
  { id: 'skill_react',   type: 'skill', name: 'React',            evidenceStatus: 'demonstrated', description: 'Modern reactive frontend development with state management.' },
  { id: 'skill_problem', type: 'skill', name: 'Problem Solving',  evidenceStatus: 'demonstrated', description: 'End-to-end architecture design and production debugging.' },
  { id: 'skill_ds',      type: 'skill', name: 'Data Structures',  evidenceStatus: 'used',         description: 'Graph algorithms, hash indexing, and efficient traversal.' },
  { id: 'skill_system',  type: 'skill', name: 'System Design',    evidenceStatus: 'claimed',      description: 'Distributed services and caching patterns (awaiting large-scale project link).' },

  // Supporting Technologies
  { id: 'tech_react',      type: 'technology', name: 'React',      evidenceStatus: 'demonstrated', description: 'Component-based UI library used in all major projects.' },
  { id: 'tech_typescript', type: 'technology', name: 'TypeScript', evidenceStatus: 'demonstrated', description: 'Strict type safety across frontend and API layers.' },
  { id: 'tech_vite',       type: 'technology', name: 'Vite',       evidenceStatus: 'demonstrated', description: 'Next-generation frontend tooling and bundler.' },
  { id: 'tech_supabase',   type: 'technology', name: 'Supabase',   evidenceStatus: 'demonstrated', description: 'Postgres database, Auth, and Storage backend.' },
  { id: 'tech_lyzr',       type: 'technology', name: 'Lyzr',       evidenceStatus: 'demonstrated', description: 'Agentic AI framework used for conversational workflow automation.' },
  { id: 'tech_claude',     type: 'technology', name: 'Claude',     evidenceStatus: 'demonstrated', description: 'LLM reasoning engine for deep entity extraction.' },
  { id: 'tech_vercel',     type: 'technology', name: 'Vercel',     evidenceStatus: 'demonstrated', description: 'Serverless deployment and edge distribution platform.' },
  { id: 'tech_tailwind',   type: 'technology', name: 'Tailwind',   evidenceStatus: 'demonstrated', description: 'Utility-first CSS styling design system.' },

  // Projects (Supporting evidence demonstrating capabilities)
  {
    id: 'project_farmseva',
    type: 'project',
    name: 'FarmSeva',
    description: 'Agricultural machine rental platform connecting farmers to equipment. Built full-stack using React, Supabase, and integrated an AI assistant using Lyzr.',
    metadata: {
      github: 'https://github.com/indraj/farmseva',
      demo: 'https://farmseva.app',
      role: 'Lead Full-Stack & AI Developer',
      period: '2025 - Present',
    },
    evidenceStatus: 'demonstrated',
  },
  {
    id: 'project_unplug',
    type: 'project',
    name: 'Unplug',
    description: 'Digital wellness app helping users manage screen time and build healthier tech habits with smart analytics.',
    metadata: {
      github: 'https://github.com/indraj/unplug',
      role: 'Frontend & System Architect',
      period: '2024 - 2025',
    },
    evidenceStatus: 'demonstrated',
  },
  {
    id: 'project_capgraph',
    type: 'project',
    name: 'CapabilityGraph',
    description: 'AI-powered professional identity platform that transforms skills, projects, and evidence into an interactive capability graph.',
    metadata: {
      github: 'https://github.com/indraj/capabilitygraph',
      demo: 'https://capabilitygraph.app',
      role: 'Product Designer & Full-Stack Engineer',
      period: '2026',
    },
    evidenceStatus: 'demonstrated',
  },

  // Experience
  {
    id: 'exp_lead',
    type: 'experience',
    name: 'AI Full-Stack Lead',
    description: 'Leading architecture and graph design for AI-driven applications and agricultural tech tools.',
    evidenceStatus: 'demonstrated',
    metadata: { company: 'Independent / Studio', period: '2024 - Present' },
  },
  {
    id: 'exp_intern',
    type: 'experience',
    name: 'Frontend Engineer',
    description: 'Developed modern React and TypeScript web client modules with responsive styling.',
    evidenceStatus: 'verified',
    metadata: { company: 'Tech Innovators', period: '2023 - 2024' },
  },

  // Education
  {
    id: 'edu_cs',
    type: 'education',
    name: 'B.Tech in Computer Science',
    description: 'Undergraduate degree focusing on Algorithms, Operating Systems, and AI/ML.',
    evidenceStatus: 'verified',
    metadata: { institution: 'Institute of Technology', year: '2021 - 2025' },
  },

  // Certification
  {
    id: 'cert_deeplearning',
    type: 'certification',
    name: 'Deep Learning Specialization',
    description: 'Neural Networks, Deep Learning, and Vector Embeddings by DeepLearning.AI.',
    evidenceStatus: 'verified',
    metadata: { issuer: 'DeepLearning.AI / Coursera', year: '2024', credentialId: 'DL-89410' },
  },

  // Evidence
  {
    id: 'ev_github',
    type: 'evidence',
    name: 'GitHub Repository',
    description: 'Source code for FarmSeva demonstrating React, Supabase, and Lyzr integration.',
    metadata: { url: 'https://github.com/indraj/farmseva', type: 'repository' },
    evidenceStatus: 'verified',
  },
  {
    id: 'ev_demo',
    type: 'evidence',
    name: 'Live Demo',
    description: 'Deployed production application accessible on the web.',
    metadata: { url: 'https://farmseva.app', type: 'deployment' },
    evidenceStatus: 'verified',
  },
  {
    id: 'ev_cert_badge',
    type: 'evidence',
    name: 'Verified Certificate Credential',
    description: 'Cryptographically signed credential proof from DeepLearning.AI.',
    metadata: { url: 'https://coursera.org/verify/DL-89410', type: 'certificate' },
    evidenceStatus: 'verified',
  },
];

export const mockEdges: GraphEdgeData[] = [
  // ─── 1. PERSON → CORE CAPABILITIES & ANCHOR SKILLS ───
  // Person is the root anchor. Capabilities are the first major entities visible around Person.
  { id: 'e_p_cap_frontend',  source: 'person_indraj', target: 'cap_frontend',  type: 'HAS_CAPABILITY', label: 'HAS CAPABILITY' },
  { id: 'e_p_cap_fullstack', source: 'person_indraj', target: 'cap_fullstack', type: 'HAS_CAPABILITY', label: 'HAS CAPABILITY' },
  { id: 'e_p_cap_ai',        source: 'person_indraj', target: 'cap_ai',        type: 'HAS_CAPABILITY', label: 'HAS CAPABILITY' },
  { id: 'e_p_cap_db',        source: 'person_indraj', target: 'cap_db',        type: 'HAS_CAPABILITY', label: 'HAS CAPABILITY' },
  { id: 'e_p_cap_auto',      source: 'person_indraj', target: 'cap_auto',      type: 'HAS_CAPABILITY', label: 'HAS CAPABILITY' },
  { id: 'e_p_sk_aiml',       source: 'person_indraj', target: 'skill_aiml',    type: 'HAS_SKILL',      label: 'HAS SKILL' },
  { id: 'e_p_sk_problem',    source: 'person_indraj', target: 'skill_problem', type: 'HAS_SKILL',      label: 'HAS SKILL' },

  // ─── 2. CORE CAPABILITIES → SUPPORTING SKILLS & TECHNOLOGIES ───
  // Frontend Development
  { id: 'e_cap_front_react',  source: 'cap_frontend', target: 'skill_react',      type: 'REQUIRES_SKILL',   label: 'REQUIRES SKILL' },
  { id: 'e_cap_front_ts',     source: 'cap_frontend', target: 'tech_typescript',  type: 'USES_TECHNOLOGY',  label: 'USES TECHNOLOGY' },
  { id: 'e_cap_front_tw',     source: 'cap_frontend', target: 'tech_tailwind',    type: 'USES_TECHNOLOGY',  label: 'USES TECHNOLOGY' },

  // AI Integration
  { id: 'e_cap_ai_python',    source: 'cap_ai', target: 'skill_python',   type: 'REQUIRES_SKILL',  label: 'REQUIRES SKILL' },
  { id: 'e_cap_ai_aiml',      source: 'cap_ai', target: 'skill_aiml',     type: 'REQUIRES_SKILL',  label: 'REQUIRES SKILL' },
  { id: 'e_cap_ai_lyzr',      source: 'cap_ai', target: 'tech_lyzr',       type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },
  { id: 'e_cap_ai_claude',    source: 'cap_ai', target: 'tech_claude',     type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },

  // Full-Stack Development
  { id: 'e_cap_fs_react',     source: 'cap_fullstack', target: 'tech_react',    type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },
  { id: 'e_cap_fs_sub',       source: 'cap_fullstack', target: 'tech_supabase', type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },
  { id: 'e_cap_fs_sys',       source: 'cap_fullstack', target: 'skill_system',  type: 'REQUIRES_SKILL',  label: 'REQUIRES SKILL' },

  // Database Integration
  { id: 'e_cap_db_sub',       source: 'cap_db', target: 'tech_supabase', type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },
  { id: 'e_cap_db_ds',        source: 'cap_db', target: 'skill_ds',       type: 'REQUIRES_SKILL',  label: 'REQUIRES SKILL' },

  // Automation
  { id: 'e_cap_auto_vercel',  source: 'cap_auto', target: 'tech_vercel', type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },
  { id: 'e_cap_auto_vite',    source: 'cap_auto', target: 'tech_vite',   type: 'USES_TECHNOLOGY', label: 'USES TECHNOLOGY' },

  // ─── 3. PROJECTS → CAPABILITIES (DEMONSTRATES) ───
  // Projects connect to capabilities/skills they demonstrate (acting as supporting evidence).
  { id: 'e_farm_frontend',  source: 'project_farmseva', target: 'cap_frontend',  type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_farm_ai',        source: 'project_farmseva', target: 'cap_ai',        type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_farm_fullstack', source: 'project_farmseva', target: 'cap_fullstack', type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_farm_db',        source: 'project_farmseva', target: 'cap_db',        type: 'DEMONSTRATES', label: 'DEMONSTRATES' },

  { id: 'e_unplug_frontend',  source: 'project_unplug', target: 'cap_frontend',  type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_unplug_fullstack', source: 'project_unplug', target: 'cap_fullstack', type: 'DEMONSTRATES', label: 'DEMONSTRATES' },

  { id: 'e_capgraph_ai',        source: 'project_capgraph', target: 'cap_ai',        type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_capgraph_fullstack', source: 'project_capgraph', target: 'cap_fullstack', type: 'DEMONSTRATES', label: 'DEMONSTRATES' },
  { id: 'e_capgraph_auto',      source: 'project_capgraph', target: 'cap_auto',      type: 'DEMONSTRATES', label: 'DEMONSTRATES' },

  // ─── 4. PROJECTS → TECHNOLOGIES (USES_TECHNOLOGY) ───
  { id: 'e_farm_tech_react',    source: 'project_farmseva', target: 'tech_react',    type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_farm_tech_vite',     source: 'project_farmseva', target: 'tech_vite',     type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_farm_tech_supabase', source: 'project_farmseva', target: 'tech_supabase', type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_farm_tech_lyzr',     source: 'project_farmseva', target: 'tech_lyzr',     type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_farm_tech_vercel',   source: 'project_farmseva', target: 'tech_vercel',   type: 'USES_TECHNOLOGY', label: 'USES' },

  { id: 'e_unplug_tech_react',  source: 'project_unplug', target: 'tech_react',      type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_unplug_tech_ts',     source: 'project_unplug', target: 'tech_typescript', type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_unplug_tech_sub',    source: 'project_unplug', target: 'tech_supabase',   type: 'USES_TECHNOLOGY', label: 'USES' },

  { id: 'e_capgraph_tech_react',  source: 'project_capgraph', target: 'tech_react',    type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_capgraph_tech_sub',    source: 'project_capgraph', target: 'tech_supabase', type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_capgraph_tech_claude', source: 'project_capgraph', target: 'tech_claude',   type: 'USES_TECHNOLOGY', label: 'USES' },
  { id: 'e_capgraph_tech_tw',     source: 'project_capgraph', target: 'tech_tailwind', type: 'USES_TECHNOLOGY', label: 'USES' },

  // ─── 5. EVIDENCE (SUPPORTED_BY) ───
  // Attached to the entity it supports
  { id: 'e_ev_farm_gh',   source: 'project_farmseva',  target: 'ev_github',     type: 'SUPPORTED_BY', label: 'SUPPORTED BY' },
  { id: 'e_ev_farm_demo', source: 'project_farmseva',  target: 'ev_demo',       type: 'SUPPORTED_BY', label: 'SUPPORTED BY' },
  { id: 'e_ev_cap_ai_gh', source: 'cap_ai',            target: 'ev_github',     type: 'SUPPORTED_BY', label: 'SUPPORTED BY' },
  { id: 'e_ev_cert_dl',   source: 'cert_deeplearning', target: 'ev_cert_badge', type: 'SUPPORTED_BY', label: 'SUPPORTED BY' },

  // ─── 6. EXPERIENCE & EDUCATION ───
  { id: 'e_exp1', source: 'person_indraj', target: 'exp_lead',          type: 'HAS_EXPERIENCE',    label: 'EXPERIENCE' },
  { id: 'e_exp2', source: 'person_indraj', target: 'exp_intern',        type: 'HAS_EXPERIENCE',    label: 'EXPERIENCE' },
  { id: 'e_edu1', source: 'person_indraj', target: 'edu_cs',            type: 'HAS_EDUCATION',     label: 'EDUCATION' },
  { id: 'e_crt1', source: 'person_indraj', target: 'cert_deeplearning', type: 'HAS_CERTIFICATION', label: 'CERTIFICATION' },
  { id: 'e_exp_proj', source: 'exp_lead',  target: 'project_farmseva',   type: 'WORKED_ON',         label: 'WORKED ON' },
];

// ─── Topological Capability Metrics Calculation ─────────────────────────
// Calculates realistic prominence based on supporting relationships and evidence.
export interface CapabilityMetric {
  id: string;
  name: string;
  supportingProjectIds: string[];
  supportingSkillTechIds: string[];
  evidenceIds: string[];
  evidenceScore: number;
  totalScore: number;
  isCore: boolean;
  priorityLevel: 'high' | 'medium' | 'low';
}

export function calculateCapabilityMetrics(
  nodes: GraphNodeData[],
  edges: GraphEdgeData[]
): Map<string, CapabilityMetric> {
  const metrics = new Map<string, CapabilityMetric>();
  const nodesMap = new Map<string, GraphNodeData>(nodes.map(n => [n.id, n]));

  // Build bidirectional adjacency
  const adj = new Map<string, Array<{ target: string; type: string }>>();
  edges.forEach(e => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push({ target: e.target, type: e.type });
    adj.get(e.target)!.push({ target: e.source, type: e.type });
  });

  const capabilitiesAndSkills = nodes.filter(n => n.type === 'capability' || n.type === 'skill');

  capabilitiesAndSkills.forEach(node => {
    const neighbors = adj.get(node.id) || [];
    const supportingProjectIds: string[] = [];
    const supportingSkillTechIds: string[] = [];
    const evidenceIds: string[] = [];
    let evidenceScore = 0;

    neighbors.forEach(({ target }) => {
      const neighborNode = nodesMap.get(target);
      if (!neighborNode) return;

      if (neighborNode.type === 'project') {
        if (!supportingProjectIds.includes(neighborNode.id)) {
          supportingProjectIds.push(neighborNode.id);
        }
        // Inspect evidence attached to this supporting project
        const projectNeighbors = adj.get(neighborNode.id) || [];
        projectNeighbors.forEach(pn => {
          const pNode = nodesMap.get(pn.target);
          if (pNode && pNode.type === 'evidence' && !evidenceIds.includes(pNode.id)) {
            evidenceIds.push(pNode.id);
            if (pNode.evidenceStatus === 'verified') evidenceScore += 3;
            else if (pNode.evidenceStatus === 'demonstrated') evidenceScore += 2;
            else if (pNode.evidenceStatus === 'used') evidenceScore += 1;
            else evidenceScore += 0.5;
          }
        });
      } else if (neighborNode.type === 'technology' || (neighborNode.type === 'skill' && node.type === 'capability')) {
        if (!supportingSkillTechIds.includes(neighborNode.id)) {
          supportingSkillTechIds.push(neighborNode.id);
        }
      } else if (neighborNode.type === 'evidence') {
        if (!evidenceIds.includes(neighborNode.id)) {
          evidenceIds.push(neighborNode.id);
          if (neighborNode.evidenceStatus === 'verified') evidenceScore += 3;
          else if (neighborNode.evidenceStatus === 'demonstrated') evidenceScore += 2;
          else if (neighborNode.evidenceStatus === 'used') evidenceScore += 1;
          else evidenceScore += 0.5;
        }
      }
    });

    const totalScore = (supportingProjectIds.length * 3) +
                       (supportingSkillTechIds.length * 1.5) +
                       (evidenceScore * 2);

    const isCore = node.type === 'capability' || (node.type === 'skill' && totalScore >= 7);
    const priorityLevel: 'high' | 'medium' | 'low' =
      isCore ? 'high' : (node.type === 'skill' ? 'medium' : 'low');

    metrics.set(node.id, {
      id: node.id,
      name: node.name,
      supportingProjectIds,
      supportingSkillTechIds,
      evidenceIds,
      evidenceScore,
      totalScore,
      isCore,
      priorityLevel,
    });
  });

  return metrics;
}

// Returns the set of high-priority core entities shown on initial graph load
export function getCoreGraphNodeIds(nodes: GraphNodeData[]): Set<string> {
  const coreIds = new Set<string>();

  // If graph is small to moderate (<= 25 nodes), display all nodes so all relationships are visible immediately
  if (nodes.length <= 25) {
    nodes.forEach(n => coreIds.add(n.id));
    return coreIds;
  }

  // 1. Person anchor
  const person = nodes.find(n => n.type === 'person');
  if (person) coreIds.add(person.id);

  // 2. All Core Capabilities
  nodes.filter(n => n.type === 'capability').forEach(c => coreIds.add(c.id));

  // 3. Anchor Skills & primary skills
  const anchorSkills = ['skill_aiml', 'skill_problem', 'skill_python', 'skill_react'];
  anchorSkills.forEach(sId => {
    if (nodes.some(n => n.id === sId)) coreIds.add(sId);
  });
  nodes.filter(n => n.type === 'skill').slice(0, 6).forEach(s => coreIds.add(s.id));

  // 4. Primary Projects (up to 4)
  nodes.filter(n => n.type === 'project').slice(0, 4).forEach(p => coreIds.add(p.id));

  // 5. Primary Technologies (up to 6)
  nodes.filter(n => n.type === 'technology').slice(0, 6).forEach(t => coreIds.add(t.id));

  return coreIds;
}

// ─── Dynamic Layout Generators ──────────────────────────────────────────

export function computeLayoutPositions(
  nodes: GraphNodeData[],
  layout: 'radial' | 'hierarchical' | 'force',
  edges: GraphEdgeData[] = mockEdges
): Record<string, { x: number; y: number }> {
  const result: Record<string, { x: number; y: number }> = {};
  const centerX = 500;
  const centerY = 340;

  if (layout === 'hierarchical') {
    // Level 0: Person (y = 40)
    // Level 1: Core Capabilities & Primary Skills (y = 200)
    // Level 2: Supporting Skills & Technologies (y = 380)
    // Level 3: Projects (y = 560)
    // Level 4: Evidence & Credentials (y = 740)
    const tiers: Record<number, GraphNodeData[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    nodes.forEach(n => {
      if (n.type === 'person') {
        tiers[0].push(n);
      } else if (n.type === 'capability') {
        tiers[1].push(n);
      } else if (n.type === 'skill') {
        // High priority skills in level 1, supporting skills in level 2
        if (n.id === 'skill_aiml' || n.id === 'skill_problem') tiers[1].push(n);
        else tiers[2].push(n);
      } else if (n.type === 'technology') {
        tiers[2].push(n);
      } else if (n.type === 'project' || n.type === 'experience') {
        tiers[3].push(n);
      } else {
        tiers[4].push(n);
      }
    });

    const tierY = [40, 200, 380, 560, 740];

    Object.entries(tiers).forEach(([tierIndexStr, tierNodes]) => {
      const tierIndex = Number(tierIndexStr);
      const y = tierY[tierIndex];
      const count = tierNodes.length;
      if (count === 0) return;
      const spacing = Math.max(130, Math.min(220, 1100 / (count + 1)));
      const startX = centerX - ((count - 1) * spacing) / 2;

      tierNodes.forEach((node, i) => {
        result[node.id] = { x: Math.round(startX + i * spacing), y };
      });
    });

    return result;
  }

  if (layout === 'force') {
    // Organic clustering around the Person and Core Capabilities
    result['person_indraj'] = { x: centerX, y: centerY };

    const caps = nodes.filter(n => n.type === 'capability');
    caps.forEach((n, i) => {
      const angle = (i * 2 * Math.PI) / (caps.length || 1) - Math.PI / 2;
      result[n.id] = {
        x: Math.round(centerX + 210 * Math.cos(angle)),
        y: Math.round(centerY + 180 * Math.sin(angle)),
      };
    });

    const others = nodes.filter(n => n.type !== 'person' && n.type !== 'capability');
    others.forEach((n, i) => {
      const angle = (i * 2 * Math.PI) / (others.length || 1);
      const radius = 370 + (i % 3) * 60;
      result[n.id] = {
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + (radius - 40) * Math.sin(angle)),
      };
    });

    return result;
  }

  // ─── Default: RADIAL Layout (Concentric Progressive Rings) ───
  // Ring 0: Person (Center)
  result['person_indraj'] = { x: centerX, y: centerY };

  // Ring 1: Core Capabilities & Anchor Skills (Radius: 210)
  // These form the immediate first ring around Person: "What can this person do?"
  const ring1Caps = nodes.filter(n => n.type === 'capability');
  const ring1Skills = nodes.filter(n => n.id === 'skill_aiml' || n.id === 'skill_problem');
  const ring1 = [...ring1Caps, ...ring1Skills];

  const capAngleMap = new Map<string, number>();

  ring1.forEach((n, i) => {
    const angle = (i * 2 * Math.PI) / (ring1.length || 1) - Math.PI / 2;
    capAngleMap.set(n.id, angle);
    result[n.id] = {
      x: Math.round(centerX + 220 * Math.cos(angle)),
      y: Math.round(centerY + 190 * Math.sin(angle)),
    };
  });

  // Ring 2: Supporting Skills, Technologies, and Projects (Radius: 380 - 430)
  const ring2 = nodes.filter(n =>
    n.type === 'project' ||
    n.type === 'technology' ||
    (n.type === 'skill' && n.id !== 'skill_aiml' && n.id !== 'skill_problem')
  );

  // Position supporting items close to their connected capabilities when possible
  ring2.forEach((n, i) => {
    // Find connected capability in edges
    const connectedCapEdge = edges.find(e =>
      (e.source === n.id && capAngleMap.has(e.target)) ||
      (e.target === n.id && capAngleMap.has(e.source))
    );
    const parentCapId = connectedCapEdge
      ? (capAngleMap.has(connectedCapEdge.source) ? connectedCapEdge.source : connectedCapEdge.target)
      : null;

    let baseAngle = (i * 2 * Math.PI) / (ring2.length || 1);
    if (parentCapId && capAngleMap.has(parentCapId)) {
      const parentAngle = capAngleMap.get(parentCapId)!;
      // Stagger slightly around parent angle
      const jitter = ((i % 4) - 1.5) * 0.28;
      baseAngle = parentAngle + jitter;
    }

    const radius = n.type === 'project' ? 360 : 420;
    result[n.id] = {
      x: Math.round(centerX + radius * Math.cos(baseAngle)),
      y: Math.round(centerY + (radius - 30) * Math.sin(baseAngle)),
    };
  });

  // Ring 3: Evidence, Experience, Education, Certification (Radius: 540)
  const ring3 = nodes.filter(n =>
    n.type === 'evidence' ||
    n.type === 'experience' ||
    n.type === 'education' ||
    n.type === 'certification'
  );

  ring3.forEach((n, i) => {
    const angle = (i * 2 * Math.PI) / (ring3.length || 1) + Math.PI / 8;
    result[n.id] = {
      x: Math.round(centerX + 530 * Math.cos(angle)),
      y: Math.round(centerY + 440 * Math.sin(angle)),
    };
  });

  // Fallback for any unassigned nodes
  nodes.forEach(n => {
    if (!result[n.id]) {
      result[n.id] = {
        x: centerX + Math.round((Math.random() - 0.5) * 600),
        y: centerY + Math.round((Math.random() - 0.5) * 500),
      };
    }
  });

  return result;
}

// Convert our data model to React Flow format
export function buildReactFlowData(
  nodes: GraphNodeData[],
  edges: GraphEdgeData[],
  layout: 'radial' | 'hierarchical' | 'force' = 'radial',
  expandedNodeIds?: Set<string>
): { nodes: Node[]; edges: Edge[] } {
  const positions = computeLayoutPositions(nodes, layout, edges);
  const metrics = calculateCapabilityMetrics(nodes, edges);

  const rfNodes: Node[] = nodes.map((n) => {
    const metric = metrics.get(n.id);
    const isCore = n.type === 'capability' || !!metric?.isCore;
    const isExpanded = expandedNodeIds ? expandedNodeIds.has(n.id) : false;
    const supportingCount = (metric?.supportingProjectIds.length || 0) + (metric?.supportingSkillTechIds.length || 0);

    return {
      id: n.id,
      type: n.type,
      position: positions[n.id] ?? { x: 500, y: 340 },
      data: {
        ...n,
        isCoreCapability: isCore,
        supportingCount,
        isExpanded,
        priorityLevel: metric?.priorityLevel ?? (n.type === 'person' ? 'high' : 'medium'),
      },
      draggable: true,
    };
  });

  const rfEdges: Edge[] = edges.map((e) => {
    const isCoreEdge = e.type === 'HAS_CAPABILITY' || e.type === 'DEMONSTRATES';

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'default',
      label: e.label || e.type.replace(/_/g, ' '),
      data: { relationship: e.type },
      style: {
        stroke: isCoreEdge ? 'rgba(232,121,249,0.65)' : 'rgba(96,165,250,0.45)',
        strokeWidth: isCoreEdge ? 2 : 1.5,
      },
      labelStyle: { fill: '#94a3b8', fontSize: 9.5, fontWeight: 500 },
      labelBgStyle: { fill: 'rgba(13,17,23,0.85)', padding: '2px 5px', rx: 3, ry: 3 },
      animated: false,
    };
  });

  return { nodes: rfNodes, edges: rfEdges };
}

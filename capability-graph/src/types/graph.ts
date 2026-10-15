// src/types/graph.ts
// Canonical type definitions for CapabilityGraph nodes, edges, and related structures.

export const NODE_TYPES = [
  'person',
  'project',
  'skill',
  'technology',
  'capability',
  'experience',
  'education',
  'evidence',
  'certification',
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

// Provide runtime object for bundlers requiring named exports
export const NodeType = {
  Person: 'person',
  Project: 'project',
  Skill: 'skill',
  Technology: 'technology',
  Capability: 'capability',
  Experience: 'experience',
  Education: 'education',
  Evidence: 'evidence',
  Certification: 'certification',
} as const;

export type RelationshipType =
  | 'HAS_SKILL'
  | 'HAS_CAPABILITY'
  | 'REQUIRES_SKILL'
  | 'USES_TECHNOLOGY'
  | 'BUILT'
  | 'DEMONSTRATES'
  | 'SUPPORTED_BY'
  | 'HAS_EXPERIENCE'
  | 'HAS_EDUCATION'
  | 'HAS_CERTIFICATION'
  | 'WORKED_ON'
  | 'RELATED_TO';

export const RelationshipType = {
  HAS_SKILL: 'HAS_SKILL',
  HAS_CAPABILITY: 'HAS_CAPABILITY',
  REQUIRES_SKILL: 'REQUIRES_SKILL',
  USES_TECHNOLOGY: 'USES_TECHNOLOGY',
  BUILT: 'BUILT',
  DEMONSTRATES: 'DEMONSTRATES',
  SUPPORTED_BY: 'SUPPORTED_BY',
  HAS_EXPERIENCE: 'HAS_EXPERIENCE',
  HAS_EDUCATION: 'HAS_EDUCATION',
  HAS_CERTIFICATION: 'HAS_CERTIFICATION',
  WORKED_ON: 'WORKED_ON',
  RELATED_TO: 'RELATED_TO',
} as const;

export type EvidenceStatus = 'claimed' | 'used' | 'demonstrated' | 'verified';

export interface GraphNodeData {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  evidenceStatus?: EvidenceStatus;
  // Computed/UI state
  selected?: boolean;
  connected?: boolean;
  dimmed?: boolean;
  isCoreCapability?: boolean;
  supportingCount?: number;
  isExpanded?: boolean;
  priorityLevel?: 'high' | 'medium' | 'low';
  [key: string]: unknown;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label?: string;
}

// The shape of data the AI layer produces (maps directly to Supabase schema)
export interface AIGraphOutput {
  nodes: Array<{
    id: string;
    type: NodeType;
    name: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: RelationshipType;
  }>;
}

export interface GraphRecord {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  node_count?: number;
  edge_count?: number;
}

/**
 * Type guard to validate whether an unknown object is valid GraphNodeData.
 * Confirms required fields 'id', 'name', and 'type' exist and are non-empty strings.
 */
export function isGraphNodeData(data: unknown): data is GraphNodeData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    d.id.length > 0 &&
    typeof d.name === 'string' &&
    typeof d.type === 'string'
  );
}

/**
 * Safe mapping function to convert loosely-typed or external node data into GraphNodeData.
 * Falls back gracefully if data is missing optional properties or has an alternate shape.
 */
export function toGraphNodeData(data: unknown, fallbackId = ''): GraphNodeData | null {
  if (isGraphNodeData(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const id = typeof d.id === 'string' && d.id.length > 0 ? d.id : fallbackId;
    const name = typeof d.name === 'string' ? d.name : (typeof d.label === 'string' ? d.label : 'Unnamed Node');
    const type = (typeof d.type === 'string' && NODE_TYPES.includes(d.type as NodeType)
      ? d.type
      : 'skill') as NodeType;

    if (id) {
      return {
        id,
        name,
        type,
        ...d,
      };
    }
  }
  return null;
}


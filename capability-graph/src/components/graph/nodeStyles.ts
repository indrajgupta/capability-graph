// src/components/graph/nodeStyles.ts
// Centralized color/style definitions for each node type.
// Single source of truth — used in nodes, legend, and detail panels.

import type { NodeType } from '../../types/graph';

export interface NodeStyle {
  label: string;
  color: string;       // accent/text color
  bg: string;          // background
  border: string;      // border color
  ring: string;        // selected ring
  dot: string;         // legend dot
}

export const NODE_STYLES: Record<NodeType, NodeStyle> = {
  person: {
    label:  'Person',
    color:  '#818cf8',
    bg:     '#1e1f4a',
    border: '#3730a3',
    ring:   'rgba(129,140,248,0.5)',
    dot:    '#818cf8',
  },
  project: {
    label:  'Project',
    color:  '#34d399',
    bg:     '#0d2e24',
    border: '#065f46',
    ring:   'rgba(52,211,153,0.5)',
    dot:    '#34d399',
  },
  skill: {
    label:  'Skill',
    color:  '#fb923c',
    bg:     '#2d1a0e',
    border: '#9a3412',
    ring:   'rgba(251,146,60,0.5)',
    dot:    '#fb923c',
  },
  technology: {
    label:  'Technology',
    color:  '#60a5fa',
    bg:     '#0c1f3a',
    border: '#1d4ed8',
    ring:   'rgba(96,165,250,0.5)',
    dot:    '#60a5fa',
  },
  capability: {
    label:  'Capability',
    color:  '#e879f9',
    bg:     '#2d0f3a',
    border: '#86198f',
    ring:   'rgba(232,121,249,0.5)',
    dot:    '#e879f9',
  },
  experience: {
    label:  'Experience',
    color:  '#facc15',
    bg:     '#2d2000',
    border: '#854d0e',
    ring:   'rgba(250,204,21,0.5)',
    dot:    '#facc15',
  },
  education: {
    label:  'Education',
    color:  '#2dd4bf',
    bg:     '#0d2d2a',
    border: '#0f766e',
    ring:   'rgba(45,212,191,0.5)',
    dot:    '#2dd4bf',
  },
  evidence: {
    label:  'Evidence',
    color:  '#94a3b8',
    bg:     '#1a2133',
    border: '#334155',
    ring:   'rgba(148,163,184,0.5)',
    dot:    '#94a3b8',
  },
  certification: {
    label:  'Certification',
    color:  '#f472b6',
    bg:     '#2d1127',
    border: '#9d174d',
    ring:   'rgba(244,114,182,0.5)',
    dot:    '#f472b6',
  },
};

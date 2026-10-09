// src/components/graph/GraphLegend.tsx
// Collapsible legend showing all node types.

import React from 'react';
import { X } from 'lucide-react';
import { NODE_STYLES } from './nodeStyles';
import type { NodeType } from '../../types/graph';

const ALL_TYPES: NodeType[] = [
  'person','project','skill','technology','capability',
  'experience','education','evidence','certification',
];

interface GraphLegendProps {
  onClose: () => void;
}

export const GraphLegend: React.FC<GraphLegendProps> = ({ onClose }) => (
  <div
    style={{
      position: 'absolute', bottom: 72, right: 16, zIndex: 20,
      background: 'rgba(13,17,23,0.96)',
      border: '1px solid rgba(30,45,64,0.8)',
      borderRadius: 10, padding: '12px 14px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      minWidth: 160,
      animation: 'fadeIn 0.15s ease-out',
    }}
  >
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 10, paddingBottom: 8,
      borderBottom: '1px solid rgba(30,45,64,0.8)',
    }}>
      <span style={{
        color: '#e8edf5', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        Graph Legend
      </span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4d5c75', padding: 2 }}
      >
        <X size={12} />
      </button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {ALL_TYPES.map(type => {
        const s = NODE_STYLES[type];
        return (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: s.dot, flexShrink: 0,
              boxShadow: `0 0 4px ${s.dot}66`,
            }} />
            <span style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500 }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

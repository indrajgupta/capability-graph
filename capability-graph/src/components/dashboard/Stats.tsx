// src/components/dashboard/Stats.tsx
// Small stat strip at the bottom of the dashboard.
// Dynamically connected to graphStore for real-time metric updates.

import React, { useState, useEffect } from 'react';
import { graphStore } from '../../services/graphStore';
import type { NodeType } from '../../types/graph';

export const Stats: React.FC = () => {
  const [graphState, setGraphState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setGraphState);
  }, []);

  const count = (type: NodeType) => graphState.nodes.filter(n => n.type === type).length;

  const stats = [
    { label: 'Projects',      value: count('project') },
    { label: 'Skills',        value: count('skill') },
    { label: 'Technologies',  value: count('technology') },
    { label: 'Capabilities',  value: count('capability') },
    { label: 'Connections',   value: graphState.edges.length },
    { label: 'Evidence',      value: count('evidence') },
  ];

  return (
    <div style={{
      height: 44,
      background: '#0d1117',
      borderTop: '1px solid rgba(30,45,64,0.8)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 0,
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 5,
            padding: '0 16px',
          }}>
            <span style={{ color: '#e8edf5', fontSize: 13, fontWeight: 700 }}>{s.value}</span>
            <span style={{ color: '#4d5c75', fontSize: 11 }}>{s.label}</span>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 16, background: 'rgba(30,45,64,0.8)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

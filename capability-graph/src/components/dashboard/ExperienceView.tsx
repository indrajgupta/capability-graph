// src/components/dashboard/ExperienceView.tsx
// Work experience timeline connected to projects, capabilities, and technologies.

import React, { useState, useEffect } from 'react';
import { ArrowRight, Building, Calendar } from 'lucide-react';
import { graphStore } from '../../services/graphStore';

interface ExperienceViewProps {
  onExploreInGraph: (nodeId: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ onExploreInGraph }) => {
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);

  const expNodes = storeState.nodes.filter(n => n.type === 'experience');

  return (
    <div style={{
      flex: 1, height: '100%', overflowY: 'auto',
      padding: '28px 36px', background: '#07090f',
    }}>
      <div style={{
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '1px solid rgba(30,45,64,0.7)',
      }}>
        <h1 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, margin: 0 }}>
          Professional Experience
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
          Roles and responsibilities connected to real projects and demonstrated skills.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 800 }}>
        {expNodes.map(exp => {
          const company = (exp.metadata as any)?.company || 'Independent Tech Project';
          const period = (exp.metadata as any)?.period || '2024 - Present';

          return (
            <div
              key={exp.id}
              style={{
                background: '#0d1117',
                border: '1px solid rgba(30,45,64,0.8)',
                borderRadius: 12, padding: '22px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {exp.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, color: '#60a5fa', fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building size={13} /> {company}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                      <Calendar size={13} /> {period}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onExploreInGraph(exp.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 6,
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                    color: '#60a5fa', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  View in Graph <ArrowRight size={12} />
                </button>
              </div>

              {exp.description && (
                <p style={{ color: '#8b98b0', fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
                  {exp.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

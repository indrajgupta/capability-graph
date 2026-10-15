// src/components/dashboard/SkillsView.tsx
// Honest evidence-based skill matrix: Demonstrated, Used, Claimed.
// Strictly adheres to PRD §7: No arbitrary percentages like "Python 87%".

import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { graphStore } from '../../services/graphStore';
import type { GraphNodeData } from '../../types/graph';

interface SkillsViewProps {
  onExploreInGraph: (nodeId: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onExploreInGraph }) => {
  const [filter, setFilter] = useState<'all' | 'demonstrated' | 'used' | 'claimed'>('all');
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);

  const allSkills = storeState.nodes.filter(n => n.type === 'skill');

  const demonstratedSkills = allSkills.filter(s => s.evidenceStatus === 'demonstrated');
  const usedSkills = allSkills.filter(s => s.evidenceStatus === 'used');
  const claimedSkills = allSkills.filter(s => s.evidenceStatus === 'claimed');

  const renderSkillCard = (skill: GraphNodeData) => {

    return (
      <div
        key={skill.id}
        style={{
          background: '#0d1117',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 10, padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 10,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.4)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={12} color="#facc15" />
            </div>
            <span style={{ color: '#e8edf5', fontSize: 13.5, fontWeight: 600 }}>
              {skill.name}
            </span>
          </div>

          <button
            onClick={() => onExploreInGraph(skill.id)}
            style={{
              background: 'none', border: 'none', color: '#60a5fa',
              cursor: 'pointer', padding: '4px 6px', borderRadius: 4,
              fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            Graph <ArrowRight size={11} />
          </button>
        </div>

        {skill.description && (
          <p style={{ color: '#8b98b0', fontSize: 11.5, lineHeight: 1.5, margin: 0 }}>
            {skill.description}
          </p>
        )}

        {/* Backing projects */}
        <div style={{
          marginTop: 'auto', paddingTop: 8,
          borderTop: '1px solid rgba(30,45,64,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: '#64748b',
        }}>
          <span>
            {skill.evidenceStatus === 'demonstrated'
              ? 'Backed by verified projects'
              : skill.evidenceStatus === 'used'
              ? 'Used in workflows'
              : 'Self-declared knowledge'}
          </span>
          <span style={{
            color: skill.evidenceStatus === 'demonstrated' ? '#34d399' : skill.evidenceStatus === 'used' ? '#facc15' : '#94a3b8',
            fontWeight: 600, textTransform: 'capitalize',
          }}>
            {skill.evidenceStatus}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      flex: 1, height: '100%', overflowY: 'auto',
      padding: '28px 36px', background: '#07090f',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '1px solid rgba(30,45,64,0.7)',
      }}>
        <div>
          <h1 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, margin: 0 }}>
            Skills & Evidence Model
          </h1>
          <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
            Classified by genuine evidence proof — no arbitrary competence percentages.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 6, background: '#0d1117', padding: 4, borderRadius: 8, border: '1px solid rgba(30,45,64,0.8)' }}>
          {(['all', 'demonstrated', 'used', 'claimed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: 'none',
                background: filter === tab ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: filter === tab ? '#60a5fa' : '#64748b',
                fontSize: 11.5, fontWeight: filter === tab ? 600 : 400,
                cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.12s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {(filter === 'all' || filter === 'demonstrated') && (
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
            <h2 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Demonstrated ({demonstratedSkills.length})
            </h2>
            <span style={{ color: '#64748b', fontSize: 11.5 }}>
              — Code repositories, live demos, and artifacts support these claims
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {demonstratedSkills.map(renderSkillCard)}
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'used') && (
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#facc15' }} />
            <h2 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Used ({usedSkills.length})
            </h2>
            <span style={{ color: '#64748b', fontSize: 11.5 }}>
              — Applied in real engineering tasks and workflows
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {usedSkills.map(renderSkillCard)}
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'claimed') && (
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} />
            <h2 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Claimed ({claimedSkills.length})
            </h2>
            <span style={{ color: '#64748b', fontSize: 11.5 }}>
              — User knowledge awaiting project or credential linkage
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {claimedSkills.map(renderSkillCard)}
          </div>
        </div>
      )}
    </div>
  );
};

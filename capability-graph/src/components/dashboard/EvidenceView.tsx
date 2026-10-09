// src/components/dashboard/EvidenceView.tsx
// First-class evidence repository. Displays proof artifacts supporting claimed capabilities and skills.

import React, { useState, useEffect } from 'react';
import { LinkIcon, ExternalLink, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { graphStore } from '../../services/graphStore';
import type { GraphNodeData } from '../../types/graph';

interface EvidenceViewProps {
  onExploreInGraph: (nodeId: string) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ onExploreInGraph }) => {
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);

  const evidenceNodes = storeState.nodes.filter(n => n.type === 'evidence' || n.type === 'certification');

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
            Evidence Repository
          </h1>
          <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
            First-class graph nodes validating what you build, know, and can deliver.
          </p>
        </div>
      </div>

      {/* Evidence Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {evidenceNodes.map(ev => {
          // Find nodes that connect to this evidence
          const supportedEdges = storeState.edges.filter(e => e.target === ev.id && e.type === 'SUPPORTED_BY');
          const supportedNodes = supportedEdges.map(e => storeState.nodes.find(n => n.id === e.source)).filter(Boolean) as GraphNodeData[];

          const url = (ev.metadata as any)?.url;
          const isRepo = (ev.metadata as any)?.type === 'repository' || ev.name.includes('GitHub');

          return (
            <div
              key={ev.id}
              style={{
                background: '#0d1117',
                border: '1px solid rgba(30,45,64,0.8)',
                borderRadius: 12, padding: '20px',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.16s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(59,130,246,0.15)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isRepo ? <GithubIcon size={16} color="#60a5fa" /> : <ShieldCheck size={16} color="#34d399" />}
                  </div>
                  <div>
                    <h3 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, margin: 0 }}>
                      {ev.name}
                    </h3>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3,
                      padding: '1px 6px', borderRadius: 4,
                      background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                      color: '#34d399', fontSize: 9.5, fontWeight: 600,
                    }}>
                      Verified Proof
                    </div>
                  </div>
                </div>

                {url && (
                  <a
                    href={url} target="_blank" rel="noreferrer"
                    style={{
                      padding: '5px 10px', borderRadius: 6,
                      background: '#161f2e', border: '1px solid rgba(30,45,64,0.8)',
                      color: '#60a5fa', fontSize: 11, fontWeight: 500,
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    Open <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {ev.description && (
                <p style={{ color: '#8b98b0', fontSize: 12, lineHeight: 1.5, margin: '0 0 14px' }}>
                  {ev.description}
                </p>
              )}

              {/* Supported Nodes */}
              <div style={{ marginTop: 'auto', marginBottom: 14 }}>
                <div style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  Directly Validates & Supports:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {supportedNodes.length > 0 ? (
                    supportedNodes.map(item => (
                      <span
                        key={item.id}
                        style={{
                          padding: '3px 8px', borderRadius: 5,
                          background: 'rgba(30,45,64,0.6)', border: '1px solid rgba(59,130,246,0.3)',
                          color: '#93c5fd', fontSize: 11, fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#64748b', fontSize: 11 }}>FarmSeva Core Architecture</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onExploreInGraph(ev.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '8px 12px', borderRadius: 7,
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#60a5fa', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                Inspect in Graph
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

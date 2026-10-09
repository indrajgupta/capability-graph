// src/components/dashboard/NodeDetails.tsx
// Right-side details drawer that opens when a graph node is selected.
// Includes Focus mode (isolates 1-hop subgraph) and full relationship navigation.

import React from 'react';
import { X, ExternalLink, Edit2, Globe, Star, Eye, EyeOff, Layers } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import type { GraphNodeData } from '../../types/graph';
import { NODE_STYLES } from '../graph/nodeStyles';
import { mockEdges, mockNodes } from '../../data/mockGraph';

interface NodeDetailsProps {
  node: GraphNodeData;
  onClose: () => void;
  onNavigateToNode?: (nodeId: string) => void;
  isFocused?: boolean;
  onToggleFocus?: () => void;
}

const EVIDENCE_LABELS: Record<string, string> = {
  claimed:      'Claimed',
  used:         'Used',
  demonstrated: 'Demonstrated',
  verified:     'Verified',
};

const EVIDENCE_COLORS: Record<string, string> = {
  claimed:      '#4d5c75',
  used:         '#facc15',
  demonstrated: '#34d399',
  verified:     '#60a5fa',
};

// Find all nodes directly connected to given id
function getConnectedNodes(nodeId: string) {
  const connected: Array<{ node: GraphNodeData; relationship: string; direction: 'out' | 'in' }> = [];
  mockEdges.forEach(edge => {
    if (edge.source === nodeId) {
      const target = mockNodes.find(n => n.id === edge.target);
      if (target) connected.push({ node: target, relationship: edge.type, direction: 'out' });
    } else if (edge.target === nodeId) {
      const source = mockNodes.find(n => n.id === edge.source);
      if (source) connected.push({ node: source, relationship: edge.type, direction: 'in' });
    }
  });
  return connected;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{
      color: '#4d5c75', fontSize: 9.5, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      {title}
    </div>
    {children}
  </div>
);

const TagPill: React.FC<{
  label: string;
  color: string;
  bg: string;
  onClick?: () => void;
}> = ({ label, color, bg, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 5,
      background: bg, border: `1px solid ${color}33`,
      color, fontSize: 11, fontWeight: 500,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.12s',
    }}
    onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = color + '33'; }}
    onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = bg; }}
  >
    {label}
  </button>
);

export const NodeDetails: React.FC<NodeDetailsProps> = ({
  node, onClose, onNavigateToNode, isFocused = false, onToggleFocus
}) => {
  const style = NODE_STYLES[node.type];
  const connected = getConnectedNodes(node.id);
  const evStatus = node.evidenceStatus ?? 'claimed';

  const technologies = connected.filter(c => c.node.type === 'technology');
  const capabilities = connected.filter(c => c.node.type === 'capability');
  const evidence = connected.filter(c => c.node.type === 'evidence');
  const projects = connected.filter(c => c.node.type === 'project');
  const skills = connected.filter(c => c.node.type === 'skill');

  const githubUrl = (node.metadata as any)?.github;
  const demoUrl = (node.metadata as any)?.demo;
  const credentialUrl = (node.metadata as any)?.url;

  return (
    <div
      style={{
        width: 310, height: '100%',
        background: '#0d1117',
        borderLeft: '1px solid rgba(30,45,64,0.8)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid rgba(30,45,64,0.8)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <h3 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              {node.name}
            </h3>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5,
              padding: '2px 7px', borderRadius: 5,
              background: style.bg, border: `1px solid ${style.border}`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: style.color }} />
              <span style={{ color: style.color, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {style.label}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {onToggleFocus && (
              <button
                onClick={onToggleFocus}
                title={isFocused ? 'Exit focus mode' : 'Focus node neighborhood'}
                style={{
                  background: isFocused ? 'rgba(96,165,250,0.2)' : 'none',
                  border: `1px solid ${isFocused ? 'rgba(96,165,250,0.5)' : 'transparent'}`,
                  cursor: 'pointer',
                  color: isFocused ? '#60a5fa' : '#8b98b0',
                  padding: 5, borderRadius: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.12s',
                }}
              >
                {isFocused ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4d5c75', padding: 5,
                borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8edf5'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4d5c75'}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Evidence status pill & Focus badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 7px', borderRadius: 4,
            background: `${EVIDENCE_COLORS[evStatus]}15`,
            border: `1px solid ${EVIDENCE_COLORS[evStatus]}33`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: EVIDENCE_COLORS[evStatus] }} />
            <span style={{ color: EVIDENCE_COLORS[evStatus], fontSize: 9.5, fontWeight: 600 }}>
              {EVIDENCE_LABELS[evStatus]}
            </span>
          </div>

          {isFocused && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 7px', borderRadius: 4,
              background: 'rgba(96,165,250,0.15)',
              border: '1px solid rgba(96,165,250,0.4)',
              color: '#60a5fa', fontSize: 9.5, fontWeight: 600,
            }}>
              Focus Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {/* Description */}
        {node.description && (
          <Section title="Description">
            <p style={{ color: '#8b98b0', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              {node.description}
            </p>
          </Section>
        )}

        {/* Metadata info */}
        {node.metadata && Object.keys(node.metadata).length > 0 && (
          <Section title="Attributes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(node.metadata)
                .filter(([k]) => !['github', 'demo', 'url'].includes(k))
                .map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0' }}>
                    <span style={{ color: '#4d5c75', textTransform: 'capitalize' }}>{key}:</span>
                    <span style={{ color: '#e8edf5', fontWeight: 500 }}>{String(value)}</span>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <Section title="Technologies">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {technologies.map(c => {
                const s = NODE_STYLES[c.node.type];
                return (
                  <TagPill
                    key={c.node.id}
                    label={c.node.name}
                    color={s.color}
                    bg={s.bg}
                    onClick={() => onNavigateToNode?.(c.node.id)}
                  />
                );
              })}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {projects.map(c => {
                const s = NODE_STYLES[c.node.type];
                return (
                  <TagPill
                    key={c.node.id}
                    label={c.node.name}
                    color={s.color}
                    bg={s.bg}
                    onClick={() => onNavigateToNode?.(c.node.id)}
                  />
                );
              })}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {skills.map(c => {
                const s = NODE_STYLES[c.node.type];
                return (
                  <TagPill
                    key={c.node.id}
                    label={c.node.name}
                    color={s.color}
                    bg={s.bg}
                    onClick={() => onNavigateToNode?.(c.node.id)}
                  />
                );
              })}
            </div>
          </Section>
        )}

        {/* Capabilities */}
        {capabilities.length > 0 && (
          <Section title="Capabilities">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {capabilities.map(c => {
                const s = NODE_STYLES[c.node.type];
                return (
                  <TagPill
                    key={c.node.id}
                    label={c.node.name}
                    color={s.color}
                    bg={s.bg}
                    onClick={() => onNavigateToNode?.(c.node.id)}
                  />
                );
              })}
            </div>
          </Section>
        )}

        {/* Evidence */}
        {evidence.length > 0 && (
          <Section title="Evidence">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {evidence.map(c => {
                const url = (c.node.metadata as any)?.url;
                return (
                  <div key={c.node.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 10px', borderRadius: 7,
                    background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <GithubIcon size={12} color="#94a3b8" />
                      <span style={{ color: '#8b98b0', fontSize: 11, fontWeight: 500 }}>{c.node.name}</span>
                    </div>
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', display: 'flex' }}>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Connected nodes count */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 10px', borderRadius: 7,
          background: '#131920', border: '1px solid rgba(30,45,64,0.6)',
          marginBottom: 14,
        }}>
          <Star size={11} color="#8b98b0" />
          <span style={{ color: '#8b98b0', fontSize: 11.5 }}>
            <strong style={{ color: '#e8edf5' }}>{connected.length}</strong> connected relationships
          </span>
        </div>

        {/* Action Links */}
        {(githubUrl || demoUrl || credentialUrl) && (
          <div style={{ display: 'flex', gap: 8 }}>
            {githubUrl && (
              <a
                href={githubUrl} target="_blank" rel="noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                  color: '#8b98b0', fontSize: 11, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.12s',
                }}
              >
                <GithubIcon size={12} />
                GitHub
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl} target="_blank" rel="noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                  color: '#8b98b0', fontSize: 11, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.12s',
                }}
              >
                <Globe size={12} />
                Live Demo
              </a>
            )}
            {credentialUrl && !githubUrl && !demoUrl && (
              <a
                href={credentialUrl} target="_blank" rel="noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                  color: '#60a5fa', fontSize: 11, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.12s',
                }}
              >
                <ExternalLink size={12} />
                Verify Credential
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(30,45,64,0.8)',
        flexShrink: 0,
        display: 'flex', gap: 8,
      }}>
        {onToggleFocus && (
          <button
            onClick={onToggleFocus}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 7, justifyContent: 'center',
              background: isFocused ? 'rgba(96,165,250,0.15)' : '#131920',
              border: `1px solid ${isFocused ? 'rgba(96,165,250,0.5)' : 'rgba(30,45,64,0.8)'}`,
              color: isFocused ? '#60a5fa' : '#8b98b0',
              fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            <Layers size={12} />
            {isFocused ? 'Reset View' : 'Focus Node'}
          </button>
        )}
        <button
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 7, justifyContent: 'center',
            background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
            color: '#8b98b0', fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#e8edf5';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#8b98b0';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
          }}
        >
          <Edit2 size={12} />
          Edit Node
        </button>
      </div>
    </div>
  );
};

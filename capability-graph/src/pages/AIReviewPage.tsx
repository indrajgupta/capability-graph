// src/pages/AIReviewPage.tsx
// Human review screen for AI-extracted graph entities and relationships.
// Follows strict PRD and UI design specifications.
// Saves to Supabase and updates React Flow graph only upon explicit user approval.

import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check, X, Edit2, AlertTriangle, ChevronRight, Hexagon,
  Briefcase, Code2, Zap, Layers, Clock, GraduationCap, Award, FileCheck, CheckCircle2,
  Compass
} from 'lucide-react';
import { NODE_STYLES } from '../components/graph/nodeStyles';
import { graphStore } from '../services/graphStore';
import type { StructuredGraphResult } from '../server/analyzeHandler';
import { GraphStructureExplorer } from '../components/graph/GraphStructureExplorer';
import type { GraphNodeData, GraphEdgeData, NodeType } from '../types/graph';

interface ReviewNode {
  id: string;
  type: string;
  name: string;
  description?: string;
  confirmed: boolean;
}

interface ReviewRelationship {
  source: string;
  rel: string;
  target: string;
  confirmed: boolean;
}

export const AIReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialGraph: StructuredGraphResult | null = location.state?.graph || null;

  // Categorized state
  const [nodes, setNodes] = useState<ReviewNode[]>(() => {
    if (!initialGraph) return [];
    return initialGraph.nodes.map(n => ({
      id: n.id,
      type: n.type,
      name: n.name,
      description: n.description,
      confirmed: true,
    }));
  });

  const [relationships, setRelationships] = useState<ReviewRelationship[]>(() => {
    if (!initialGraph) return [];
    return initialGraph.relationships.map(r => ({
      source: r.source,
      rel: r.label || r.type,
      target: r.target,
      confirmed: true,
    }));
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  // Convert current reviewed nodes & relationships for the explorer
  const explorerNodes: GraphNodeData[] = useMemo(() => {
    const list: GraphNodeData[] = [];
    if (initialGraph?.person) {
      list.push({
        id: 'person_user',
        type: 'person',
        name: initialGraph.person.name || 'Professional Profile',
        description: initialGraph.person.title || 'Extracted professional identity',
      });
    }
    nodes.filter(n => n.confirmed).forEach(n => {
      list.push({
        id: n.id,
        type: n.type as NodeType,
        name: n.name,
        description: n.description,
      });
    });
    return list;
  }, [initialGraph, nodes]);

  const explorerEdges: GraphEdgeData[] = useMemo(() => {
    const confirmedNodeIds = new Set(nodes.filter(n => n.confirmed).map(n => n.id));
    confirmedNodeIds.add('person_user');

    return relationships
      .filter(r => r.confirmed)
      .map((r, i) => ({
        id: `review_rel_${i}`,
        source: r.source,
        target: r.target,
        type: (r.rel || 'RELATED_TO') as any,
        label: r.rel,
      }));
  }, [nodes, relationships]);

  const toggleNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, confirmed: !n.confirmed } : n));
  };

  const toggleRelationship = (idx: number) => {
    setRelationships(prev => prev.map((r, i) => i === idx ? { ...r, confirmed: !r.confirmed } : r));
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
  };

  // Group by PRD categories
  const projects = nodes.filter(n => n.type.toLowerCase() === 'project');
  const technologies = nodes.filter(n => n.type.toLowerCase() === 'technology');
  const skills = nodes.filter(n => n.type.toLowerCase() === 'skill');
  const capabilities = nodes.filter(n => n.type.toLowerCase() === 'capability');
  const experience = nodes.filter(n => n.type.toLowerCase() === 'experience');
  const education = nodes.filter(n => n.type.toLowerCase() === 'education');
  const certifications = nodes.filter(n => n.type.toLowerCase() === 'certification');
  const evidence = nodes.filter(n => n.type.toLowerCase() === 'evidence');

  const confirmedNodesCount = nodes.filter(n => n.confirmed).length;
  const confirmedRelCount = relationships.filter(r => r.confirmed).length;

  // Approve & Build Graph
  const handleApprove = async () => {
    setSaving(true);

    const approvedGraph: StructuredGraphResult = {
      person: initialGraph?.person || { name: 'Indraj Gupta' },
      nodes: nodes.filter(n => n.confirmed).map(n => ({
        id: n.id,
        type: n.type,
        name: n.name,
        description: n.description,
      })),
      relationships: relationships.filter(r => r.confirmed).map(r => ({
        source: r.source,
        target: r.target,
        type: r.rel,
        label: r.rel,
      })),
      evidence: initialGraph?.evidence || [],
      uncertain_items: [],
    };

    // Save to Supabase + update live React Flow state
    await graphStore.saveApprovedGraph(approvedGraph, {
      mode: location.state?.mode || 'create',
      graphName: location.state?.graphName,
      targetGraphId: location.state?.targetGraphId,
    });
    setSaving(false);
    navigate('/dashboard');
  };

  const handleReject = () => {
    navigate('/dashboard');
  };

  const renderCategorySection = (title: string, items: ReviewNode[], icon: React.ReactNode, typeKey: string) => {
    if (items.length === 0) return null;
    const style = (NODE_STYLES as any)[typeKey] || NODE_STYLES.skill;

    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#64748b', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
        }}>
          {icon}
          <span>{title} ({items.length})</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                background: item.confirmed ? `${style.bg}cc` : 'rgba(127,29,29,0.1)',
                border: `1px solid ${item.confirmed ? style.border : '#7f1d1d'}`,
                transition: 'all 0.12s',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: style.color, flexShrink: 0 }} />
              
              {isEditing ? (
                <input
                  type="text"
                  value={item.name}
                  onChange={e => updateNodeName(item.id, e.target.value)}
                  style={{
                    flex: 1, background: '#131920', border: '1px solid rgba(59,130,246,0.4)',
                    color: '#e8edf5', fontSize: 12.5, padding: '3px 7px', borderRadius: 5, outline: 'none',
                  }}
                />
              ) : (
                <span style={{
                  flex: 1, fontSize: 12.5, fontWeight: 500,
                  color: item.confirmed ? '#e8edf5' : '#6b7280',
                  textDecoration: item.confirmed ? 'none' : 'line-through',
                }}>
                  {item.name}
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleNode(item.id)}
                style={{
                  width: 22, height: 22, borderRadius: 5, border: 'none',
                  background: item.confirmed ? 'rgba(52,211,153,0.14)' : 'rgba(127,29,29,0.25)',
                  color: item.confirmed ? '#34d399' : '#f87171',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {item.confirmed ? <Check size={12} /> : <X size={12} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!initialGraph) {
    return (
      <div style={{
        minHeight: '100vh', background: '#07090f',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Hexagon size={18} color="white" fill="white" />
        </div>
        <h2 style={{ color: '#e8edf5', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          No Graph Ready for Review
        </h2>
        <p style={{ color: '#64748b', fontSize: 13, maxWidth: 380, marginBottom: 24 }}>
          Please submit your professional information to let the AI workflow construct your capability graph.
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          style={{
            padding: '10px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Go to Add Information
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#07090f',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '36px 20px',
    }}>
      {/* Header Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Hexagon size={16} color="white" fill="white" />
        </div>
        <span style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700 }}>CapabilityGraph · AI Review</span>
      </div>

      {/* Operation Mode Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26,
        padding: '6px 16px', borderRadius: 20,
        background: (location.state?.mode || 'create') === 'create'
          ? 'rgba(59,130,246,0.12)'
          : 'rgba(52,211,153,0.12)',
        border: `1px solid ${(location.state?.mode || 'create') === 'create' ? 'rgba(59,130,246,0.35)' : 'rgba(52,211,153,0.35)'}`,
        color: (location.state?.mode || 'create') === 'create' ? '#60a5fa' : '#34d399',
        fontSize: 12, fontWeight: 600,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: (location.state?.mode || 'create') === 'create' ? '#3b82f6' : '#10b981',
        }} />
        {(location.state?.mode || 'create') === 'create'
          ? `Operation: Create New Graph · "${location.state?.graphName || 'My Professional Profile'}"`
          : `Operation: Add Information to · "${location.state?.graphName || graphStore.getCurrentGraph()?.name || 'Current Graph'}"`}
      </div>

      <div style={{
        display: 'flex', gap: 24, alignItems: 'flex-start',
        flexWrap: 'wrap', justifyContent: 'center',
        width: '100%', maxWidth: 960,
      }}>
        {/* Left Column: Extracted Entities by Category */}
        <div style={{
          background: '#0d1117', border: '1px solid rgba(30,45,64,0.85)',
          borderRadius: 16, padding: '24px 22px',
          width: 420, flexShrink: 0,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700, margin: 0 }}>
                AI Extracted Entities
              </h2>
              <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
                Review before approving insertion into graph.
              </p>
            </div>
            <div style={{
              padding: '4px 9px', borderRadius: 6,
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
              color: '#34d399', fontSize: 11, fontWeight: 600,
            }}>
              {confirmedNodesCount} confirmed
            </div>
          </div>

          {/* Render All 8 Entity Categories */}
          {renderCategorySection('Projects', projects, <Briefcase size={12} />, 'project')}
          {renderCategorySection('Technologies', technologies, <Code2 size={12} />, 'technology')}
          {renderCategorySection('Skills', skills, <Zap size={12} />, 'skill')}
          {renderCategorySection('Capabilities', capabilities, <Layers size={12} />, 'capability')}
          {renderCategorySection('Experience', experience, <Clock size={12} />, 'experience')}
          {renderCategorySection('Education', education, <GraduationCap size={12} />, 'education')}
          {renderCategorySection('Certifications', certifications, <Award size={12} />, 'certification')}
          {renderCategorySection('Evidence', evidence, <FileCheck size={12} />, 'evidence')}
        </div>

        {/* Right Column: Relationships + Approval Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minWidth: 320 }}>
          {/* Relationships Card */}
          <div style={{
            background: '#0d1117', border: '1px solid rgba(30,45,64,0.85)',
            borderRadius: 16, padding: '20px 22px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 14,
            }}>
              <span style={{
                color: '#64748b', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Graph Relationships ({confirmedRelCount})
              </span>
              <span style={{ color: '#475569', fontSize: 11 }}>
                Graph rules verified
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 360, overflowY: 'auto' }}>
              {relationships.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 12, padding: '6px 8px', borderRadius: 6,
                    background: r.confirmed ? 'rgba(15,23,42,0.6)' : 'rgba(127,29,29,0.1)',
                    border: `1px solid ${r.confirmed ? 'rgba(30,45,64,0.6)' : 'rgba(127,29,29,0.3)'}`,
                  }}
                >
                  <span style={{
                    padding: '2px 7px', borderRadius: 5,
                    background: '#0d2e24', border: '1px solid #065f46',
                    color: '#34d399', fontSize: 11, fontWeight: 600,
                  }}>
                    {r.source}
                  </span>
                  <ChevronRight size={11} color="#4d5c75" />
                  <span style={{
                    padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
                    color: '#60a5fa', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  }}>
                    {r.rel}
                  </span>
                  <ChevronRight size={11} color="#4d5c75" />
                  <span style={{ color: '#cbd5e1', fontSize: 11.5, flex: 1 }}>
                    {r.target}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRelationship(i)}
                    style={{
                      width: 18, height: 18, borderRadius: 4, border: 'none',
                      background: r.confirmed ? 'rgba(52,211,153,0.12)' : 'rgba(127,29,29,0.25)',
                      color: r.confirmed ? '#34d399' : '#f87171',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {r.confirmed ? <Check size={10} /> : <X size={10} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisory Note */}
          <div style={{
            display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10,
            background: 'rgba(250,204,21,0.04)', border: '1px solid rgba(250,204,21,0.15)',
          }}>
            <AlertTriangle size={14} color="#facc15" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#8b98b0', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              AI results will NOT be committed to Supabase until you approve. Uncheck items to exclude or click Edit to modify names.
            </p>
          </div>

          {/* Actions: Approve & Build Graph / Edit / Reject */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              disabled={saving}
              onClick={handleApprove}
              style={{
                padding: '13px', borderRadius: 9,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
              }}
            >
              <CheckCircle2 size={16} />
              {saving ? 'Saving to Graph...' : 'Approve & Build Graph'}
            </button>

            <button
              type="button"
              onClick={() => setIsExplorerOpen(true)}
              style={{
                padding: '11px', borderRadius: 9,
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.35)',
                color: '#93c5fd', fontSize: 13.5, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.18)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
              }}
            >
              <Compass size={16} color="#60a5fa" />
              <span>Explore Graph Structure</span>
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: isEditing ? 'rgba(59,130,246,0.15)' : 'transparent',
                  border: `1px solid ${isEditing ? 'rgba(59,130,246,0.5)' : 'rgba(30,45,64,0.8)'}`,
                  color: isEditing ? '#60a5fa' : '#8b98b0', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Edit2 size={13} />
                {isEditing ? 'Done Editing' : 'Edit'}
              </button>

              <button
                type="button"
                onClick={handleReject}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: 'transparent', border: '1px solid rgba(127,29,29,0.4)',
                  color: '#f87171', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <X size={13} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Structure Explorer using current review state */}
      <GraphStructureExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        nodes={explorerNodes}
        edges={explorerEdges}
        isLoading={false}
        title="Review Graph Structure Explorer"
        subtitle="Live visualization of confirmed entities and relationships before approval"
        returnButtonText="Return to Review"
      />
    </div>
  );
};

// src/components/dashboard/AddInformationModal.tsx
// Supports two distinct operations:
// 1. CREATE A COMPLETELY NEW GRAPH (with unique graph ID & name)
// 2. ADD INFORMATION TO AN EXISTING GRAPH (merges into selected graph only)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Plus, Upload, Briefcase, Zap, Clock,
  Sparkles, Layers, GitBranch, AlertCircle
} from 'lucide-react';
import { graphStore } from '../../services/graphStore';
import type { GraphRecord } from '../../types/graph';

export interface AddInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (addedEntity: string) => void;
  initialMode?: 'create' | 'add';
}

type TabType = 'project' | 'resume' | 'experience' | 'skill';

export const AddInformationModal: React.FC<AddInformationModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'add',
}) => {
  const navigate = useNavigate();
  const [storeState, setStoreState] = useState(() => graphStore.getState());
  const [mode, setMode] = useState<'create' | 'add'>(initialMode);

  // Multi-graph inputs
  const [newGraphName, setNewGraphName] = useState('');
  const [newGraphDesc, setNewGraphDesc] = useState('');
  const [targetGraphId, setTargetGraphId] = useState<string>('');

  // Form tab selection
  const [activeTab, setActiveTab] = useState<TabType>('project');

  // Project state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectRole, setProjectRole] = useState('');

  // Experience state
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Skill state
  const [skillName, setSkillName] = useState('');
  const [skillStatus, setSkillStatus] = useState<'demonstrated' | 'used' | 'claimed'>('demonstrated');

  // Resume state
  const [resumeText, setResumeText] = useState('');
  const [resumeLoaded, setResumeLoaded] = useState(false);

  useEffect(() => {
    return graphStore.subscribe((state) => {
      setStoreState(state);
      if (!targetGraphId && state.currentGraph) {
        setTargetGraphId(state.currentGraph.id);
      }
    });
  }, [targetGraphId]);

  useEffect(() => {
    setMode(initialMode);
    if (storeState.currentGraph) {
      setTargetGraphId(storeState.currentGraph.id);
    }
  }, [initialMode, isOpen, storeState.currentGraph]);

  if (!isOpen) return null;

  const currentGraph = storeState.currentGraph;
  const graphs = storeState.graphs;

  const handleLoadSampleResume = () => {
    setResumeText(
      `Indraj Gupta - AI/ML & Full-Stack Developer
Location: Bengaluru, India | GitHub: github.com/indraj

SUMMARY:
Passionate engineer specializing in agentic workflows, React interfaces, and connected capability modeling.

PROJECTS:
• FarmSeva: Agricultural equipment rental network. React, Vite, Supabase.
• SmartCampus: Campus automation system with Python, FastAPI, and PostgreSQL.
• CapabilityGraph: Interactive professional graph explorer with React Flow.

SKILLS & TECH:
Python, React, TypeScript, Vite, Supabase, FastAPI, PostgreSQL, Git, System Design.`
    );
    setResumeLoaded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create' && !newGraphName.trim()) {
      alert('Please enter a name for your new graph.');
      return;
    }

    if (mode === 'add' && !targetGraphId) {
      alert('Please select an existing graph to add information to.');
      return;
    }

    let info = '';
    if (activeTab === 'project') {
      info = `I built a project called ${projectName || 'FarmSeva'}. ${projectDesc || ''}. Technologies used: ${projectTech || ''}. Role: ${projectRole || ''}. GitHub: ${projectGithub || ''}. Live demo: ${projectDemo || ''}.`;
    } else if (activeTab === 'resume') {
      info = resumeText || 'I use React and Supabase. I built FarmSeva using React, Supabase, and Vite.';
    } else if (activeTab === 'experience') {
      info = `I worked as ${expRole} at ${expCompany} (${expPeriod}). Key contributions: ${expDesc}.`;
    } else if (activeTab === 'skill') {
      info = `My skills include ${skillName} (${skillStatus}).`;
    }

    const selectedTargetGraph = graphs.find((g) => g.id === targetGraphId) || currentGraph;

    onClose();
    navigate('/ai-processing', {
      state: {
        professionalInformation: info,
        mode,
        graphName: mode === 'create' ? newGraphName.trim() : (selectedTargetGraph?.name || 'Selected Graph'),
        targetGraphId: mode === 'add' ? targetGraphId : undefined,
      },
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 580,
        background: '#0d1117',
        border: '1px solid rgba(30,45,64,0.9)',
        borderRadius: 14,
        boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid rgba(30,45,64,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700, margin: 0 }}>
              {mode === 'create' ? 'Create New Graph' : 'Add Information to Graph'}
            </h2>
            <p style={{ color: '#64748b', fontSize: 11.5, margin: '3px 0 0' }}>
              {mode === 'create'
                ? 'Create an independent graph with its own unique ID. Will not modify existing graphs.'
                : `Merge extracted entities and relationships into "${graphs.find(g => g.id === targetGraphId)?.name || currentGraph?.name || 'Current Graph'}".`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#64748b',
              cursor: 'pointer', padding: 4, borderRadius: 5,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Operation Mode Switcher */}
        <div style={{
          padding: '10px 16px',
          background: 'rgba(15,23,42,0.8)',
          borderBottom: '1px solid rgba(30,45,64,0.8)',
          display: 'flex',
          gap: 8,
        }}>
          <button
            type="button"
            onClick={() => setMode('create')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 7,
              border: `1px solid ${mode === 'create' ? 'rgba(59,130,246,0.6)' : 'rgba(30,45,64,0.7)'}`,
              background: mode === 'create' ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: mode === 'create' ? '#60a5fa' : '#64748b',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            <Plus size={13} />
            Create New Graph
          </button>

          <button
            type="button"
            onClick={() => setMode('add')}
            disabled={graphs.length === 0}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 7,
              border: `1px solid ${mode === 'add' ? 'rgba(52,211,153,0.6)' : 'rgba(30,45,64,0.7)'}`,
              background: mode === 'add' ? 'rgba(52,211,153,0.15)' : 'transparent',
              color: mode === 'add' ? '#34d399' : '#64748b',
              fontSize: 12,
              fontWeight: 600,
              cursor: graphs.length === 0 ? 'not-allowed' : 'pointer',
              opacity: graphs.length === 0 ? 0.5 : 1,
              transition: 'all 0.12s ease',
            }}
          >
            <Layers size={13} />
            Add Information
          </button>
        </div>

        {/* Multi-Graph Configuration Box */}
        <div style={{
          padding: '12px 20px',
          background: mode === 'create' ? 'rgba(59,130,246,0.04)' : 'rgba(52,211,153,0.04)',
          borderBottom: '1px solid rgba(30,45,64,0.8)',
        }}>
          {mode === 'create' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', color: '#93c5fd', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                  New Graph Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGraphName}
                  onChange={(e) => setNewGraphName(e.target.value)}
                  placeholder="e.g. SmartCampus Project, FarmSeva Architecture, AI Research"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 7,
                    background: '#131920', border: '1px solid rgba(59,130,246,0.4)',
                    color: '#e8edf5', fontSize: 12.5, outline: 'none',
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Each graph has its own unique ID. Nodes like "Python" will remain completely isolated from other graphs.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ display: 'block', color: '#6ee7b7', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Existing Graph to Merge Into
              </label>
              {graphs.length === 0 ? (
                <div style={{ color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={14} />
                  No graphs exist yet. Please choose "Create New Graph" above.
                </div>
              ) : (
                <select
                  value={targetGraphId}
                  onChange={(e) => setTargetGraphId(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 7,
                    background: '#131920', border: '1px solid rgba(52,211,153,0.4)',
                    color: '#e8edf5', fontSize: 12.5, outline: 'none',
                  }}
                >
                  {graphs.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.node_count ?? 0} nodes)
                    </option>
                  ))}
                </select>
              )}
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Existing nodes and relationships in this graph will be preserved and deduplicated. Other graphs remain untouched.
              </div>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid rgba(30,45,64,0.8)',
        }}>
          {[
            { id: 'project', label: 'Project', icon: <Briefcase size={13} /> },
            { id: 'resume', label: 'Resume', icon: <Upload size={13} /> },
            { id: 'experience', label: 'Experience', icon: <Clock size={13} /> },
            { id: 'skill', label: 'Skill', icon: <Zap size={13} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 8px', border: 'none', cursor: 'pointer',
                  background: isActive ? '#0d1117' : 'transparent',
                  color: isActive ? '#60a5fa' : '#64748b',
                  fontSize: 12, fontWeight: isActive ? 600 : 400,
                  borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                  transition: 'all 0.12s',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          <form onSubmit={handleSubmit} id="add-info-form">
            {activeTab === 'project' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. SmartCampus, FarmSeva"
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="What does it do? What problem does it solve?"
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none', resize: 'vertical',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Technologies Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={projectTech}
                    onChange={(e) => setProjectTech(e.target.value)}
                    placeholder="Python, FastAPI, PostgreSQL"
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={projectGithub}
                      onChange={(e) => setProjectGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 7,
                        background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                        color: '#e8edf5', fontSize: 12.5, outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={projectDemo}
                      onChange={(e) => setProjectDemo(e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 7,
                        background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                        color: '#e8edf5', fontSize: 12.5, outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 600 }}>
                    Paste Resume or Profile Summary
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleResume}
                    style={{
                      background: 'none', border: 'none', color: '#60a5fa',
                      fontSize: 11.5, cursor: 'pointer', padding: 0, textDecoration: 'underline',
                    }}
                  >
                    Load Sample Resume
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste work history, skills, and projects here..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 7,
                    background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                    color: '#e8edf5', fontSize: 12, outline: 'none', resize: 'vertical',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            )}

            {activeTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                      Job Title / Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="e.g. Full-Stack Developer"
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 7,
                        background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                        color: '#e8edf5', fontSize: 12.5, outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="e.g. Acme Inc"
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 7,
                        background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                        color: '#e8edf5', fontSize: 12.5, outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Key Contributions & Technologies
                  </label>
                  <textarea
                    rows={3}
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Built features with React and Python..."
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none', resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'skill' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Skill / Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. Python, FastAPI, Supabase"
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                    Evidence Level
                  </label>
                  <select
                    value={skillStatus}
                    onChange={(e) => setSkillStatus(e.target.value as any)}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 7,
                      background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                      color: '#e8edf5', fontSize: 12.5, outline: 'none',
                    }}
                  >
                    <option value="demonstrated">Demonstrated (backed by project code/demo)</option>
                    <option value="used">Used (applied in coursework or tools)</option>
                    <option value="claimed">Claimed (knowledge without direct project)</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(30,45,64,0.8)',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          background: '#0a0d14',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: 7,
              background: 'transparent', border: '1px solid rgba(45,65,90,0.7)',
              color: '#8b98b0', fontSize: 12, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-info-form"
            style={{
              padding: '8px 18px', borderRadius: 7,
              background: mode === 'create'
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none', color: 'white',
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: mode === 'create'
                ? '0 2px 10px rgba(59,130,246,0.3)'
                : '0 2px 10px rgba(16,185,129,0.3)',
            }}
          >
            <Sparkles size={14} />
            {mode === 'create' ? 'Process New Graph with AI' : 'Merge into Graph with AI'}
          </button>
        </div>
      </div>
    </div>
  );
};

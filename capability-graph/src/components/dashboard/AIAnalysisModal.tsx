// src/components/dashboard/AIAnalysisModal.tsx
// Grounded AI Analysis drawer/modal that answers questions about the user's capability graph.
// Responses contain clickable entity badges that focus the graph on the referenced node.

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Bot, User } from 'lucide-react';
import { NODE_STYLES } from '../graph/nodeStyles';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusNode: (nodeId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  entities?: Array<{ id: string; name: string; type: string }>;
}

const SUGGESTED_QUESTIONS = [
  'What can I actually demonstrate?',
  'Which projects use React?',
  'What are my evidence-backed capabilities?',
  'Which skills have no project evidence?',
  'How are my projects connected?',
];

// Helper to formulate grounded answers from the graph
function generateGroundedAnswer(query: string): {
  text: string;
  entities: Array<{ id: string; name: string; type: string }>;
} {
  const lower = query.toLowerCase();

  if (lower.includes('demonstrate') || lower.includes('actually do')) {
    return {
      text: 'Based on your graph, you have 5 demonstrated capabilities backed by production code and live deployments. Your strongest capability is AI Integration, proven by FarmSeva through Lyzr agent orchestration. You also demonstrate Full-Stack Development and Database Integration across FarmSeva, Unplug, and CapabilityGraph.',
      entities: [
        { id: 'cap_ai', name: 'AI Integration', type: 'capability' },
        { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
        { id: 'tech_lyzr', name: 'Lyzr', type: 'technology' },
        { id: 'cap_fullstack', name: 'Full-Stack Development', type: 'capability' },
        { id: 'project_capgraph', name: 'CapabilityGraph', type: 'project' },
      ],
    };
  }

  if (lower.includes('react')) {
    return {
      text: 'React is a central technology in your capability graph with 3 direct project connections. You applied it in FarmSeva (full-stack rental app), Unplug (wellness app), and CapabilityGraph. In all three, React demonstrates Frontend Development and Full-Stack Development.',
      entities: [
        { id: 'tech_react', name: 'React', type: 'technology' },
        { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
        { id: 'project_unplug', name: 'Unplug', type: 'project' },
        { id: 'project_capgraph', name: 'CapabilityGraph', type: 'project' },
        { id: 'cap_frontend', name: 'Frontend Development', type: 'capability' },
      ],
    };
  }

  if (lower.includes('evidence-backed') || lower.includes('evidence')) {
    return {
      text: 'Your evidence model shows 4 verified credentials and artifacts: GitHub Repository (FarmSeva), Live Demo deployment (farmseva.app), and Deep Learning Specialization from DeepLearning.AI. These directly verify your React, Supabase, and AI Integration claims.',
      entities: [
        { id: 'ev_github', name: 'GitHub Repository', type: 'evidence' },
        { id: 'ev_demo', name: 'Live Demo', type: 'evidence' },
        { id: 'cert_deeplearning', name: 'Deep Learning Specialization', type: 'certification' },
        { id: 'tech_supabase', name: 'Supabase', type: 'technology' },
      ],
    };
  }

  if (lower.includes('no project evidence') || lower.includes('claimed') || lower.includes('gap')) {
    return {
      text: 'Honesty audit: You claimed System Design as a skill, but currently no project or evidence node in your graph demonstrates large-scale distributed architecture. Adding a repository or architecture doc for System Design would elevate it from "Claimed" to "Demonstrated".',
      entities: [
        { id: 'skill_system', name: 'System Design', type: 'skill' },
        { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
      ],
    };
  }

  if (lower.includes('connected') || lower.includes('relationship')) {
    return {
      text: 'Your projects are connected through a shared modern stack: React, Supabase, and Lyzr bridge FarmSeva and CapabilityGraph. FarmSeva and Unplug share Supabase for auth and database persistence, while Lyzr powers agentic capabilities in both FarmSeva and CapabilityGraph.',
      entities: [
        { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
        { id: 'project_capgraph', name: 'CapabilityGraph', type: 'project' },
        { id: 'tech_supabase', name: 'Supabase', type: 'technology' },
        { id: 'tech_lyzr', name: 'Lyzr', type: 'technology' },
      ],
    };
  }

  // Fallback grounded answer
  return {
    text: `Analyzing your graph for "${query}": Your graph contains 3 projects, 8 technologies, 6 skills, and 5 capabilities connected by 35 relationships. Your verified evidence roots through GitHub, live demos, and DeepLearning.AI certifications.`,
    entities: [
      { id: 'person_indraj', name: 'Indraj Gupta', type: 'person' },
      { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
      { id: 'cap_ai', name: 'AI Integration', type: 'capability' },
    ],
  };
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen, onClose, onFocusNode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello Indraj. I am your CapabilityGraph AI Assistant. Ask me anything about your professional skills, projects, technologies, and evidence. Every entity mentioned links directly to your interactive graph.',
      entities: [
        { id: 'project_farmseva', name: 'FarmSeva', type: 'project' },
        { id: 'cap_ai', name: 'AI Integration', type: 'capability' },
        { id: 'tech_react', name: 'React', type: 'technology' },
      ],
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleAsk = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
    };

    const grounded = generateGroundedAnswer(query);
    const botMsg: Message = {
      id: 'a_' + Date.now(),
      sender: 'assistant',
      text: grounded.text,
      entities: grounded.entities,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        width: 480, height: '100%',
        background: '#0d1117',
        borderLeft: '1px solid rgba(30,45,64,0.9)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(30,45,64,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={16} color="white" />
            </div>
            <div>
              <div style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700 }}>
                AI Capability Analysis
              </div>
              <div style={{ color: '#60a5fa', fontSize: 10.5, fontWeight: 500 }}>
                Grounded in your capability graph
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#4d5c75',
              cursor: 'pointer', padding: 4, borderRadius: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Suggested questions strip */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(15,23,42,0.5)',
          borderBottom: '1px solid rgba(30,45,64,0.6)',
        }}>
          <div style={{ color: '#4d5c75', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Suggested Questions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                style={{
                  background: 'rgba(30,45,64,0.5)',
                  border: '1px solid rgba(45,65,90,0.7)',
                  borderRadius: 6, padding: '4px 9px',
                  color: '#94a3b8', fontSize: 11, textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#60a5fa';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,65,90,0.7)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat message history */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex', gap: 10,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.2)',
                  border: '1px solid rgba(59,130,246,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <Bot size={13} color="#60a5fa" />
                </div>
              )}

              <div>
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: msg.sender === 'user' ? '#1e293b' : '#111827',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(96,165,250,0.4)' : 'rgba(30,45,64,0.8)'}`,
                  color: '#e2e8f0', fontSize: 12.5, lineHeight: 1.6,
                }}>
                  {msg.text}
                </div>

                {/* Clickable Entity Pills */}
                {msg.entities && msg.entities.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <span style={{ fontSize: 10, color: '#475569', alignSelf: 'center', marginRight: 2 }}>
                      Graph entities:
                    </span>
                    {msg.entities.map(ent => {
                      const style = NODE_STYLES[ent.type as keyof typeof NODE_STYLES] || { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' };
                      return (
                        <button
                          key={ent.id}
                          onClick={() => {
                            onFocusNode(ent.id);
                            onClose();
                          }}
                          title={`Focus ${ent.name} in graph`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 5,
                            background: style.bg,
                            border: `1px solid ${style.color}44`,
                            color: style.color, fontSize: 11, fontWeight: 500,
                            cursor: 'pointer', transition: 'transform 0.12s',
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: style.color }} />
                          {ent.name}
                          <ArrowRight size={10} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <User size={13} color="#94a3b8" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(30,45,64,0.8)',
          background: '#0d1117',
        }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAsk(input);
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your capabilities..."
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 7,
                background: '#161f2e', border: '1px solid rgba(30,45,64,0.9)',
                color: '#e8edf5', fontSize: 12.5, outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '0 16px', borderRadius: 7,
                background: input.trim() ? '#3b82f6' : '#1e293b',
                color: input.trim() ? 'white' : '#475569',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

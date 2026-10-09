// src/components/dashboard/GraphSelectorDropdown.tsx
// Graph selector and management experience:
// Switch graphs, view all graphs, rename graphs, delete graphs with confirmation,
// and trigger new graph creation.

import React, { useState, useEffect, useRef } from 'react';
import {
  GitBranch, ChevronDown, Plus, Check, Edit2,
  Trash2, X, AlertTriangle, Layers, Clock
} from 'lucide-react';
import { graphStore } from '../../services/graphStore';
import type { GraphRecord } from '../../types/graph';

interface GraphSelectorDropdownProps {
  onCreateNewGraph: () => void;
  onAddInformation: () => void;
}

export const GraphSelectorDropdown: React.FC<GraphSelectorDropdownProps> = ({
  onCreateNewGraph,
  onAddInformation,
}) => {
  const [storeState, setStoreState] = useState(() => graphStore.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [editingGraphId, setEditingGraphId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingGraph, setDeletingGraph] = useState<GraphRecord | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return graphStore.subscribe((state) => {
      setStoreState(state);
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!deletingGraph) {
          setIsOpen(false);
          setEditingGraphId(null);
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, deletingGraph]);

  const { currentGraph, graphs } = storeState;

  const handleSelect = async (graphId: string) => {
    if (graphId === currentGraph?.id) {
      setIsOpen(false);
      return;
    }
    await graphStore.selectGraph(graphId);
    setIsOpen(false);
  };

  const startRename = (g: GraphRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGraphId(g.id);
    setEditName(g.name);
  };

  const handleSaveRename = async (graphId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editName.trim()) {
      await graphStore.renameGraph(graphId, editName.trim());
    }
    setEditingGraphId(null);
  };

  const startDelete = (g: GraphRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingGraph(g);
  };

  const confirmDelete = async () => {
    if (!deletingGraph) return;
    await graphStore.deleteGraph(deletingGraph.id);
    setDeletingGraph(null);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 8,
          background: isOpen ? 'rgba(30,45,64,0.9)' : 'rgba(15,23,42,0.8)',
          border: `1px solid ${isOpen ? 'rgba(96,165,250,0.5)' : 'rgba(30,45,64,0.9)'}`,
          cursor: 'pointer',
          color: '#e8edf5',
          fontSize: 12.5,
          fontWeight: 600,
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(96,165,250,0.1)' : 'none',
        }}
        title="Switch or manage professional graphs"
      >
        <div style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(96,165,250,0.3)',
        }}>
          <GitBranch size={11} color="#60a5fa" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: 9.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
            Graph
          </span>
          <span style={{
            color: '#e8edf5',
            fontSize: 12,
            fontWeight: 600,
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2,
          }}>
            {currentGraph?.name || 'My Professional Profile'}
          </span>
        </div>

        <span style={{
          fontSize: 10,
          color: '#94a3b8',
          background: 'rgba(255,255,255,0.06)',
          padding: '1px 5px',
          borderRadius: 4,
          marginLeft: 2,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {graphs.length}
        </span>

        <ChevronDown size={13} color="#64748b" style={{
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s ease',
        }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: 320,
          background: '#0d1117',
          border: '1px solid rgba(30,45,64,0.95)',
          borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)',
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 14px 10px',
            borderBottom: '1px solid rgba(30,45,64,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15,23,42,0.6)',
          }}>
            <div>
              <div style={{ color: '#e8edf5', fontSize: 13, fontWeight: 700 }}>
                My Graphs
              </div>
              <div style={{ color: '#64748b', fontSize: 10.5, marginTop: 1 }}>
                Select, rename, or create independent graphs
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onCreateNewGraph();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 9px',
                borderRadius: 6,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                color: 'white',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
              New Graph
            </button>
          </div>

          {/* Graphs List */}
          <div style={{
            maxHeight: 260,
            overflowY: 'auto',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {graphs.length === 0 ? (
              <div style={{ padding: '16px 12px', textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                No graphs found.
              </div>
            ) : (
              graphs.map((g) => {
                const isActive = g.id === currentGraph?.id;
                const isEditing = editingGraphId === g.id;

                return (
                  <div
                    key={g.id}
                    onClick={() => !isEditing && handleSelect(g.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(59,130,246,0.35)' : 'transparent'}`,
                      cursor: isEditing ? 'default' : 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive && !isEditing) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive && !isEditing) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveRename(g.id, e)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          autoFocus
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{
                            flex: 1,
                            background: '#131920',
                            border: '1px solid #3b82f6',
                            borderRadius: 5,
                            padding: '3px 8px',
                            color: '#e8edf5',
                            fontSize: 12,
                            outline: 'none',
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: '#2563eb',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 6px',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                          title="Save"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingGraphId(null)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 4,
                            padding: '4px 6px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          title="Cancel"
                        >
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                          <span style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: isActive ? '#3b82f6' : '#475569',
                            boxShadow: isActive ? '0 0 6px rgba(59,130,246,0.6)' : 'none',
                            flexShrink: 0,
                          }} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              color: isActive ? '#93c5fd' : '#e8edf5',
                              fontSize: 12,
                              fontWeight: isActive ? 600 : 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {g.name}
                            </div>
                            <div style={{ color: '#64748b', fontSize: 10, marginTop: 1 }}>
                              {g.node_count ?? (isActive ? storeState.nodes.length : 0)} nodes · {g.edge_count ?? (isActive ? storeState.edges.length : 0)} edges
                            </div>
                          </div>
                        </div>

                        {/* Actions for this graph */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={(e) => startRename(g, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: 4,
                              borderRadius: 4,
                              display: 'flex',
                            }}
                            title="Rename Graph"
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                          >
                            <Edit2 size={12} />
                          </button>
                          {graphs.length > 1 && (
                            <button
                              onClick={(e) => startDelete(g, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                padding: 4,
                                borderRadius: 4,
                                display: 'flex',
                              }}
                              title="Delete Graph"
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '8px 10px',
            borderTop: '1px solid rgba(30,45,64,0.8)',
            background: 'rgba(15,23,42,0.4)',
            display: 'flex',
            gap: 6,
          }}>
            <button
              onClick={() => {
                setIsOpen(false);
                onCreateNewGraph();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60a5fa',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
              Create New Graph
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onAddInformation();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.3)',
                color: '#34d399',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Layers size={12} />
              Add Information
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGraph && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 400,
            background: '#0d1117',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 14,
            padding: 22,
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(239,68,68,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239,68,68,0.3)',
              }}>
                <AlertTriangle size={18} color="#ef4444" />
              </div>
              <h3 style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700, margin: 0 }}>
                Delete Graph?
              </h3>
            </div>

            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to delete <strong style={{ color: '#f87171' }}>"{deletingGraph.name}"</strong>?
              All of its associated nodes and relationships will be permanently removed. Other graphs will not be affected.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setDeletingGraph(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 7,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: '7px 16px',
                  borderRadius: 7,
                  background: '#dc2626',
                  border: 'none',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete Graph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

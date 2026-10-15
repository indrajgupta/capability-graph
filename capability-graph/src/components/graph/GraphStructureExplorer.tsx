// src/components/graph/GraphStructureExplorer.tsx
// Dedicated interactive Graph Structure Explorer.
// Displays actual extracted nodes and relationships available at the current workflow stage.
// Completely read-only, non-blocking, and uses React Flow with dark technical aesthetic.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow, Background, BackgroundVariant,
  useNodesState, useEdgesState, useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import type { NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  ArrowLeft, Maximize2, Info, X, Loader2, Network
} from 'lucide-react';

import { nodeTypes } from './GraphNode';
import { NODE_STYLES } from './nodeStyles';
import type { GraphNodeData, GraphEdgeData } from '../../types/graph';
import { isGraphNodeData, toGraphNodeData } from '../../types/graph';
import { buildReactFlowData } from '../../data/mockGraph';

export interface GraphStructureExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  returnButtonText?: string;
}

const ExplorerCanvas: React.FC<{
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  onNodeSelect: (node: GraphNodeData | null) => void;
  selectedNode: GraphNodeData | null;
  activeLayout: 'radial' | 'hierarchical' | 'force';
  onLayoutChange: (layout: 'radial' | 'hierarchical' | 'force') => void;
}> = ({ nodes: rawNodes, edges: rawEdges, onNodeSelect, selectedNode, activeLayout, onLayoutChange }) => {
  const { fitView } = useReactFlow();

  // Build React Flow data with all nodes visible
  const flowData = useMemo(() => {
    return buildReactFlowData(rawNodes, rawEdges, activeLayout);
  }, [rawNodes, rawEdges, activeLayout]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);

  // Sync when rawNodes, rawEdges or layout changes
  useEffect(() => {
    const fresh = buildReactFlowData(rawNodes, rawEdges, activeLayout);
    setNodes(fresh.nodes);
    setEdges(fresh.edges);

    const timer = setTimeout(() => {
      fitView({ padding: 0.18, duration: 400 });
    }, 50);
    return () => clearTimeout(timer);
  }, [rawNodes, rawEdges, activeLayout, fitView, setNodes, setEdges]);

  // Update styles on node selection
  useEffect(() => {
    const selId = selectedNode?.id;

    setNodes(nds => nds.map(n => {
      const isSel = n.id === selId;
      const isConn = selId
        ? rawEdges.some(e => (e.source === selId && e.target === n.id) || (e.target === selId && e.source === n.id))
        : false;

      return {
        ...n,
        data: {
          ...n.data,
          selected: isSel,
          connected: isConn,
          dimmed: selId ? (!isSel && !isConn) : false,
        },
      };
    }));

    setEdges(eds => eds.map(e => {
      const isRelevant = !selId
        ? true
        : e.source === selId || e.target === selId;

      return {
        ...e,
        style: {
          stroke: isRelevant
            ? (selId ? 'rgba(96,165,250,0.9)' : 'rgba(96,165,250,0.5)')
            : 'rgba(255,255,255,0.06)',
          strokeWidth: isRelevant ? (selId ? 2.5 : 1.5) : 1,
        },
        labelStyle: {
          fill: isRelevant ? (selId ? 'rgba(165,200,250,0.95)' : '#94a3b8') : 'rgba(255,255,255,0)',
          fontSize: 9.5,
          fontWeight: selId ? 600 : 500,
        },
        labelBgStyle: {
          fill: isRelevant ? 'rgba(13,17,23,0.9)' : 'transparent',
          padding: isRelevant ? '2px 5px' : '0',
        },
        animated: isRelevant && !!selId,
      };
    }));
  }, [selectedNode, rawEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    const data = isGraphNodeData(node.data) ? node.data : toGraphNodeData(node.data, node.id);
    if (!data) return;
    onNodeSelect(selectedNode?.id === data.id ? null : data);
  }, [selectedNode, onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        minZoom={0.2}
        maxZoom={2.2}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="rgba(255,255,255,0.05)" />
      </ReactFlow>

      {/* Floating Canvas Controls */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20,
        display: 'flex', gap: 8, alignItems: 'center',
        background: 'rgba(13,17,23,0.85)',
        border: '1px solid rgba(30,45,64,0.8)',
        borderRadius: 10, padding: '5px 8px',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 4, marginRight: 6 }}>
          {(['radial', 'hierarchical', 'force'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onLayoutChange(mode)}
              style={{
                background: activeLayout === mode ? 'rgba(59,130,246,0.2)' : 'transparent',
                border: activeLayout === mode ? '1px solid rgba(59,130,246,0.5)' : '1px solid transparent',
                borderRadius: 6, padding: '4px 8px',
                color: activeLayout === mode ? '#93c5fd' : '#64748b',
                fontSize: 11, fontWeight: 500, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <button
          onClick={() => fitView({ padding: 0.18, duration: 400 })}
          title="Fit graph to screen"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'transparent', border: 'none',
            color: '#94a3b8', fontSize: 11.5, cursor: 'pointer',
            padding: '4px 6px', borderRadius: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
          <Maximize2 size={13} />
          <span>Fit Screen</span>
        </button>
      </div>
    </div>
  );
};

export const GraphStructureExplorer: React.FC<GraphStructureExplorerProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  isLoading = false,
  title = 'Graph Structure Explorer',
  subtitle = 'Inspect how your professional information is connected into capabilities',
  returnButtonText = 'Return to Processing',
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [activeLayout, setActiveLayout] = useState<'radial' | 'hierarchical' | 'force'>('radial');

  // Reset selected node when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedNode(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Find relationships for selected node
  const connectedRelations = selectedNode ? edges.filter(
    e => e.source === selectedNode.id || e.target === selectedNode.id
  ).map(e => {
    const isOut = e.source === selectedNode.id;
    const otherId = isOut ? e.target : e.source;
    const otherNode = nodes.find(n => n.id === otherId);
    return {
      id: e.id,
      rel: e.label || e.type.replace(/_/g, ' '),
      direction: isOut ? 'outgoing' : 'incoming',
      targetName: otherNode?.name || otherId,
      targetType: otherNode?.type || 'unknown',
    };
  }) : [];

  const styleCfg = selectedNode ? NODE_STYLES[selectedNode.type] || NODE_STYLES.capability : null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(4,6,12,0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Top Header */}
      <div style={{
        height: 64, borderBottom: '1px solid rgba(30,45,64,0.8)',
        background: '#090d16',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Network size={18} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>
                {title}
              </h2>
              {nodes.length > 0 && (
                <div style={{
                  display: 'flex', gap: 6, alignItems: 'center',
                  background: 'rgba(30,45,64,0.6)', border: '1px solid rgba(59,130,246,0.3)',
                  padding: '2px 8px', borderRadius: 999,
                  color: '#93c5fd', fontSize: 11, fontWeight: 600,
                }}>
                  <span>{nodes.length} entities</span>
                  <span>·</span>
                  <span>{edges.length} relationships</span>
                </div>
              )}
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>
              {subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(30,45,64,0.8)',
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#e2e8f0', padding: '8px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,64,0.8)';
            }}
          >
            <ArrowLeft size={15} />
            <span>{returnButtonText}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        {/* Waiting State: when nodes are not ready yet */}
        {(isLoading || nodes.length === 0) ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 32, textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(13,17,23,0.8) 100%)',
              border: '1px solid rgba(59,130,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, position: 'relative',
            }}>
              <Loader2 size={36} color="#60a5fa" style={{ animation: 'spin 2s linear infinite' }} />
            </div>

            <h3 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Your graph structure is being prepared
            </h3>
            <p style={{ color: '#64748b', fontSize: 13.5, maxWidth: 440, lineHeight: 1.6, marginBottom: 28 }}>
              Extracting entities, projects, technologies, and verifying capability relationships from your submitted information...
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(30,45,64,0.4)', border: '1px solid rgba(45,65,90,0.5)',
              padding: '8px 16px', borderRadius: 8, color: '#94a3b8', fontSize: 12,
            }}>
              <Info size={14} color="#60a5fa" />
              <span>The explorer will automatically render the live graph as soon as the AI workflow responds.</span>
            </div>
          </div>
        ) : (
          <>
            {/* React Flow Interactive Canvas */}
            <div style={{ flex: 1, height: '100%', position: 'relative' }}>
              <ReactFlowProvider>
                <ExplorerCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodeSelect={setSelectedNode}
                  selectedNode={selectedNode}
                  activeLayout={activeLayout}
                  onLayoutChange={setActiveLayout}
                />
              </ReactFlowProvider>
            </div>

            {/* Node Inspection Drawer */}
            {selectedNode && (
              <div style={{
                width: 320, borderLeft: '1px solid rgba(30,45,64,0.8)',
                background: '#090d16',
                display: 'flex', flexDirection: 'column',
                padding: '20px', zIndex: 20, overflowY: 'auto',
                animation: 'fadeIn 0.15s ease-out',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '3px 10px', borderRadius: 999,
                    background: styleCfg?.bg || 'rgba(59,130,246,0.1)',
                    border: `1px solid ${styleCfg?.border || 'rgba(59,130,246,0.3)'}`,
                    color: styleCfg?.color || '#93c5fd',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    {selectedNode.type}
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: '#64748b', cursor: 'pointer', padding: 4,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                  >
                    <X size={16} />
                  </button>
                </div>

                <h3 style={{ color: '#f8fafc', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {selectedNode.name}
                </h3>

                {selectedNode.description && (
                  <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.5, marginBottom: 18 }}>
                    {selectedNode.description}
                  </p>
                )}

                {/* Relationships list */}
                <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                  <div style={{
                    color: '#64748b', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
                  }}>
                    Connected Relationships ({connectedRelations.length})
                  </div>

                  {connectedRelations.length === 0 ? (
                    <div style={{ color: '#475569', fontSize: 12, fontStyle: 'italic' }}>
                      No direct connections found.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {connectedRelations.map(rel => (
                        <div
                          key={rel.id}
                          style={{
                            background: 'rgba(15,23,42,0.6)',
                            border: '1px solid rgba(30,45,64,0.6)',
                            borderRadius: 8, padding: '8px 10px',
                            fontSize: 12,
                          }}
                        >
                          <div style={{
                            color: '#60a5fa', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 3,
                          }}>
                            {rel.rel}
                          </div>
                          <div style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            {rel.targetName}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

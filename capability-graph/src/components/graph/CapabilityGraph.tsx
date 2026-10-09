// src/components/graph/CapabilityGraph.tsx
// Information Hierarchy & Progressive Disclosure CapabilityGraph component.
// Prioritizes "What can this person do?" on initial load, revealing supporting skills,
// projects, technologies, and evidence progressively through interaction.

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow, Background, BackgroundVariant,
  useNodesState, useEdgesState, useReactFlow,
  ConnectionMode, ReactFlowProvider
} from '@xyflow/react';
import type { Node, Edge, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './GraphNode';
import { GraphControls } from './GraphControls';
import { GraphLegend } from './GraphLegend';
import type { GraphNodeData, NodeType } from '../../types/graph';
import {
  buildReactFlowData,
  computeLayoutPositions,
  calculateCapabilityMetrics,
  getCoreGraphNodeIds,
} from '../../data/mockGraph';

import { graphStore } from '../../services/graphStore';
import { Sparkles, RotateCcw, Eye, Layers } from 'lucide-react';

interface CapabilityGraphProps {
  onNodeSelect: (node: GraphNodeData | null) => void;
  selectedNodeId: string | null;
  searchHighlight?: string | null;
  focusNodeId?: string | null;
}

const CapabilityGraphInner: React.FC<CapabilityGraphProps> = ({
  onNodeSelect, selectedNodeId, searchHighlight, focusNodeId
}) => {
  const { fitView, setCenter } = useReactFlow();

  const [activeLayout, setActiveLayout] = useState<'radial' | 'hierarchical' | 'force'>('radial');
  const [activeFilters, setActiveFilters] = useState<NodeType[] | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  // Progressive disclosure state: 'progressive' starts with Core view, 'full' shows everything
  const [disclosureMode, setDisclosureMode] = useState<'progressive' | 'full'>('progressive');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  // Subscribe to graphStore for dynamic updates without page reload
  useEffect(() => {
    return graphStore.subscribe(newState => {
      setStoreState(newState);
    });
  }, []);

  // Adjacency map for graph expansion and highlighting
  const adjacency = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    storeState.edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, new Set());
      if (!adj.has(e.target)) adj.set(e.target, new Set());
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    });
    return adj;
  }, [storeState.edges]);

  // Compute visible node IDs based on Progressive Disclosure
  const visibleNodeIds = useMemo(() => {
    if (disclosureMode === 'full') {
      return new Set(storeState.nodes.map(n => n.id));
    }

    // Progressive mode: Start with Core high-priority nodes
    const visible = getCoreGraphNodeIds(storeState.nodes);

    // Expand connected nodes for any expanded node
    expandedNodeIds.forEach(expId => {
      visible.add(expId);
      const neighbors = adjacency.get(expId);
      if (neighbors) {
        neighbors.forEach(nId => visible.add(nId));
      }
    });

    // If search/selected node is outside core, ensure it is also visible
    const targetId = focusNodeId || selectedNodeId || searchHighlight;
    if (targetId) {
      visible.add(targetId);
      const targetNeighbors = adjacency.get(targetId);
      if (targetNeighbors) {
        targetNeighbors.forEach(nId => visible.add(nId));
      }
    }

    return visible;
  }, [disclosureMode, storeState.nodes, expandedNodeIds, adjacency, focusNodeId, selectedNodeId, searchHighlight]);

  // Filter nodes & edges to currently visible set
  const visibleNodes = useMemo(() => {
    return storeState.nodes.filter(n => visibleNodeIds.has(n.id));
  }, [storeState.nodes, visibleNodeIds]);

  const visibleEdges = useMemo(() => {
    return storeState.edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [storeState.edges, visibleNodeIds]);

  // Generate React Flow data
  const flowData = useMemo(() => {
    return buildReactFlowData(visibleNodes, visibleEdges, activeLayout, expandedNodeIds);
  }, [visibleNodes, visibleEdges, activeLayout, expandedNodeIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);

  // Sync state whenever visible nodes/edges or layout changes
  useEffect(() => {
    const freshFlowData = buildReactFlowData(visibleNodes, visibleEdges, activeLayout, expandedNodeIds);
    setNodes(freshFlowData.nodes);
    setEdges(freshFlowData.edges);
  }, [visibleNodes, visibleEdges, activeLayout, expandedNodeIds, setNodes, setEdges]);

  // Dynamic layout repositioning
  const handleLayoutChange = useCallback((newLayout: 'radial' | 'hierarchical' | 'force') => {
    setActiveLayout(newLayout);
    const newPositions = computeLayoutPositions(visibleNodes, newLayout, visibleEdges);

    setNodes(nds => nds.map(n => ({
      ...n,
      position: newPositions[n.id] ?? n.position,
    })));

    setTimeout(() => {
      fitView({ padding: 0.16, duration: 600 });
    }, 50);
  }, [visibleNodes, visibleEdges, setNodes, fitView]);

  // Apply selection, search highlighting, and focus mode
  useEffect(() => {
    const activeTargetId = focusNodeId || selectedNodeId || searchHighlight;
    const connected = activeTargetId ? adjacency.get(activeTargetId) ?? new Set<string>() : new Set<string>();

    setNodes(nds => nds.map(n => {
      const isSelected = n.id === activeTargetId;
      const isConnected = connected.has(n.id);

      // In focus mode, strictly isolate the target node + its 1-hop connections
      let isDimmed = false;
      if (focusNodeId) {
        isDimmed = !isSelected && !isConnected;
      } else if (activeTargetId) {
        isDimmed = !isSelected && !isConnected;
      }

      const isFiltered = activeFilters ? !activeFilters.includes((n.data as GraphNodeData).type) : false;

      return {
        ...n,
        data: {
          ...n.data,
          selected: isSelected,
          connected: isConnected,
          dimmed: isDimmed || isFiltered,
          isExpanded: expandedNodeIds.has(n.id),
        },
      };
    }));

    setEdges(eds => eds.map(e => {
      const isRelevant = !activeTargetId
        ? true
        : e.source === activeTargetId || e.target === activeTargetId;

      return {
        ...e,
        style: {
          stroke: isRelevant
            ? (activeTargetId ? 'rgba(96,165,250,0.85)' : 'rgba(96,165,250,0.45)')
            : 'rgba(255,255,255,0.06)',
          strokeWidth: isRelevant ? (activeTargetId ? 2.5 : 1.5) : 1,
        },
        labelStyle: {
          fill: isRelevant
            ? (activeTargetId ? 'rgba(165,200,250,0.95)' : '#94a3b8')
            : 'rgba(255,255,255,0)',
          fontSize: 9.5,
          fontWeight: activeTargetId ? 600 : 500,
        },
        labelBgStyle: {
          fill: isRelevant ? 'rgba(13,17,23,0.88)' : 'transparent',
          padding: isRelevant ? '2px 5px' : '0',
        },
        animated: isRelevant && !!activeTargetId,
      };
    }));
  }, [selectedNodeId, searchHighlight, focusNodeId, activeFilters, adjacency, expandedNodeIds, setNodes, setEdges]);

  // Center on search highlight or selection
  useEffect(() => {
    const targetId = searchHighlight || selectedNodeId;
    if (targetId) {
      const targetNode = nodes.find(n => n.id === targetId);
      if (targetNode) {
        setCenter(targetNode.position.x + 70, targetNode.position.y + 30, { zoom: 1.15, duration: 600 });
      }
    }
  }, [searchHighlight, selectedNodeId, nodes, setCenter]);

  // Node click handler with Progressive Disclosure expansion
  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const nodeData = node.data as GraphNodeData;

    // Toggle expansion for capabilities and projects in progressive mode
    if (disclosureMode === 'progressive') {
      if (nodeData.type === 'capability' || nodeData.type === 'project' || nodeData.type === 'skill') {
        setExpandedNodeIds(prev => {
          const next = new Set(prev);
          if (next.has(node.id)) {
            next.delete(node.id);
          } else {
            next.add(node.id);
          }
          return next;
        });
      }
    }

    if (selectedNodeId === node.id) {
      onNodeSelect(null);
    } else {
      onNodeSelect(nodeData);
    }
  }, [selectedNodeId, onNodeSelect, disclosureMode]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Reset to Core initial view
  const handleResetToCore = useCallback(() => {
    setExpandedNodeIds(new Set());
    setDisclosureMode('progressive');
    onNodeSelect(null);
    setTimeout(() => {
      fitView({ padding: 0.16, duration: 600 });
    }, 60);
  }, [onNodeSelect, fitView]);

  // Toggle between Core Capabilities view and Full graph
  const handleToggleDisclosure = useCallback(() => {
    if (disclosureMode === 'progressive') {
      setDisclosureMode('full');
    } else {
      setDisclosureMode('progressive');
      setExpandedNodeIds(new Set());
    }
    setTimeout(() => {
      fitView({ padding: 0.16, duration: 600 });
    }, 60);
  }, [disclosureMode, fitView]);

  // Fit view on mount
  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.16, duration: 800 }), 150);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Summary labels for active expanded items
  const expandedNames = useMemo(() => {
    return Array.from(expandedNodeIds)
      .map(id => storeState.nodes.find(n => n.id === id)?.name)
      .filter(Boolean) as string[];
  }, [expandedNodeIds, storeState.nodes]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* ─── Top Floating Progressive Disclosure Indicator ─── */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(13,17,23,0.92)',
        border: '1px solid rgba(45,65,90,0.6)',
        borderRadius: 24, padding: '6px 14px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        maxWidth: '92%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color="#e879f9" />
          <span style={{ color: '#e8edf5', fontSize: 12, fontWeight: 600 }}>
            {disclosureMode === 'progressive' ? 'Core Capabilities View' : 'Full Capability Graph'}
          </span>
        </div>

        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#4d5c75' }} />

        <span style={{ color: '#8b98b0', fontSize: 11.5 }}>
          {disclosureMode === 'progressive' ? (
            expandedNames.length > 0
              ? `Exploring: ${expandedNames.join(', ')} (${visibleNodes.length} visible)`
              : 'Showing primary capabilities · Click any node to expand supporting evidence'
          ) : (
            `Showing all ${storeState.nodes.length} entities`
          )}
        </span>

        {/* Reset to core view button */}
        {expandedNodeIds.size > 0 && disclosureMode === 'progressive' && (
          <button
            onClick={handleResetToCore}
            title="Collapse expanded details back to core view"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 12,
              background: 'rgba(232,121,249,0.12)',
              border: '1px solid rgba(232,121,249,0.3)',
              color: '#f0abfc', fontSize: 10.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(232,121,249,0.22)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(232,121,249,0.12)'}
          >
            <RotateCcw size={10} />
            Reset Core
          </button>
        )}

        {/* View mode toggle */}
        <button
          onClick={handleToggleDisclosure}
          title={disclosureMode === 'progressive' ? 'Reveal all entities in the graph' : 'Return to clean Core view'}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 12,
            background: disclosureMode === 'full' ? 'rgba(96,165,250,0.15)' : 'rgba(30,45,64,0.6)',
            border: `1px solid ${disclosureMode === 'full' ? 'rgba(96,165,250,0.5)' : 'rgba(45,65,90,0.8)'}`,
            color: disclosureMode === 'full' ? '#60a5fa' : '#cbd5e1',
            fontSize: 10.5, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.12s',
          }}
        >
          {disclosureMode === 'progressive' ? (
            <>
              <Layers size={11} />
              <span>Show All ({storeState.nodes.length})</span>
            </>
          ) : (
            <>
              <Eye size={11} />
              <span>Focus Core</span>
            </>
          )}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.15}
        maxZoom={2.5}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <GraphControls
          onFilter={setActiveFilters}
          activeFilters={activeFilters}
          onLayoutChange={handleLayoutChange}
          activeLayout={activeLayout}
          showLegend={showLegend}
          onToggleLegend={() => setShowLegend(p => !p)}
        />
        {showLegend && (
          <GraphLegend onClose={() => setShowLegend(false)} />
        )}
      </ReactFlow>
    </div>
  );
};

export const CapabilityGraph: React.FC<CapabilityGraphProps> = (props) => (
  <ReactFlowProvider>
    <CapabilityGraphInner {...props} />
  </ReactFlowProvider>
);

// src/pages/DashboardPage.tsx
// Main dashboard — graph is the hero. Sidebar + Header + Graph Workspace + Stats strip.
// Fully connected to Projects, Skills, Experience, Education, Evidence, Settings, and AI Analysis.

import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import type { SidebarPage } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { Stats } from '../components/dashboard/Stats';
import { NodeDetails } from '../components/dashboard/NodeDetails';
import { CapabilityGraph } from '../components/graph/CapabilityGraph';
import { AIAnalysisModal } from '../components/dashboard/AIAnalysisModal';
import { AddInformationModal } from '../components/dashboard/AddInformationModal';
import { ProjectsView } from '../components/dashboard/ProjectsView';
import { SkillsView } from '../components/dashboard/SkillsView';
import { ExperienceView } from '../components/dashboard/ExperienceView';
import { EducationView } from '../components/dashboard/EducationView';
import { EvidenceView } from '../components/dashboard/EvidenceView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { mockNodes } from '../data/mockGraph';
import type { GraphNodeData } from '../types/graph';
import { graphStore } from '../services/graphStore';

export const DashboardPage: React.FC<{ initialPage?: SidebarPage }> = ({ initialPage = 'dashboard' }) => {
  const [activePage, setActivePage] = useState<SidebarPage>(initialPage === 'add' ? 'dashboard' : initialPage);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [searchHighlight, setSearchHighlight] = useState<string | null>(null);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  // Multi-graph store subscription
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  React.useEffect(() => {
    return graphStore.subscribe((state) => {
      setStoreState(state);
    });
  }, []);

  // Modals
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(initialPage === 'add');
  const [modalMode, setModalMode] = useState<'create' | 'add'>('add');

  const handleOpenCreateGraph = useCallback(() => {
    setModalMode('create');
    setIsAddInfoOpen(true);
  }, []);

  const handleOpenAddInformation = useCallback(() => {
    setModalMode('add');
    setIsAddInfoOpen(true);
  }, []);

  React.useEffect(() => {
    if (initialPage === 'add') {
      setModalMode('add');
      setIsAddInfoOpen(true);
    } else if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  const handleNodeSelect = useCallback((node: GraphNodeData | null) => {
    setSelectedNode(node);
    if (!node) {
      setFocusNodeId(null);
    }
  }, []);

  const handleSearch = useCallback((result: GraphNodeData | null) => {
    if (result) {
      setActivePage('graph');
      setSearchHighlight(result.id);
      setSelectedNode(result);
    } else {
      setSearchHighlight(null);
      setSelectedNode(null);
    }
  }, []);

  const handleNavigateToNode = useCallback((nodeId: string) => {
    const node = mockNodes.find(n => n.id === nodeId);
    if (node) {
      setActivePage('graph');
      setSelectedNode(node);
      setSearchHighlight(nodeId);
    }
  }, []);

  const handleExploreInGraph = useCallback((nodeId: string) => {
    handleNavigateToNode(nodeId);
  }, [handleNavigateToNode]);

  const handleToggleFocus = useCallback(() => {
    if (!selectedNode) return;
    setFocusNodeId(prev => (prev === selectedNode.id ? null : selectedNode.id));
  }, [selectedNode]);

  const handleSidebarNavigate = (page: SidebarPage) => {
    if (page === 'new_graph') {
      handleOpenCreateGraph();
    } else if (page === 'add') {
      handleOpenAddInformation();
    } else {
      setActivePage(page);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      background: '#07090f', overflow: 'hidden',
    }}>
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onAIAnalysis={() => setIsAIAnalysisOpen(true)}
        onCreateNewGraph={handleOpenCreateGraph}
        onAddInformation={handleOpenAddInformation}
      />

      {/* Main content area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar activePage={activePage} onNavigate={handleSidebarNavigate} />

        {/* Dynamic page content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {/* Graph view (Hero) */}
          {(activePage === 'dashboard' || activePage === 'graph') && (
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                flex: 1, position: 'relative',
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                backgroundColor: '#07090f',
                overflow: 'hidden',
              }}>
                {/* Graph top bar badge */}
                <div style={{
                  position: 'absolute', top: 14, left: 14, right: selectedNode ? 324 : 14,
                  zIndex: 5, display: 'flex', alignItems: 'center', gap: 10,
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 7,
                    background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(30,45,64,0.8)',
                    pointerEvents: 'auto',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#3b82f6',
                      boxShadow: '0 0 6px rgba(59,130,246,0.5)',
                    }} />
                    <span style={{ color: '#8b98b0', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {storeState.currentGraph?.name || 'Capability Graph'}
                    </span>
                    <span style={{ color: '#2a3d56', fontSize: 11 }}>·</span>
                    <span style={{ color: '#4d5c75', fontSize: 11 }}>
                      {storeState.nodes.length} nodes · {storeState.edges.length} edges
                    </span>
                  </div>

                  {focusNodeId && (
                    <div style={{
                      padding: '5px 12px', borderRadius: 7,
                      background: 'rgba(59,130,246,0.15)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(59,130,246,0.4)',
                      color: '#60a5fa', fontSize: 11, fontWeight: 600,
                      pointerEvents: 'auto',
                    }}>
                      Focus Mode Active · Click node to toggle
                    </div>
                  )}
                </div>

                {/* THE GRAPH */}
                <CapabilityGraph
                  onNodeSelect={handleNodeSelect}
                  selectedNodeId={selectedNode?.id ?? null}
                  searchHighlight={searchHighlight}
                  focusNodeId={focusNodeId}
                />
              </div>

              {/* Node details drawer */}
              {selectedNode && (
                <NodeDetails
                  node={selectedNode}
                  onClose={() => {
                    setSelectedNode(null);
                    setFocusNodeId(null);
                  }}
                  onNavigateToNode={handleNavigateToNode}
                  isFocused={focusNodeId === selectedNode.id}
                  onToggleFocus={handleToggleFocus}
                />
              )}
            </div>
          )}

          {activePage === 'projects' && (
            <ProjectsView
              onExploreInGraph={handleExploreInGraph}
              onOpenAddModal={() => setIsAddInfoOpen(true)}
            />
          )}

          {activePage === 'skills' && (
            <SkillsView onExploreInGraph={handleExploreInGraph} />
          )}

          {activePage === 'experience' && (
            <ExperienceView onExploreInGraph={handleExploreInGraph} />
          )}

          {activePage === 'education' && (
            <EducationView onExploreInGraph={handleExploreInGraph} />
          )}

          {activePage === 'evidence' && (
            <EvidenceView onExploreInGraph={handleExploreInGraph} />
          )}

          {activePage === 'settings' && (
            <SettingsView />
          )}
        </div>
      </div>

      {/* Stats strip at bottom */}
      <Stats />

      {/* AI Analysis Drawer Modal */}
      <AIAnalysisModal
        isOpen={isAIAnalysisOpen}
        onClose={() => setIsAIAnalysisOpen(false)}
        onFocusNode={handleNavigateToNode}
      />

      {/* Add Information Modal */}
      <AddInformationModal
        isOpen={isAddInfoOpen}
        onClose={() => setIsAddInfoOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
};

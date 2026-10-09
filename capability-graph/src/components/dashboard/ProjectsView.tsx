import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, Globe, Star, Plus } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { graphStore } from '../../services/graphStore';
import type { GraphNodeData } from '../../types/graph';
import { NODE_STYLES } from '../graph/nodeStyles';

interface ProjectsViewProps {
  onExploreInGraph: (nodeId: string) => void;
  onOpenAddModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onExploreInGraph, onOpenAddModal
}) => {
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);

  const projectNodes = storeState.nodes.filter(n => n.type === 'project');

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
            Projects
          </h1>
          <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
            First-class graph objects connecting code, technologies, and demonstrated capabilities.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 7,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none', color: 'white', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
          }}
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Grid of project cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {projectNodes.map(project => {
          // Find connected technologies
          const techEdges = storeState.edges.filter(e => e.source === project.id && e.type === 'USES_TECHNOLOGY');
          const technologies = techEdges.map(e => storeState.nodes.find(n => n.id === e.target)).filter(Boolean) as GraphNodeData[];

          // Find connected capabilities
          const capEdges = storeState.edges.filter(e => e.source === project.id && e.type === 'DEMONSTRATES');
          const capabilities = capEdges.map(e => storeState.nodes.find(n => n.id === e.target)).filter(Boolean) as GraphNodeData[];

          // Find connected evidence
          const evEdges = storeState.edges.filter(e => e.source === project.id && e.type === 'SUPPORTED_BY');
          const evidenceList = evEdges.map(e => storeState.nodes.find(n => n.id === e.target)).filter(Boolean) as GraphNodeData[];

          const githubUrl = (project.metadata as any)?.github;
          const demoUrl = (project.metadata as any)?.demo;

          return (
            <div
              key={project.id}
              style={{
                background: '#0d1117',
                border: '1px solid rgba(30,45,64,0.8)',
                borderRadius: 12, padding: '20px',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.4)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Card top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <h3 style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {project.name}
                  </h3>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
                    padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                    color: '#34d399', fontSize: 10, fontWeight: 600,
                  }}>
                    Demonstrated in Production
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {githubUrl && (
                    <a
                      href={githubUrl} target="_blank" rel="noreferrer"
                      style={{ color: '#64748b', padding: 4 }}
                      title="GitHub Repository"
                    >
                      <GithubIcon size={15} />
                    </a>
                  )}
                  {demoUrl && (
                    <a
                      href={demoUrl} target="_blank" rel="noreferrer"
                      style={{ color: '#60a5fa', padding: 4 }}
                      title="Live Deployment"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{ color: '#8b98b0', fontSize: 12, lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                {project.description}
              </p>

              {/* Tech stack */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  Technologies
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {technologies.map(tech => (
                    <span
                      key={tech.id}
                      style={{
                        padding: '2px 7px', borderRadius: 4,
                        background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        color: '#c084fc', fontSize: 11, fontWeight: 500,
                      }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capabilities & Evidence summary */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 8,
                background: '#131920', border: '1px solid rgba(30,45,64,0.6)',
                marginBottom: 14, fontSize: 11, color: '#8b98b0',
              }}>
                <span><strong>{capabilities.length}</strong> Capabilities</span>
                <span>•</span>
                <span><strong>{evidenceList.length}</strong> Evidence Sources</span>
                <span>•</span>
                <span><strong>{techEdges.length + capEdges.length + evEdges.length}</strong> Connections</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onExploreInGraph(project.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '8px 12px', borderRadius: 7,
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#60a5fa', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
                }}
              >
                Explore in Graph
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// src/pages/PublicProfilePage.tsx
// Public shareable profile at /u/:username (PRD §18, UI Spec §23).
// Graph remains the primary hero visual element.

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hexagon, Share2, ArrowLeft } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/BrandIcons';
import { CapabilityGraph } from '../components/graph/CapabilityGraph';
import { NodeDetails } from '../components/dashboard/NodeDetails';
import type { GraphNodeData } from '../types/graph';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#07090f', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', color: '#e8edf5',
    }}>
      {/* Top Navigation */}
      <header style={{
        height: 52, padding: '0 20px',
        background: '#0d1117', borderBottom: '1px solid rgba(30,45,64,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none', border: 'none', color: '#8b98b0',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <span style={{ color: '#2a3d56' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 5,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Hexagon size={12} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>CapabilityGraph</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 6,
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#60a5fa', fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Share2 size={13} />
            {copied ? 'Link Copied!' : 'Share Profile'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Profile Summary Panel */}
        <aside style={{
          width: 320, height: '100%',
          background: '#0a0d14', borderRight: '1px solid rgba(30,45,64,0.8)',
          padding: '24px 20px', display: 'flex', flexDirection: 'column',
          overflowY: 'auto', flexShrink: 0,
        }}>
          {/* Avatar and name */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: 'white',
            marginBottom: 14, boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}>
            I
          </div>

          <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', textTransform: 'capitalize' }}>
            {username ? username.replace(/-/g, ' ') : 'Indraj Gupta'}
          </h1>
          <div style={{ color: '#60a5fa', fontSize: 12.5, fontWeight: 500, marginBottom: 8 }}>
            AI/ML Developer & Full-Stack Engineer
          </div>
          <p style={{ color: '#8b98b0', fontSize: 12, lineHeight: 1.6, margin: '0 0 16px' }}>
            Building software with AI, automation and modern web technologies. Transforming unstructured capability into connected graph systems.
          </p>

          {/* Social Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <a
              href="https://github.com/indraj" target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 6,
                background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                color: '#e2e8f0', fontSize: 11, textDecoration: 'none',
              }}
            >
              <GithubIcon size={13} /> GitHub
            </a>
            <a
              href="https://linkedin.com" target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 6,
                background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                color: '#e2e8f0', fontSize: 11, textDecoration: 'none',
              }}
            >
              <LinkedinIcon size={13} /> LinkedIn
            </a>
          </div>

          {/* Verified Stats Strip */}
          <div style={{
            background: '#131920', border: '1px solid rgba(30,45,64,0.7)',
            borderRadius: 8, padding: '12px', display: 'flex',
            flexDirection: 'column', gap: 8, fontSize: 11.5,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Projects:</span>
              <strong style={{ color: '#38bdf8' }}>3 Verified</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Capabilities:</span>
              <strong style={{ color: '#34d399' }}>5 Demonstrated</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Evidence Proofs:</span>
              <strong style={{ color: '#a78bfa' }}>3 Artifacts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Graph Nodes:</span>
              <strong style={{ color: '#e2e8f0' }}>26 Entities</strong>
            </div>
          </div>

          <div style={{ color: '#475569', fontSize: 10, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            Core Verified Projects
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['FarmSeva', 'CapabilityGraph', 'Unplug'].map(proj => (
              <div
                key={proj}
                style={{
                  padding: '7px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(30,45,64,0.5)',
                  fontSize: 11.5, color: '#cbd5e1',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{proj}</span>
                <span style={{ color: '#34d399', fontSize: 9.5, fontWeight: 600 }}>Active</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Hero Graph */}
        <main style={{ flex: 1, position: 'relative', height: '100%', background: '#07090f' }}>
          <div style={{
            position: 'absolute', top: 14, left: 14, zIndex: 5,
            padding: '5px 12px', borderRadius: 7,
            background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(30,45,64,0.8)',
            fontSize: 11, color: '#8b98b0',
          }}>
            Interactive Capability Graph · Click any node to inspect evidence
          </div>

          <CapabilityGraph
            onNodeSelect={setSelectedNode}
            selectedNodeId={selectedNode?.id ?? null}
          />
        </main>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};

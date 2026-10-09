// src/components/graph/GraphControls.tsx
// Bottom-left zoom controls and bottom-right filter/layout/legend controls.

import React from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw,
  Filter, LayoutGrid, BookOpen, X
} from 'lucide-react';
import type { NodeType } from '../../types/graph';
import { NODE_STYLES } from './nodeStyles';

interface GraphControlsProps {
  onFilter: (types: NodeType[] | null) => void;
  activeFilters: NodeType[] | null;
  onLayoutChange: (layout: 'force' | 'radial' | 'hierarchical') => void;
  activeLayout: string;
  showLegend: boolean;
  onToggleLegend: () => void;
}

const ALL_NODE_TYPES: NodeType[] = [
  'person','project','skill','technology','capability',
  'experience','education','evidence','certification'
];

const ControlButton: React.FC<{
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, active, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: active ? 'rgba(96,165,250,0.15)' : 'rgba(13,17,23,0.9)',
      border: `1px solid ${active ? 'rgba(96,165,250,0.5)' : 'rgba(30,45,64,0.8)'}`,
      borderRadius: 6, cursor: 'pointer',
      color: active ? '#60a5fa' : '#8b98b0',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.color = '#e8edf5';
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(96,165,250,0.3)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.color = active ? '#60a5fa' : '#8b98b0';
      (e.currentTarget as HTMLButtonElement).style.borderColor = active ? 'rgba(96,165,250,0.5)' : 'rgba(30,45,64,0.8)';
    }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div style={{ width: 1, height: 20, background: 'rgba(30,45,64,0.8)', margin: '0 2px' }} />
);

export const GraphControls: React.FC<GraphControlsProps> = ({
  onFilter, activeFilters, onLayoutChange, activeLayout, showLegend, onToggleLegend
}) => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = React.useState(false);

  const toggleFilter = (type: NodeType) => {
    if (!activeFilters) {
      onFilter([type]);
    } else if (activeFilters.includes(type)) {
      const next = activeFilters.filter(t => t !== type);
      onFilter(next.length === 0 ? null : next);
    } else {
      onFilter([...activeFilters, type]);
    }
  };

  return (
    <>
      {/* Bottom-left: zoom controls */}
      <div style={{
        position: 'absolute', bottom: 24, left: 16, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <ControlButton onClick={() => zoomIn()} title="Zoom in">
          <ZoomIn size={14} />
        </ControlButton>
        <ControlButton onClick={() => zoomOut()} title="Zoom out">
          <ZoomOut size={14} />
        </ControlButton>
        <Divider />
        <ControlButton onClick={() => fitView({ padding: 0.12, duration: 600 })} title="Fit graph">
          <Maximize2 size={13} />
        </ControlButton>
        <ControlButton onClick={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 400 })} title="Reset view">
          <RotateCcw size={13} />
        </ControlButton>
      </div>

      {/* Bottom-right: filter/layout/legend */}
      <div style={{
        position: 'absolute', bottom: 24, right: 16, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end',
      }}>
        <ControlButton
          onClick={() => { setShowFilterPanel(p => !p); setShowLayoutPanel(false); }}
          title="Filter"
          active={!!activeFilters || showFilterPanel}
        >
          <Filter size={13} />
        </ControlButton>
        <ControlButton
          onClick={() => { setShowLayoutPanel(p => !p); setShowFilterPanel(false); }}
          title="Layout"
          active={showLayoutPanel}
        >
          <LayoutGrid size={13} />
        </ControlButton>
        <ControlButton onClick={onToggleLegend} title="Legend" active={showLegend}>
          <BookOpen size={13} />
        </ControlButton>
      </div>

      {/* Filter panel */}
      {showFilterPanel && (
        <div style={{
          position: 'absolute', bottom: 100, right: 16, zIndex: 20,
          background: 'rgba(13,17,23,0.96)',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 10, padding: '12px',
          backdropFilter: 'blur(12px)',
          minWidth: 160,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 10, paddingBottom: 8,
            borderBottom: '1px solid rgba(30,45,64,0.8)',
          }}>
            <span style={{ color: '#e8edf5', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Filter
            </span>
            <button onClick={() => onFilter(null)} style={{
              fontSize: 10, color: '#60a5fa', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0,
            }}>
              Show all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ALL_NODE_TYPES.map(type => {
              const s = NODE_STYLES[type];
              const isActive = !activeFilters || activeFilters.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: isActive ? `${s.bg}cc` : 'transparent',
                    transition: 'background 0.1s',
                    width: '100%', textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0,
                    opacity: isActive ? 1 : 0.3,
                  }} />
                  <span style={{
                    color: isActive ? '#e8edf5' : '#4d5c75',
                    fontSize: 11, fontWeight: 500,
                  }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Layout panel */}
      {showLayoutPanel && (
        <div style={{
          position: 'absolute', bottom: 100, right: 16, zIndex: 20,
          background: 'rgba(13,17,23,0.96)',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 10, padding: '12px',
          backdropFilter: 'blur(12px)',
          minWidth: 140,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            color: '#e8edf5', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: 10, paddingBottom: 8,
            borderBottom: '1px solid rgba(30,45,64,0.8)',
          }}>
            Layout
          </div>
          {(['force', 'radial', 'hierarchical'] as const).map(layout => (
            <button
              key={layout}
              onClick={() => { onLayoutChange(layout); setShowLayoutPanel(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeLayout === layout ? 'rgba(96,165,250,0.1)' : 'transparent',
                color: activeLayout === layout ? '#60a5fa' : '#8b98b0',
                fontSize: 12, fontWeight: 500, marginBottom: 2,
                transition: 'all 0.1s', textTransform: 'capitalize',
              }}
            >
              {layout}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

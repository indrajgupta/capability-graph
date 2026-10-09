import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Bell, ChevronDown, X, LogOut, Plus, Layers } from 'lucide-react';
import { graphStore } from '../../services/graphStore';
import type { GraphNodeData } from '../../types/graph';
import { NODE_STYLES } from '../graph/nodeStyles';
import { useAuth } from '../../context/AuthContext';
import { GraphSelectorDropdown } from './GraphSelectorDropdown';

interface HeaderProps {
  onSearch: (result: GraphNodeData | null) => void;
  onAIAnalysis: () => void;
  onCreateNewGraph: () => void;
  onAddInformation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onAIAnalysis,
  onCreateNewGraph,
  onAddInformation,
}) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNodeData[]>([]);
  const [focused, setFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentNodes, setCurrentNodes] = useState(() => graphStore.getState().nodes);

  useEffect(() => {
    return graphStore.subscribe((state) => {
      setCurrentNodes(state.nodes);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    const filtered = currentNodes.filter(n =>
      n.name.toLowerCase().includes(q.toLowerCase()) ||
      n.description?.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8);
    setResults(filtered);
  };

  const selectResult = (node: GraphNodeData) => {
    setQuery(node.name);
    setResults([]);
    onSearch(node);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    onSearch(null);
  };

  return (
    <header style={{
      height: 52,
      background: '#0d1117',
      borderBottom: '1px solid rgba(30,45,64,0.8)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 20px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 30,
    }}>
      {/* Graph Switcher & Manager */}
      <GraphSelectorDropdown
        onCreateNewGraph={onCreateNewGraph}
        onAddInformation={onAddInformation}
      />

      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px',
          background: focused ? '#131920' : 'rgba(19,25,32,0.6)',
          border: `1px solid ${focused ? 'rgba(96,165,250,0.4)' : 'rgba(30,45,64,0.8)'}`,
          borderRadius: 8, height: 34,
          transition: 'all 0.15s',
          boxShadow: focused ? '0 0 0 3px rgba(96,165,250,0.08)' : 'none',
        }}>
          <Search size={13} color={focused ? '#60a5fa' : '#4d5c75'} style={{ flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search skills, projects, technologies..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#e8edf5', fontSize: 12.5, fontFamily: 'inherit',
            }}
          />
          {query && (
            <button onClick={clearSearch} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4d5c75', display: 'flex', padding: 0,
            }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {results.length > 0 && focused && (
          <div style={{
            position: 'absolute', top: 38, left: 0, right: 0,
            background: '#0d1117',
            border: '1px solid rgba(30,45,64,0.8)',
            borderRadius: 8, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 100,
          }}>
            {results.map(node => {
              const s = NODE_STYLES[node.type];
              return (
                <button
                  key={node.id}
                  onMouseDown={() => selectResult(node)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', width: '100%', border: 'none',
                    background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: s.color, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e8edf5', fontSize: 12, fontWeight: 500 }}>{node.name}</div>
                    <div style={{ color: '#4d5c75', fontSize: 10, marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {s.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Create New Graph button */}
        <button
          onClick={onCreateNewGraph}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 7,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.22) 100%)',
            border: '1px solid rgba(59,130,246,0.35)',
            color: '#60a5fa', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          title="Create an independent graph with a unique Graph ID"
        >
          <Plus size={13} />
          Create New Graph
        </button>

        {/* Add Information button */}
        <button
          onClick={onAddInformation}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 7,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.22) 100%)',
            border: '1px solid rgba(16,185,129,0.35)',
            color: '#34d399', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          title="Add new information and merge into the active graph"
        >
          <Layers size={13} />
          Add Information
        </button>

        {/* AI Analysis button */}
        <button
          onClick={onAIAnalysis}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: 7,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(168,85,247,0.15) 100%)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#c084fc', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <Sparkles size={13} />
          AI Analysis
        </button>

        {/* Notifications */}
        <button style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'transparent', border: '1px solid rgba(30,45,64,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#4d5c75', transition: 'all 0.12s',
          position: 'relative',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#e8edf5';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.3)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = '#4d5c75';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
        }}
        >
          <Bell size={14} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 5, height: 5, borderRadius: '50%',
            background: '#3b82f6',
          }} />
        </button>

        {/* Avatar & User Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '2px 4px', borderRadius: 8,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'white', fontWeight: 700,
            }}>
              {(profile?.name || user?.user_metadata?.full_name || user?.email || 'I')[0].toUpperCase()}
            </div>
            <ChevronDown size={12} color="#4d5c75" />
          </button>

          {userMenuOpen && (
            <div style={{
              position: 'absolute', top: 38, right: 0,
              width: 240, background: '#0d1117',
              border: '1px solid rgba(30,45,64,0.9)',
              borderRadius: 10, padding: 8,
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
              zIndex: 100,
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(30,45,64,0.7)', marginBottom: 6 }}>
                <div style={{ color: '#e8edf5', fontSize: 12.5, fontWeight: 600 }}>
                  {profile?.name || user?.user_metadata?.full_name || 'Indraj Gupta'}
                </div>
                <div style={{ color: '#64748b', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'Demo Mode'}
                </div>
                {user?.id && (
                  <div style={{ color: '#334155', fontSize: 9.5, marginTop: 4, fontFamily: 'monospace' }}>
                    ID: {user.id.substring(0, 16)}...
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 10px', borderRadius: 6,
                  background: 'transparent', border: 'none',
                  color: '#f87171', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(127,29,29,0.15)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, GitBranch, Plus, PlusCircle, Briefcase, Zap,
  Clock, GraduationCap, LinkIcon, Settings,
  ChevronRight, Hexagon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { graphStore } from '../../services/graphStore';

export type SidebarPage =
  | 'dashboard' | 'graph' | 'add' | 'new_graph' | 'projects'
  | 'skills' | 'experience' | 'education' | 'evidence' | 'settings';

interface SidebarProps {
  activePage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  collapsed?: boolean;
}

interface NavGroup {
  label: string;
  items: Array<{ id: SidebarPage; label: string; icon: React.ReactNode }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={15} /> },
    ],
  },
  {
    label: 'BUILD',
    items: [
      { id: 'new_graph', label: 'Create New Graph', icon: <PlusCircle size={15} /> },
      { id: 'add',      label: 'Add Information',  icon: <Plus size={15} /> },
      { id: 'projects', label: 'Projects',          icon: <Briefcase size={15} /> },
      { id: 'skills',   label: 'Skills',            icon: <Zap size={15} /> },
    ],
  },
  {
    label: 'PROFILE',
    items: [
      { id: 'experience', label: 'Experience', icon: <Clock size={15} /> },
      { id: 'education',  label: 'Education',  icon: <GraduationCap size={15} /> },
      { id: 'evidence',   label: 'Evidence',   icon: <LinkIcon size={15} /> },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { user, profile } = useAuth();
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);
  return (
    <aside style={{
      width: 200,
      height: '100%',
      background: '#0d1117',
      borderRight: '1px solid rgba(30,45,64,0.8)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      padding: '16px 0',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 14px 16px',
        borderBottom: '1px solid rgba(30,45,64,0.6)',
        marginBottom: 10,
      }}>
        <div style={{
          width: 26, height: 26,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Hexagon size={14} color="white" fill="white" />
        </div>
        <span style={{
          color: '#e8edf5', fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
        }}>
          CapabilityGraph
        </span>
      </div>

      {/* Navigation groups */}
      <div style={{ flex: 1, padding: '0 8px' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 18 }}>
            <div style={{
              color: '#2a3d56', fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.1em', padding: '0 8px 6px',
              textTransform: 'uppercase',
            }}>
              {group.label}
            </div>

            {group.items.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '6.5px 10px', borderRadius: 7,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: isActive ? 'rgba(96,165,250,0.08)' : 'transparent',
                    color: isActive ? '#e8edf5' : '#8b98b0',
                    fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                    marginBottom: 1,
                    transition: 'all 0.12s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.color = '#e8edf5';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#8b98b0';
                    }
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 2, height: 14, borderRadius: 2,
                      background: '#3b82f6',
                    }} />
                  )}
                  <span style={{ color: isActive ? '#60a5fa' : 'inherit', display: 'flex' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}

            {/* If OVERVIEW, render MY GRAPH list of all user graphs */}
            {group.label === 'OVERVIEW' && (
              <div style={{ marginTop: 8, marginBottom: 4 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 8px 6px', color: '#475569', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GitBranch size={12} color="#60a5fa" />
                    <span>MY GRAPH</span>
                  </div>
                  <span style={{
                    fontSize: 10, background: 'rgba(30,45,64,0.6)',
                    padding: '1px 5px', borderRadius: 4, color: '#94a3b8',
                  }}>
                    {storeState.graphs.length}
                  </span>
                </div>

                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 2,
                  maxHeight: 180, overflowY: 'auto', paddingLeft: 4,
                }}>
                  {storeState.graphs.map(g => {
                    const isSelected = g.id === storeState.currentGraph?.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          graphStore.selectGraph(g.id);
                          onNavigate('dashboard');
                        }}
                        title={g.name}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          width: '100%', padding: '6px 8px', borderRadius: 6,
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          background: isSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                          color: isSelected ? '#93c5fd' : '#8b98b0',
                          fontSize: 12, fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.12s ease',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                            (e.currentTarget as HTMLElement).style.color = '#e8edf5';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#8b98b0';
                          }
                        }}
                      >
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: isSelected ? '#3b82f6' : '#334155',
                          boxShadow: isSelected ? '0 0 8px #3b82f6' : 'none',
                          flexShrink: 0,
                        }} />
                        <span style={{
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                        }}>
                          {g.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User profile at bottom */}
      <div style={{
        padding: '12px 12px 0',
        borderTop: '1px solid rgba(30,45,64,0.6)',
        marginTop: 'auto',
      }}>
        <div
          onClick={() => onNavigate('settings')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 6px', borderRadius: 7, cursor: 'pointer',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: 'white', fontWeight: 700, flexShrink: 0,
          }}>
            {(profile?.name || user?.user_metadata?.full_name || user?.email || 'I')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#e8edf5', fontSize: 11.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.name || user?.user_metadata?.full_name || 'Indraj Gupta'}
            </div>
            <div style={{ color: '#4d5c75', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.bio || user?.email || 'AI/ML Developer'}
            </div>
          </div>
          <ChevronRight size={12} color="#4d5c75" />
        </div>
      </div>
    </aside>
  );
};

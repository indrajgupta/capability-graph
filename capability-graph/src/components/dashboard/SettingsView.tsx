// src/components/dashboard/SettingsView.tsx
// Profile settings, Supabase connection status, and graph export options.

import React, { useState } from 'react';
import { Settings, Download, Database, CheckCircle2, AlertTriangle, RefreshCw, User, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { mockNodes, mockEdges } from '../../data/mockGraph';

import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { user, profile, updateProfile, isConfigured } = useAuth();

  const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || 'Indraj Gupta');
  const [headline, setHeadline] = useState(profile?.bio || 'AI/ML Developer & Full-Stack Engineer');
  const [bio, setBio] = useState(profile?.bio || 'Building software with AI, automation and modern web technologies.');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.bio) setBio(profile.bio);
    }
  }, [profile]);

  const handleExportJSON = () => {
    const data = {
      nodes: mockNodes,
      edges: mockEdges,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capability_graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name, bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{
      flex: 1, height: '100%', overflowY: 'auto',
      padding: '28px 36px', background: '#07090f',
    }}>
      <div style={{
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '1px solid rgba(30,45,64,0.7)',
      }}>
        <h1 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, margin: 0 }}>
          Settings & Data Management
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
          Configure your capability profile, inspect backend services, and export graph data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680 }}>
        {/* Profile Card */}
        <div style={{
          background: '#0d1117',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 12, padding: '22px',
        }}>
          <h2 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>
            Profile Configuration
          </h2>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                  color: '#e8edf5', fontSize: 12.5, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                  color: '#e8edf5', fontSize: 12.5, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8b98b0', fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>
                Short Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 7,
                  background: '#131920', border: '1px solid rgba(30,45,64,0.9)',
                  color: '#e8edf5', fontSize: 12.5, outline: 'none',
                }}
              />
            </div>

            {user?.id && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 5 }}>
                    Supabase User ID (auth.users.id)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.id}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 7,
                      background: '#090d14', border: '1px solid rgba(30,45,64,0.6)',
                      color: '#94a3b8', fontSize: 11.5, fontFamily: 'monospace', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 5 }}>
                    Email
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.email || 'N/A'}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 7,
                      background: '#090d14', border: '1px solid rgba(30,45,64,0.6)',
                      color: '#94a3b8', fontSize: 11.5, outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '8px 18px', borderRadius: 7,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none', color: 'white', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
              {saved && (
                <span style={{ color: '#34d399', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={14} /> Saved successfully
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Backend & Supabase Status */}
        <div style={{
          background: '#0d1117',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 12, padding: '22px',
        }}>
          <h2 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>
            Backend Infrastructure
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 8,
            background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Database size={18} color="#60a5fa" />
              <div>
                <div style={{ color: '#e8edf5', fontSize: 13, fontWeight: 600 }}>
                  Supabase Auth & Database
                </div>
                <div style={{ color: '#64748b', fontSize: 11 }}>
                  {isSupabaseConfigured()
                    ? 'Connected to live cloud Supabase instance'
                    : 'Running in high-fidelity local demo mode (env fallback enabled)'}
                </div>
              </div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', borderRadius: 5,
              background: isSupabaseConfigured() ? 'rgba(52,211,153,0.1)' : 'rgba(234,179,8,0.1)',
              border: `1px solid ${isSupabaseConfigured() ? 'rgba(52,211,153,0.3)' : 'rgba(234,179,8,0.3)'}`,
              color: isSupabaseConfigured() ? '#34d399' : '#facc15',
              fontSize: 11, fontWeight: 600,
            }}>
              {isSupabaseConfigured() ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              {isSupabaseConfigured() ? 'Active' : 'Demo Mode'}
            </div>
          </div>
        </div>

        {/* Graph Data Export */}
        <div style={{
          background: '#0d1117',
          border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 12, padding: '22px',
        }}>
          <h2 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>
            Data Export & Portability
          </h2>
          <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 16px' }}>
            Download your raw capability graph for Neo4j, GraphRAG, or external backups.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleExportJSON}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: 7,
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.4)',
                color: '#60a5fa', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Export Graph JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

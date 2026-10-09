// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hexagon, GitBranch, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Animated capability graph SVG
const HeroGraph: React.FC = () => (
  <svg width="100%" height="320" viewBox="0 0 600 320" style={{ maxWidth: 600 }}>
    {/* Animated edges */}
    <defs>
      <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#60a5fa" opacity="0.5" />
      </marker>
      <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" opacity="0.5" />
      </marker>
    </defs>

    <line x1="300" y1="160" x2="140" y2="90"  stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5">
      <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
    </line>
    <line x1="300" y1="160" x2="460" y2="90"  stroke="#34d399" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5">
      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2.5s" repeatCount="indefinite" />
    </line>
    <line x1="300" y1="160" x2="140" y2="240" stroke="#e879f9" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5">
      <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite" />
    </line>
    <line x1="300" y1="160" x2="460" y2="240" stroke="#fb923c" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5">
      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
    </line>
    <line x1="300" y1="160" x2="300" y2="40"  stroke="#818cf8" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5">
      <animate attributeName="stroke-dashoffset" from="5" to="-5" dur="1.8s" repeatCount="indefinite" />
    </line>
    <line x1="140" y1="90"  x2="60"  y2="90"  stroke="#60a5fa" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 8" />
    <line x1="460" y1="90"  x2="540" y2="90"  stroke="#34d399" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 8" />
    <line x1="140" y1="240" x2="60"  y2="240" stroke="#e879f9" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 8" />
    <line x1="460" y1="240" x2="540" y2="240" stroke="#fb923c" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 8" />

    {/* Person node — center */}
    <circle cx="300" cy="160" r="28" fill="#1e1f4a" stroke="#818cf8" strokeWidth="1.5">
      <animate attributeName="r" values="28;30;28" dur="3s" repeatCount="indefinite" />
    </circle>
    <text x="300" y="156" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="700">Indraj</text>
    <text x="300" y="170" textAnchor="middle" fill="#818cf8" fontSize="8" opacity="0.7">PERSON</text>

    {/* FarmSeva */}
    <rect x="75" y="68" width="92" height="44" rx="8" fill="#0d2e24" stroke="#34d399" strokeWidth="1.2" />
    <text x="121" y="88" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">FarmSeva</text>
    <text x="121" y="102" textAnchor="middle" fill="#34d399" fontSize="7.5" opacity="0.7">PROJECT</text>

    {/* React */}
    <rect x="433" y="68" width="75" height="44" rx="8" fill="#0c1f3a" stroke="#60a5fa" strokeWidth="1.2" />
    <text x="470" y="88" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">React</text>
    <text x="470" y="102" textAnchor="middle" fill="#60a5fa" fontSize="7.5" opacity="0.7">TECHNOLOGY</text>

    {/* AI Integration */}
    <rect x="68" y="218" width="110" height="44" rx="8" fill="#2d0f3a" stroke="#e879f9" strokeWidth="1.2" />
    <text x="123" y="238" textAnchor="middle" fill="#e879f9" fontSize="10" fontWeight="600">AI Integration</text>
    <text x="123" y="253" textAnchor="middle" fill="#e879f9" fontSize="7.5" opacity="0.7">CAPABILITY</text>

    {/* Supabase */}
    <rect x="420" y="218" width="92" height="44" rx="8" fill="#0c1f3a" stroke="#60a5fa" strokeWidth="1.2" />
    <text x="466" y="238" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">Supabase</text>
    <text x="466" y="253" textAnchor="middle" fill="#60a5fa" fontSize="7.5" opacity="0.7">TECHNOLOGY</text>

    {/* Top — Full-Stack */}
    <rect x="240" y="18" width="120" height="32" rx="8" fill="#2d1a0e" stroke="#fb923c" strokeWidth="1.2" />
    <text x="300" y="39" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="600">Full-Stack Dev</text>

    {/* Far left — Python */}
    <rect x="20" y="78" width="55" height="28" rx="6" fill="#2d1a0e" stroke="#fb923c" strokeWidth="0.8" opacity="0.7" />
    <text x="47" y="96" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="600">Python</text>

    {/* Far right — Vercel */}
    <rect x="525" y="78" width="56" height="28" rx="6" fill="#0c1f3a" stroke="#60a5fa" strokeWidth="0.8" opacity="0.7" />
    <text x="553" y="96" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">Vercel</text>
  </svg>
);

const Feature: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({ icon, title, body }) => (
  <div style={{
    padding: '20px 22px',
    background: '#0d1117',
    border: '1px solid rgba(30,45,64,0.8)',
    borderRadius: 12,
    transition: 'border-color 0.15s',
  }}
  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.25)'}
  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)'}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 9,
      background: 'rgba(96,165,250,0.08)',
      border: '1px solid rgba(96,165,250,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 12, color: '#60a5fa',
    }}>
      {icon}
    </div>
    <h3 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>{title}</h3>
    <p style={{ color: '#4d5c75', fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{body}</p>
  </div>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090f',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)',
    }}>
      {/* Nav */}
      <nav style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        borderBottom: '1px solid rgba(30,45,64,0.6)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,9,15,0.9)', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Hexagon size={14} color="white" fill="white" />
          </div>
          <span style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
            CapabilityGraph
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {loading ? (
            <div style={{ width: 140, height: 32 }} />
          ) : user ? (
            <>
              <span style={{ color: '#8b98b0', fontSize: 12.5, fontWeight: 500 }}>
                Signed in as <strong style={{ color: '#e8edf5' }}>{profile?.name || user?.user_metadata?.full_name || user.email}</strong>
              </span>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'opacity 0.12s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Go to Dashboard
                <ArrowRight size={13} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#8b98b0', fontSize: 13, fontWeight: 500, padding: '6px 12px',
                  borderRadius: 7, transition: 'color 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8edf5'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8b98b0'}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20,
          background: 'rgba(96,165,250,0.08)',
          border: '1px solid rgba(96,165,250,0.2)',
          marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
          <span style={{ color: '#60a5fa', fontSize: 11.5, fontWeight: 600 }}>AI-powered professional identity</span>
        </div>

        <h1 style={{
          color: '#e8edf5', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800, lineHeight: 1.18, marginBottom: 20,
          letterSpacing: '-0.03em', maxWidth: 680,
        }}>
          Your professional identity,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            connected.
          </span>
        </h1>

        <p style={{
          color: '#4d5c75', fontSize: 16, lineHeight: 1.75,
          maxWidth: 520, marginBottom: 36,
        }}>
          Turn your skills, projects, experience and evidence into an interactive capability graph.
          The relationships are the product.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {loading ? (
            <div style={{ height: 46, width: 220 }} />
          ) : user ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '12px 28px', borderRadius: 9,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'opacity 0.12s',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Open My Capability Graph
              <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '12px 24px', borderRadius: 9,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Build my capability graph
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 24px', borderRadius: 9,
                  background: 'transparent',
                  border: '1px solid rgba(30,45,64,0.8)',
                  color: '#8b98b0', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#e8edf5';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#8b98b0';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
                }}
              >
                Sign in to existing account
              </button>
            </>
          )}
        </div>

        {/* Hero graph */}
        <div style={{ marginTop: 64, width: '100%', maxWidth: 640 }}>
          <div style={{
            background: '#0d1117', border: '1px solid rgba(30,45,64,0.8)',
            borderRadius: 16, overflow: 'hidden',
            padding: '32px 20px 20px',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}>
            <HeroGraph />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 48px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          <Feature
            icon={<GitBranch size={17} />}
            title="Graph-first identity"
            body="Your skills, projects, and technologies are nodes. The connections between them are the real story."
          />
          <Feature
            icon={<Zap size={17} />}
            title="AI extraction"
            body="Describe a project in plain text. AI extracts structured entities and relationships automatically."
          />
          <Feature
            icon={<Shield size={17} />}
            title="Evidence over claims"
            body="Skills are marked Claimed, Used, Demonstrated, or Verified — never fake percentages."
          />
        </div>
      </section>
    </div>
  );
};

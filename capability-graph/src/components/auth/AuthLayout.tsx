// src/components/auth/AuthLayout.tsx
// Shared layout wrapper for all auth screens.

import React from 'react';
import { Hexagon } from 'lucide-react';

// Animated mini-graph for the auth pages
const MiniGraph: React.FC = () => (
  <svg width="340" height="200" viewBox="0 0 340 200" style={{ opacity: 0.35 }}>
    {/* Edges */}
    <line x1="170" y1="100" x2="60"  y2="60"  stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="170" y1="100" x2="280" y2="60"  stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="170" y1="100" x2="60"  y2="150" stroke="#e879f9" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="170" y1="100" x2="280" y2="150" stroke="#fb923c" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="170" y1="100" x2="170" y2="30"  stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60"  y1="60"  x2="60"  y2="150" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="4 8" />
    <line x1="280" y1="60"  x2="280" y2="150" stroke="#34d399" strokeWidth="0.5" strokeDasharray="4 8" />

    {/* Nodes */}
    {/* Center — Person */}
    <circle cx="170" cy="100" r="14" fill="#1e1f4a" stroke="#818cf8" strokeWidth="1.5" />
    <text x="170" y="103" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="600">IG</text>

    {/* FarmSeva */}
    <rect x="25" y="45" width="72" height="28" rx="6" fill="#0d2e24" stroke="#065f46" strokeWidth="1" />
    <text x="61" y="63" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="600">FarmSeva</text>

    {/* React */}
    <rect x="243" y="45" width="72" height="28" rx="6" fill="#0c1f3a" stroke="#1d4ed8" strokeWidth="1" />
    <text x="279" y="63" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">React</text>

    {/* AI Integration */}
    <rect x="10" y="137" width="100" height="26" rx="6" fill="#2d0f3a" stroke="#86198f" strokeWidth="1" />
    <text x="60" y="154" textAnchor="middle" fill="#e879f9" fontSize="8.5" fontWeight="600">AI Integration</text>

    {/* Supabase */}
    <rect x="231" y="137" width="78" height="26" rx="6" fill="#0c1f3a" stroke="#1d4ed8" strokeWidth="1" />
    <text x="270" y="154" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">Supabase</text>

    {/* Top label */}
    <rect x="130" y="18" width="82" height="24" rx="6" fill="#2d1a0e" stroke="#9a3412" strokeWidth="1" />
    <text x="171" y="34" textAnchor="middle" fill="#fb923c" fontSize="8.5" fontWeight="600">Full-Stack</text>
  </svg>
);

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div style={{
    minHeight: '100vh', display: 'flex',
    background: '#07090f',
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.04) 0%, transparent 50%)',
  }}>
    {/* Left panel — branding */}
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 48,
      borderRight: '1px solid rgba(30,45,64,0.6)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Hexagon size={18} color="white" fill="white" />
          </div>
          <span style={{ color: '#e8edf5', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
            CapabilityGraph
          </span>
        </div>

        <h1 style={{
          color: '#e8edf5', fontSize: 28, fontWeight: 700,
          lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.02em',
        }}>
          Your professional identity,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            connected.
          </span>
        </h1>

        <p style={{ color: '#4d5c75', fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>
          Turn your skills, projects, experience and evidence into an interactive capability graph.
        </p>

        <MiniGraph />
      </div>
    </div>

    {/* Right panel — form */}
    <div style={{
      width: 440, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 48,
    }}>
      {children}
    </div>
  </div>
);

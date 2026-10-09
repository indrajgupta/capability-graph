// src/pages/EmailVerificationPage.tsx
// Screen displayed after signup instructing the user to verify their email.
// Automatically detects verification completion via Supabase auth state change.

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, Hexagon, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const email = (location.state as any)?.email ?? user?.email ?? 'your email';
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If user is already verified and authenticated, redirect to dashboard
  useEffect(() => {
    if (user?.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Listen for verification event in real time
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const resend = async () => {
    setErrorMsg('');
    setResending(true);

    if (supabase && email && !email.includes('your email')) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to resend verification email.');
        setResending(false);
        return;
      }
    }

    setResending(false);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#07090f',
      backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(59,130,246,0.05) 0%, transparent 60%)',
      padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 40 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Hexagon size={16} color="white" fill="white" />
        </div>
        <span style={{ color: '#e8edf5', fontSize: 16, fontWeight: 700 }}>CapabilityGraph</span>
      </div>

      <div style={{
        background: '#0d1117', border: '1px solid rgba(30,45,64,0.8)',
        borderRadius: 16, padding: '36px 32px',
        textAlign: 'center', maxWidth: 400, width: '100%',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(96,165,250,0.08)',
          border: '1px solid rgba(96,165,250,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', color: '#60a5fa',
        }}>
          <Mail size={24} />
        </div>

        <h2 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Check your email to verify your account
        </h2>

        <p style={{ color: '#4d5c75', fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
          We sent an activation link to:
        </p>
        <p style={{
          color: '#60a5fa', fontSize: 13.5, fontWeight: 600, marginBottom: 24,
          padding: '6px 14px', borderRadius: 8,
          background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)',
          display: 'inline-block', wordBreak: 'break-all',
        }}>
          {email}
        </p>

        <p style={{ color: '#8b98b0', fontSize: 12.5, lineHeight: 1.6, marginBottom: 24 }}>
          Click the link in the email to activate your account.<br />
          Your capability graph dashboard is locked until verified.
        </p>

        {sent && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
            color: '#34d399', fontSize: 12,
          }}>
            <CheckCircle2 size={13} />
            <span>Verification email resent! Please check spam folder as well.</span>
          </div>
        )}

        {errorMsg && (
          <p style={{ color: '#f87171', fontSize: 12, marginBottom: 14 }}>{errorMsg}</p>
        )}

        <button
          onClick={resend}
          disabled={resending}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            width: '100%', padding: '10px', borderRadius: 8, marginBottom: 12,
            background: 'transparent', border: '1px solid rgba(30,45,64,0.8)',
            color: '#8b98b0', fontSize: 13, fontWeight: 500, cursor: resending ? 'wait' : 'pointer',
            transition: 'all 0.12s',
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
          <RefreshCw size={13} style={{ animation: resending ? 'spin 1s linear infinite' : 'none' }} />
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 12, marginTop: 4,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
        >
          <ArrowLeft size={12} />
          Back to sign in
        </button>
      </div>
    </div>
  );
};

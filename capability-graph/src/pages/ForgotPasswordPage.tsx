// src/pages/ForgotPasswordPage.tsx
// Requests password reset email via Supabase Auth.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetErr } = await resetPassword(email);

    setLoading(false);
    if (resetErr) {
      setError(resetErr.message || 'Failed to send reset email. Please try again.');
    } else {
      setSent(true);
    }
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 20, padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8edf5'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
        >
          <ArrowLeft size={13} />
          Back to sign in
        </button>

        <h2 style={{
          color: '#e8edf5', fontSize: 22, fontWeight: 700,
          marginBottom: 4, letterSpacing: '-0.02em',
        }}>
          Reset your password
        </h2>
        <p style={{ color: '#4d5c75', fontSize: 13, marginBottom: 28 }}>
          Enter your email to receive a password reset link
        </p>

        {sent ? (
          <div style={{
            background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 12, padding: 20, textAlign: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(52,211,153,0.12)', color: '#34d399',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <CheckCircle2 size={20} />
            </div>
            <h3 style={{ color: '#e8edf5', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>
              Reset Link Sent
            </h3>
            <p style={{ color: '#8b98b0', fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
              We've sent a password reset link to <strong style={{ color: '#e8edf5' }}>{email}</strong>.
              Click the link in your email to choose a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px',
                    background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                    borderRadius: 8, color: '#e8edf5', fontSize: 13,
                    outline: 'none', transition: 'border-color 0.12s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(96,165,250,0.5)'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(30,45,64,0.8)'}
                />
                <Mail size={14} color="#4d5c75" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: 8,
                background: loading
                  ? 'rgba(59,130,246,0.4)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', color: 'white', fontSize: 13.5, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'opacity 0.12s', marginTop: 4,
              }}
            >
              {loading ? 'Sending link...' : 'Send reset link'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

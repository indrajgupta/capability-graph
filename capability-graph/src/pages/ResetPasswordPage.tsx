// src/pages/ResetPasswordPage.tsx
// Screen for setting a new password after following the email reset link.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateErr } = await updatePassword(password);
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message || 'Failed to update password. Link may have expired.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <h2 style={{
          color: '#e8edf5', fontSize: 22, fontWeight: 700,
          marginBottom: 4, letterSpacing: '-0.02em',
        }}>
          Set new password
        </h2>
        <p style={{ color: '#4d5c75', fontSize: 13, marginBottom: 28 }}>
          Choose a secure password for your account
        </p>

        {success ? (
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
              Password Updated
            </h3>
            <p style={{ color: '#8b98b0', fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
              Your password has been reset successfully. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  style={{
                    width: '100%', padding: '10px 40px 10px 12px',
                    background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                    borderRadius: 8, color: '#e8edf5', fontSize: 13,
                    outline: 'none', transition: 'border-color 0.12s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(96,165,250,0.5)'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(30,45,64,0.8)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#4d5c75', display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                minLength={8}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
                  borderRadius: 8, color: '#e8edf5', fontSize: 13,
                  outline: 'none', transition: 'border-color 0.12s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(30,45,64,0.8)'}
              />
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
              {loading ? 'Updating password...' : 'Update password'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

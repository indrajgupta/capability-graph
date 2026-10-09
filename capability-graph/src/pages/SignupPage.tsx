// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';

import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
    borderRadius: 8, color: '#e8edf5', fontSize: 13,
    outline: 'none', transition: 'border-color 0.12s',
    boxSizing: 'border-box' as const,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpErr, needsEmailVerification } = await signUp(email, password, name);

    setLoading(false);
    if (signUpErr) {
      setError(signUpErr.message || 'Failed to create account.');
    } else if (needsEmailVerification) {
      navigate('/verify-email', { state: { email } });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <h2 style={{
          color: '#e8edf5', fontSize: 22, fontWeight: 700,
          marginBottom: 4, letterSpacing: '-0.02em',
        }}>
          Create your capability profile
        </h2>
        <p style={{ color: '#4d5c75', fontSize: 13, marginBottom: 28 }}>
          Build your interactive professional identity
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Name', value: name, set: setName, type: 'text', placeholder: 'Indraj Gupta' },
            { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                required
                style={inputStyle}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(30,45,64,0.8)'}
              />
            </div>
          ))}

          <div>
            <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                required
                minLength={8}
                style={{ ...inputStyle, paddingRight: 40 }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(30,45,64,0.8)'}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#4d5c75', display: 'flex',
              }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px', borderRadius: 8, marginTop: 4,
              background: loading ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none', color: 'white', fontSize: 13.5, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p style={{ color: '#4d5c75', fontSize: 12, textAlign: 'center', marginTop: 18 }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', fontSize: 12, fontWeight: 500 }}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

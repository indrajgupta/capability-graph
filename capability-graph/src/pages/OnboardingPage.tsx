// src/pages/OnboardingPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FolderOpen, Upload, Clock, Zap, Hexagon } from 'lucide-react';

type Step = 1 | 2 | 3;

const ProgressDots: React.FC<{ step: Step }> = ({ step }) => (
  <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
    {[1, 2, 3].map(s => (
      <div key={s} style={{
        width: s === step ? 20 : 6, height: 6, borderRadius: 3,
        background: s === step ? '#3b82f6' : s < step ? '#1d4ed8' : 'rgba(30,45,64,0.8)',
        transition: 'all 0.25s',
      }} />
    ))}
  </div>
);

const InputField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; multiline?: boolean;
}> = ({ label, value, onChange, placeholder, multiline }) => (
  <div>
    <label style={{ color: '#8b98b0', fontSize: 11.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%', padding: '10px 12px',
          background: '#131920', border: '1px solid rgba(30,45,64,0.8)',
          borderRadius: 8, color: '#e8edf5', fontSize: 13, resize: 'none',
          outline: 'none', transition: 'border-color 0.12s',
          boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
        }}
        onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(96,165,250,0.5)'}
        onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(30,45,64,0.8)'}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
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
    )}
  </div>
);

const AddOption: React.FC<{
  icon: React.ReactNode; title: string; desc: string; onClick: () => void;
}> = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '14px 16px', borderRadius: 10, width: '100%',
      background: '#0d1117', border: '1px solid rgba(30,45,64,0.8)',
      cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(96,165,250,0.04)';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.25)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = '#0d1117';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,45,64,0.8)';
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
      background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#60a5fa',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: '#e8edf5', fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{title}</div>
      <div style={{ color: '#4d5c75', fontSize: 12 }}>{desc}</div>
    </div>
  </button>
);

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#07090f',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139,92,246,0.04) 0%, transparent 60%)',
      padding: 24,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 40 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Hexagon size={15} color="white" fill="white" />
        </div>
        <span style={{ color: '#e8edf5', fontSize: 15, fontWeight: 700 }}>CapabilityGraph</span>
      </div>

      <div style={{
        background: '#0d1117', border: '1px solid rgba(30,45,64,0.8)',
        borderRadius: 16, padding: '36px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <ProgressDots step={step} />

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <h2 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
              Let's build your capability graph.
            </h2>
            <p style={{ color: '#4d5c75', fontSize: 13.5, lineHeight: 1.7, marginBottom: 28 }}>
              Your skills are scattered across resumes, projects, and profiles.
              We'll connect them for you.
            </p>
            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%', padding: '11px', borderRadius: 9,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              Get started
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <h2 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
              Tell us about yourself
            </h2>
            <p style={{ color: '#4d5c75', fontSize: 13, marginBottom: 22 }}>
              This becomes the centre of your graph.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <InputField label="Name" value={name} onChange={setName} placeholder="Indraj Gupta" />
              <InputField label="Headline" value={headline} onChange={setHeadline} placeholder="AI/ML Developer" />
              <InputField label="Short bio" value={bio} onChange={setBio} placeholder="Building software with AI, automation and modern web technologies..." multiline />
            </div>
            <button
              onClick={() => setStep(3)}
              style={{
                width: '100%', padding: '11px', borderRadius: 9,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <h2 style={{ color: '#e8edf5', fontSize: 20, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
              What do you want to add first?
            </h2>
            <p style={{ color: '#4d5c75', fontSize: 13, marginBottom: 20 }}>
              Choose how to start building your graph.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AddOption
                icon={<FolderOpen size={16} />}
                title="Add a project"
                desc="Describe a project — AI extracts technologies and capabilities"
                onClick={() => navigate('/ai-processing')}
              />
              <AddOption
                icon={<Upload size={16} />}
                title="Upload resume"
                desc="We'll parse your resume and build an initial graph"
                onClick={() => navigate('/ai-processing')}
              />
              <AddOption
                icon={<Clock size={16} />}
                title="Add experience"
                desc="Add a role and we'll identify relevant skills"
                onClick={() => navigate('/ai-processing')}
              />
              <AddOption
                icon={<Zap size={16} />}
                title="Add skills manually"
                desc="Start with a list of skills and connect them later"
                onClick={() => navigate('/dashboard')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

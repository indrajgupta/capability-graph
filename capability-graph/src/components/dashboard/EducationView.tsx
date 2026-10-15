// src/components/dashboard/EducationView.tsx
// Education, degrees, and verified certifications connected to the graph.

import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, ArrowRight } from 'lucide-react';
import { graphStore } from '../../services/graphStore';

interface EducationViewProps {
  onExploreInGraph: (nodeId: string) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({ onExploreInGraph }) => {
  const [storeState, setStoreState] = useState(() => graphStore.getState());

  useEffect(() => {
    return graphStore.subscribe(setStoreState);
  }, []);

  const eduNodes = storeState.nodes.filter(n => n.type === 'education');
  const certNodes = storeState.nodes.filter(n => n.type === 'certification');

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
          Education & Certifications
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
          Academic degrees and third-party verified technical credentials.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
        {/* Education Section */}
        <div>
          <h2 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Degrees & Formal Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {eduNodes.map(edu => {
              const inst = (edu.metadata as any)?.institution || 'Institute of Technology';
              const year = (edu.metadata as any)?.year || '2021 - 2025';

              return (
                <div
                  key={edu.id}
                  style={{
                    background: '#0d1117',
                    border: '1px solid rgba(30,45,64,0.8)',
                    borderRadius: 10, padding: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <GraduationCap size={18} color="#60a5fa" />
                    </div>
                    <div>
                      <h3 style={{ color: '#e8edf5', fontSize: 14.5, fontWeight: 700, margin: 0 }}>
                        {edu.name}
                      </h3>
                      <div style={{ color: '#64748b', fontSize: 11.5, marginTop: 3 }}>
                        {inst} · {year}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onExploreInGraph(edu.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 12px', borderRadius: 6,
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                      color: '#60a5fa', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    View in Graph <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <h2 style={{ color: '#e8edf5', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Verified Technical Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {certNodes.map(cert => {
              const issuer = (cert.metadata as any)?.issuer || 'DeepLearning.AI';
              const credId = (cert.metadata as any)?.credentialId || 'Verified';

              return (
                <div
                  key={cert.id}
                  style={{
                    background: '#0d1117',
                    border: '1px solid rgba(30,45,64,0.8)',
                    borderRadius: 10, padding: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(52,211,153,0.15)',
                      border: '1px solid rgba(52,211,153,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Award size={18} color="#34d399" />
                    </div>
                    <div>
                      <h3 style={{ color: '#e8edf5', fontSize: 14.5, fontWeight: 700, margin: 0 }}>
                        {cert.name}
                      </h3>
                      <div style={{ color: '#34d399', fontSize: 11.5, marginTop: 3 }}>
                        {issuer} · Credential ID: {credId}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onExploreInGraph(cert.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 12px', borderRadius: 6,
                      background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                      color: '#34d399', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    View in Graph <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

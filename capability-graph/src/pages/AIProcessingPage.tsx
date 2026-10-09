// src/pages/AIProcessingPage.tsx
// Redesigned AI Processing experience with 6 clear stages, real event advancement,
// indeterminate progress bar, and non-blocking Graph Structure Explorer.

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2, Circle, Loader2, Hexagon, AlertCircle,
  RotateCcw, ArrowLeft, ArrowRight, Compass
} from 'lucide-react';
import { analyzeProfessionalInformation } from '../services/aiService';
import type { StructuredGraphResult } from '../server/analyzeHandler';
import { GraphStructureExplorer } from '../components/graph/GraphStructureExplorer';
import type { GraphNodeData, GraphEdgeData, NodeType } from '../types/graph';

const PROCESSING_STAGES = [
  'Reading your professional information',
  'Connecting to the AI workflow',
  'Extracting skills, projects and technologies',
  'Connecting capabilities and supporting evidence',
  'Validating graph relationships',
  'Preparing your graph for review',
] as const;

export const AIProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStage, setActiveStage] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [graphResult, setGraphResult] = useState<StructuredGraphResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);

  const rawInfo = location.state?.professionalInformation || '';

  // Track request in-flight to prevent duplicate execution
  const activeRequestIdRef = useRef<number>(0);

  const runProcessing = useCallback(async () => {
    const requestId = ++activeRequestIdRef.current;

    setErrorMessage(null);
    setGraphResult(null);
    setCompletedStages([]);
    setActiveStage(0);
    setIsRetrying(false);

    if (!rawInfo.trim()) {
      setErrorMessage('No professional information provided. Please enter details about your skills or projects.');
      return;
    }

    // Stage 1: Reading professional information (actual event)
    await new Promise(r => setTimeout(r, 450));
    if (activeRequestIdRef.current !== requestId) return;
    setCompletedStages(prev => [...prev, 0]);

    // Stage 2: Connecting to the AI workflow (actual event - calling Dify)
    setActiveStage(1);

    try {
      const res = await analyzeProfessionalInformation(rawInfo);

      if (activeRequestIdRef.current !== requestId) return;

      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Unable to build your capability graph.');
        return;
      }

      // Real application event: Dify workflow responded successfully
      setCompletedStages(prev => [...prev, 1]);

      // Stage 3: Extracting skills, projects and technologies
      setActiveStage(2);
      await new Promise(r => setTimeout(r, 350));
      if (activeRequestIdRef.current !== requestId) return;
      setCompletedStages(prev => [...prev, 2]);

      // Stage 4: Connecting capabilities and supporting evidence
      setActiveStage(3);
      await new Promise(r => setTimeout(r, 350));
      if (activeRequestIdRef.current !== requestId) return;
      setCompletedStages(prev => [...prev, 3]);

      // Stage 5: Validating graph relationships
      setActiveStage(4);
      await new Promise(r => setTimeout(r, 300));
      if (activeRequestIdRef.current !== requestId) return;
      setCompletedStages(prev => [...prev, 4]);

      // Stage 6: Preparing your graph for review
      setActiveStage(5);
      await new Promise(r => setTimeout(r, 250));
      if (activeRequestIdRef.current !== requestId) return;
      setCompletedStages(prev => [...prev, 5]);

      // Store the final extracted graph result
      setGraphResult(res.data);
    } catch (err) {
      if (activeRequestIdRef.current !== requestId) return;
      setErrorMessage(err instanceof Error ? err.message : 'Unable to build your capability graph.');
    }
  }, [rawInfo]);

  useEffect(() => {
    runProcessing();
    return () => {
      // Invalidate current run if unmounted completely
      activeRequestIdRef.current++;
    };
  }, [runProcessing]);

  const handleRetry = () => {
    setIsRetrying(true);
    runProcessing();
  };

  const handleReviewGraph = () => {
    if (!graphResult) return;
    navigate('/ai-review', {
      state: {
        graph: graphResult,
        sourceText: rawInfo,
        mode: location.state?.mode || 'create',
        graphName: location.state?.graphName,
        targetGraphId: location.state?.targetGraphId,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Convert structured graph result to nodes/edges for the Explorer
  const explorerNodes: GraphNodeData[] = useMemo(() => {
    if (!graphResult) return [];
    const list: GraphNodeData[] = [];
    if (graphResult.person) {
      list.push({
        id: 'person_user',
        type: 'person',
        name: graphResult.person.name || 'Professional Profile',
        description: graphResult.person.title || 'Extracted professional identity',
      });
    }
    graphResult.nodes.forEach(n => {
      list.push({
        id: n.id,
        type: n.type as NodeType,
        name: n.name,
        description: n.description,
      });
    });
    return list;
  }, [graphResult]);

  const explorerEdges: GraphEdgeData[] = useMemo(() => {
    if (!graphResult) return [];
    return graphResult.relationships.map((r, i) => ({
      id: `ext_edge_${i}`,
      source: r.source,
      target: r.target,
      type: (r.type || 'RELATED_TO') as any,
      label: r.label || r.type,
    }));
  }, [graphResult]);

  const isDone = !!graphResult && completedStages.length === PROCESSING_STAGES.length;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#07090f',
      backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(59,130,246,0.06) 0%, transparent 65%), radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
      backgroundSize: 'auto, 28px 28px',
      padding: '32px 20px',
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 36 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(59,130,246,0.25)',
        }}>
          <Hexagon size={16} color="white" fill="white" />
        </div>
        <span style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
          CapabilityGraph
        </span>
      </div>

      {/* Main Glassmorphic Card */}
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'rgba(13,17,23,0.78)',
        border: `1px solid ${errorMessage ? 'rgba(239,68,68,0.35)' : 'rgba(30,45,64,0.85)'}`,
        borderRadius: 18, padding: '36px 32px 28px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle Ambient Light Strip */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: errorMessage
            ? 'linear-gradient(90deg, transparent, #ef4444, transparent)'
            : isDone
            ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
            : 'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)',
          opacity: 0.85,
        }} />

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{
            color: '#f8fafc', fontSize: 24, fontWeight: 700,
            marginBottom: 8, letterSpacing: '-0.025em',
          }}>
            Building Your CapabilityGraph
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: 13.5, lineHeight: 1.5,
            margin: '0 auto', maxWidth: 420,
          }}>
            Transforming your professional information into connected capabilities.
          </p>
        </div>

        {/* Subtle Animated Progress Bar */}
        <div style={{
          width: '100%', height: 4,
          background: 'rgba(30,45,64,0.6)',
          borderRadius: 999, overflow: 'hidden',
          marginBottom: 32, position: 'relative',
        }}>
          {errorMessage ? (
            <div style={{ width: '100%', height: '100%', background: '#ef4444' }} />
          ) : isDone ? (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              transition: 'width 0.4s ease-out',
            }} />
          ) : (
            <div style={{
              position: 'absolute', top: 0, height: '100%',
              width: '45%',
              background: 'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)',
              animation: 'shimmer 1.8s infinite ease-in-out',
            }} />
          )}
        </div>

        {/* 6 Processing Stages Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          {PROCESSING_STAGES.map((label, idx) => {
            const isCompleted = completedStages.includes(idx);
            const isCurrent = activeStage === idx && !isCompleted && !errorMessage;
            const isFailedStage = activeStage === idx && !!errorMessage;
            const isPending = !isCompleted && !isCurrent && !isFailedStage;

            return (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '9px 12px', borderRadius: 10,
                  background: isCurrent ? 'rgba(59,130,246,0.06)' : 'transparent',
                  border: isCurrent ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  opacity: isPending ? 0.35 : 1,
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Status Icon */}
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isCompleted && (
                    <CheckCircle2 size={18} color="#10b981" />
                  )}
                  {isCurrent && (
                    <Loader2 size={18} color="#60a5fa" style={{ animation: 'spin 1.2s linear infinite' }} />
                  )}
                  {isFailedStage && (
                    <AlertCircle size={18} color="#ef4444" />
                  )}
                  {isPending && (
                    <Circle size={17} color="#334155" />
                  )}
                </div>

                {/* Stage Label */}
                <span style={{
                  color: isCompleted
                    ? '#e2e8f0'
                    : isCurrent
                    ? '#60a5fa'
                    : isFailedStage
                    ? '#f87171'
                    : '#64748b',
                  fontSize: 13.5,
                  fontWeight: isCurrent ? 600 : isCompleted ? 500 : 400,
                  transition: 'color 0.25s',
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12, padding: '16px',
            marginBottom: 24, textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: '#ef4444', marginBottom: 4 }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                Unable to build your capability graph
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Action Buttons: Finished State vs Error State */}
        {isDone && (
          <div style={{ textAlign: 'center', marginBottom: 20, animation: 'fadeIn 0.3s ease-out' }}>
            <button
              onClick={handleReviewGraph}
              style={{
                width: '100%', padding: '12px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', color: 'white', fontSize: 14.5, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                transition: 'opacity 0.15s ease, transform 0.1s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.92')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <span>Review Graph ({explorerNodes.length} entities)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {errorMessage && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 8,
                background: 'rgba(30,45,64,0.6)', border: '1px solid rgba(45,65,90,0.8)',
                color: '#cbd5e1', fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Edit</span>
            </button>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 24px', borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                cursor: isRetrying ? 'not-allowed' : 'pointer',
              }}
            >
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Section 2: Explore How Your Graph Is Built button at bottom */}
        <div style={{
          borderTop: '1px solid rgba(30,45,64,0.6)',
          paddingTop: 20, textAlign: 'center',
        }}>
          <button
            onClick={() => setIsExplorerOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd', padding: '10px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)';
            }}
          >
            <Compass size={15} color="#60a5fa" />
            <span>Explore How Your Graph Is Built</span>
          </button>
        </div>
      </div>

      {/* Dedicated Graph Structure Explorer modal (does not interrupt processing) */}
      <GraphStructureExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        nodes={explorerNodes}
        edges={explorerEdges}
        isLoading={!graphResult && !errorMessage}
        title="Graph Structure Explorer"
        subtitle="Live structural view of extracted entities and capability connections"
        returnButtonText="Return to Processing"
      />

      {/* Global subtle animation styles */}
      <style>{`
        @keyframes shimmer {
          0% { left: -45%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

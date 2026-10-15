// src/components/graph/GraphNode.tsx
// Specialized node renderers implementing the CapabilityGraph information hierarchy.
// High Priority: Person, Core Capabilities
// Medium Priority: Projects, Supporting Skills, Technologies
// Detail Priority: Evidence, Experience, Education, Certifications

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { GraphNodeData, NodeType } from '../../types/graph';
import { NODE_STYLES } from './nodeStyles';
import { Sparkles, Layers, FolderGit2, CheckCircle2, Check } from 'lucide-react';

export interface GraphNodeProps extends NodeProps<Node<GraphNodeData>> {
  data: GraphNodeData;
  type: NodeType;
}

const EVIDENCE_LABELS: Record<string, string> = {
  claimed:      'Claimed',
  used:         'Used',
  demonstrated: 'Demonstrated',
  verified:     'Verified',
};

// ─── 1. PERSON NODE (Root / Anchor) ─────────────────────────────────────
const PersonNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.person;
  const selected = data.selected;
  const dimmed = data.dimmed;

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #1e1f4a 0%, #2d2f6e 100%)'
          : 'linear-gradient(135deg, #131433 0%, #1e1f4a 100%)',
        border: `2px solid ${selected ? '#a5b4fc' : s.color}`,
        boxShadow: selected
          ? `0 0 0 4px ${s.ring}, 0 10px 36px rgba(0,0,0,0.6)`
          : '0 4px 20px rgba(129,140,248,0.25)',
        opacity: dimmed ? 0.22 : 1,
        transform: selected ? 'scale(1.06)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '14px 18px',
        borderRadius: 14,
        minWidth: 160,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: `linear-gradient(135deg, ${s.color}66 0%, ${s.color}22 100%)`,
        border: `2px solid ${s.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 8px',
        fontSize: 18, color: '#e8edf5', fontWeight: 700,
        boxShadow: '0 0 12px rgba(129,140,248,0.4)',
      }}>
        {data.name.charAt(0)}
      </div>

      <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 700, lineHeight: 1.25, marginBottom: 2 }}>
        {data.name}
      </div>
      <div style={{
        color: '#a5b4fc', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        PERSON · ROOT ANCHOR
      </div>
    </div>
  );
});

// ─── 2. CORE CAPABILITY NODE (Highest Visual Priority) ─────────────────
const CapabilityNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.capability;
  const selected = data.selected;
  const dimmed = data.dimmed;
  const isExpanded = data.isExpanded;
  const count = data.supportingCount || 0;

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #3d144e 0%, #581c87 100%)'
          : 'linear-gradient(135deg, #240b2f 0%, #350f44 100%)',
        border: `1.8px solid ${selected ? '#f5d0fe' : s.color}`,
        boxShadow: selected
          ? `0 0 0 3px ${s.ring}, 0 8px 32px rgba(232,121,249,0.4)`
          : isExpanded
            ? '0 0 0 2px rgba(232,121,249,0.35), 0 4px 20px rgba(0,0,0,0.5)'
            : '0 2px 14px rgba(232,121,249,0.2)',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '10px 14px',
        borderRadius: 11,
        minWidth: 155,
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      {/* Header pill: Core Capability tag */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 6, marginBottom: 5,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(232,121,249,0.15)',
          padding: '2px 6px', borderRadius: 4,
        }}>
          <Sparkles size={10} color="#e879f9" />
          <span style={{ color: '#e879f9', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em' }}>
            CORE CAPABILITY
          </span>
        </div>

        {/* Expand indicator pill */}
        <div style={{
          fontSize: 8.5, fontWeight: 600,
          color: isExpanded ? '#34d399' : '#c084fc',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          {isExpanded ? (
            <>
              <Check size={10} />
              <span>Expanded</span>
            </>
          ) : (
            <>
              <span>+ Explore</span>
            </>
          )}
        </div>
      </div>

      {/* Capability Title */}
      <div style={{
        color: '#ffffff', fontSize: 12.5, fontWeight: 700,
        lineHeight: 1.3, marginBottom: 6,
      }}>
        {data.name}
      </div>

      {/* Footer metadata: Supporting projects & skills count */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 5, borderTop: '1px solid rgba(232,121,249,0.2)',
        fontSize: 9, color: '#e9d5ff',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Layers size={10} color="#e879f9" />
          {count > 0 ? `${count} Supporting Items` : 'Demonstrated'}
        </span>
        {data.evidenceStatus && (
          <span style={{
            color: '#a855f7', fontWeight: 600, textTransform: 'capitalize',
          }}>
            {data.evidenceStatus}
          </span>
        )}
      </div>
    </div>
  );
});

// ─── 3. PROJECT NODE (Supporting Capabilities) ──────────────────────────
const ProjectNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.project;
  const selected = data.selected;
  const dimmed = data.dimmed;
  const isExpanded = data.isExpanded;

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #0d382c 0%, #064e3b 100%)'
          : 'linear-gradient(135deg, #09241c 0%, #0d3227 100%)',
        border: `1.5px solid ${selected ? '#6ee7b7' : s.border}`,
        boxShadow: selected
          ? `0 0 0 3px ${s.ring}, 0 6px 24px rgba(52,211,153,0.35)`
          : '0 2px 10px rgba(0,0,0,0.35)',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '9px 13px',
        borderRadius: 10,
        minWidth: 140,
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 6, marginBottom: 4,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <FolderGit2 size={12} color="#34d399" />
          <span style={{ color: '#34d399', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em' }}>
            PROJECT
          </span>
        </div>
        {isExpanded ? (
          <span style={{ color: '#6ee7b7', fontSize: 8.5, fontWeight: 600 }}>✓ Expanded</span>
        ) : (
          <span style={{ color: '#a7f3d0', fontSize: 8.5, opacity: 0.8 }}>+ Evidence</span>
        )}
      </div>

      <div style={{ color: '#ffffff', fontSize: 12, fontWeight: 600, marginBottom: 3 }}>
        {data.name}
      </div>

      <div style={{
        color: '#6ee7b7', fontSize: 8.5, display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <CheckCircle2 size={10} color="#34d399" />
        <span>Demonstrates Capabilities</span>
      </div>
    </div>
  );
});

// ─── 4. SKILL NODE (Supporting Skill) ───────────────────────────────────
const SkillNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.skill;
  const selected = data.selected;
  const dimmed = data.dimmed;

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #3d1f0f 0%, #4a2712 100%)'
          : s.bg,
        border: `1.2px solid ${selected ? s.color : s.border}`,
        boxShadow: selected
          ? `0 0 0 2px ${s.ring}, 0 4px 18px rgba(251,146,60,0.3)`
          : '0 1px 6px rgba(0,0,0,0.3)',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '7px 11px',
        borderRadius: 8,
        minWidth: 95,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginBottom: 2,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: s.color,
        }} />
        <span style={{ color: '#e8edf5', fontSize: 11.5, fontWeight: 600 }}>
          {data.name}
        </span>
      </div>

      <div style={{
        color: s.color, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {data.evidenceStatus ? EVIDENCE_LABELS[data.evidenceStatus] : 'SKILL'}
      </div>
    </div>
  );
});

// ─── 5. TECHNOLOGY NODE ────────────────────────────────────────────────
const TechnologyNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.technology;
  const selected = data.selected;
  const dimmed = data.dimmed;

  return (
    <div
      style={{
        background: selected
          ? 'linear-gradient(135deg, #0c274a 0%, #103463 100%)'
          : s.bg,
        border: `1px solid ${selected ? s.color : s.border}`,
        boxShadow: selected
          ? `0 0 0 2px ${s.ring}, 0 4px 16px rgba(96,165,250,0.3)`
          : '0 1px 6px rgba(0,0,0,0.3)',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '6px 10px',
        borderRadius: 7,
        minWidth: 80,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{ color: '#e8edf5', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
        {data.name}
      </div>
      <div style={{ color: s.color, fontSize: 7.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        TECHNOLOGY
      </div>
    </div>
  );
});

// ─── 6. EVIDENCE NODE ──────────────────────────────────────────────────
const EvidenceNode = memo(({ data }: { data: GraphNodeData }) => {
  const s = NODE_STYLES.evidence;
  const selected = data.selected;
  const dimmed = data.dimmed;

  return (
    <div
      style={{
        background: selected ? '#252e42' : s.bg,
        border: `1px dashed ${selected ? '#cbd5e1' : s.border}`,
        boxShadow: selected ? `0 0 0 2px ${s.ring}` : 'none',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '6px 10px',
        borderRadius: 7,
        minWidth: 105,
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2,
      }}>
        <CheckCircle2 size={10} color="#94a3b8" />
        <span style={{ color: '#cbd5e1', fontSize: 10.5, fontWeight: 600 }}>
          {data.name}
        </span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        EVIDENCE · {data.evidenceStatus || 'VERIFIED'}
      </div>
    </div>
  );
});

// ─── 7. STANDARD / DETAIL NODE (Experience, Education, Certifications) ──
const DetailNode = memo(({ data, type }: { data: GraphNodeData; type: NodeType }) => {
  const s = NODE_STYLES[type] ?? NODE_STYLES.technology;
  const selected = data.selected;
  const dimmed = data.dimmed;

  return (
    <div
      style={{
        background: selected ? `linear-gradient(135deg, ${s.bg} 0%, ${s.bg}ee 100%)` : s.bg,
        border: `1px solid ${selected ? s.color : s.border}`,
        boxShadow: selected ? `0 0 0 2px ${s.ring}` : '0 1px 6px rgba(0,0,0,0.3)',
        opacity: dimmed ? 0.2 : 1,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        padding: '7px 11px',
        borderRadius: 8,
        minWidth: 100,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      <div style={{ color: '#e8edf5', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
        {data.name}
      </div>
      <div style={{ color: s.color, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {s.label}
      </div>
    </div>
  );
});

// Exported registered node components
export const PersonNodeComponent = memo((props: GraphNodeProps) => (
  <PersonNode data={props.data} />
));
export const CapabilityNodeComponent = memo((props: GraphNodeProps) => (
  <CapabilityNode data={props.data} />
));
export const ProjectNodeComponent = memo((props: GraphNodeProps) => (
  <ProjectNode data={props.data} />
));
export const SkillNodeComponent = memo((props: GraphNodeProps) => (
  <SkillNode data={props.data} />
));
export const TechnologyNodeComponent = memo((props: GraphNodeProps) => (
  <TechnologyNode data={props.data} />
));
export const EvidenceNodeComponent = memo((props: GraphNodeProps) => (
  <EvidenceNode data={props.data} />
));
export const ExperienceNodeComponent = memo((props: GraphNodeProps) => (
  <DetailNode data={props.data} type="experience" />
));
export const EducationNodeComponent = memo((props: GraphNodeProps) => (
  <DetailNode data={props.data} type="education" />
));
export const CertificationNodeComponent = memo((props: GraphNodeProps) => (
  <DetailNode data={props.data} type="certification" />
));

export const nodeTypes = {
  person:        PersonNodeComponent,
  capability:    CapabilityNodeComponent,
  project:       ProjectNodeComponent,
  skill:         SkillNodeComponent,
  technology:    TechnologyNodeComponent,
  evidence:      EvidenceNodeComponent,
  experience:    ExperienceNodeComponent,
  education:     EducationNodeComponent,
  certification: CertificationNodeComponent,
};

# Graph Report - capability-graph  (2026-10-08)

## Corpus Check
- Corpus is ~15,745 words - fits in a single context window. You may not need a graph.

## Summary
- 216 nodes · 299 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 150 input · 120 output

## Community Hubs (Navigation)
- Graph Visualization and Navigation
- Application Router and Auth
- Runtime Production Dependencies
- App TypeScript Configuration
- Node Details and Evidence UI
- Development Tooling Dependencies
- Build System Configuration
- Oxlint Linter Rules
- Backend and Supabase Integration
- TypeScript Project References
- Project Documentation

## God Nodes (most connected - your core abstractions)
1. `react` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `GraphNodeData` - 11 edges
5. `NodeType` - 9 edges
6. `NODE_STYLES` - 7 edges
7. `scripts` - 5 edges
8. `mockNodes` - 5 edges
9. `plugins` - 4 edges
10. `NodeDetails()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `HeaderProps` --references--> `GraphNodeData`  [EXTRACTED]
  src/components/dashboard/Header.tsx → src/types/graph.ts
- `NodeDetailsProps` --references--> `GraphNodeData`  [EXTRACTED]
  src/components/dashboard/NodeDetails.tsx → src/types/graph.ts
- `CapabilityGraphProps` --references--> `GraphNodeData`  [EXTRACTED]
  src/components/graph/CapabilityGraph.tsx → src/types/graph.ts
- `GraphControlsProps` --references--> `NodeType`  [EXTRACTED]
  src/components/graph/GraphControls.tsx → src/types/graph.ts
- `CapabilityGraphInner()` --calls--> `buildReactFlowData()`  [EXTRACTED]
  src/components/graph/CapabilityGraph.tsx → src/data/mockGraph.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "Graph Visualization and Navigation"
Cohesion: 0.08
Nodes (35): Header(), HeaderProps, NodeDetailsProps, buildAdjacency(), CapabilityGraph(), CapabilityGraphInner(), CapabilityGraphProps, ALL_NODE_TYPES (+27 more)

### Community 1 - "Application Router and Auth"
Cohesion: 0.08
Nodes (18): Index HTML Entrypoint, react, App(), AuthLayout(), AuthLayoutProps, AIProcessingPage(), STEPS, StepState (+10 more)

### Community 2 - "Runtime Production Dependencies"
Cohesion: 0.08
Nodes (24): framer-motion, lucide-react, dependencies, framer-motion, lucide-react, react, react-dom, react-router-dom (+16 more)

### Community 3 - "App TypeScript Configuration"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 4 - "Node Details and Evidence UI"
Cohesion: 0.12
Nodes (16): EVIDENCE_COLORS, EVIDENCE_LABELS, getConnectedNodes(), groupByType(), NodeDetails(), NAV_GROUPS, NavGroup, Sidebar() (+8 more)

### Community 5 - "Development Tooling Dependencies"
Cohesion: 0.10
Nodes (21): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+13 more)

### Community 6 - "Build System Configuration"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 7 - "Oxlint Linter Rules"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

## Knowledge Gaps
- **101 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Application Router and Auth` to `Graph Visualization and Navigation`, `Node Details and Evidence UI`, `Oxlint Linter Rules`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `plugins` connect `Oxlint Linter Rules` to `Application Router and Auth`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Development Tooling Dependencies` to `Runtime Production Dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Graph Visualization and Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07610993657505286 - nodes in this community are weakly interconnected._
- **Should `Application Router and Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.08408408408408409 - nodes in this community are weakly interconnected._
- **Should `Runtime Production Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
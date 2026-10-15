// src/services/graphStore.ts
// Central multi-graph state manager.
// Manages multiple independent professional graphs, React Flow graph state,
// Supabase persistence, Row Level Security, and local fallbacks.

import { supabase } from '../lib/supabase';
import { mockNodes, mockEdges } from '../data/mockGraph';
import type { GraphNodeData, GraphEdgeData, NodeType, RelationshipType, GraphRecord } from '../types/graph';
import type { StructuredGraphResult } from '../server/analyzeHandler';

export interface GraphStoreState {
  currentGraph: GraphRecord | null;
  graphs: GraphRecord[];
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  loading: boolean;
  error: string | null;
}

type Listener = (state: GraphStoreState) => void;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const LOCAL_STORAGE_GRAPHS_KEY = 'capgraph_multi_graphs_v1';
const LOCAL_STORAGE_ACTIVE_GRAPH_KEY = 'capgraph_active_graph_id_v1';

class GraphStore {
  private state: GraphStoreState = {
    currentGraph: {
      id: 'default-profile-graph',
      user_id: 'default',
      name: 'My Professional Profile',
      description: 'Core professional capability graph',
      created_at: new Date().toISOString(),
      node_count: mockNodes.length,
      edge_count: mockEdges.length,
    },
    graphs: [
      {
        id: 'default-profile-graph',
        user_id: 'default',
        name: 'My Professional Profile',
        description: 'Core professional capability graph',
        created_at: new Date().toISOString(),
        node_count: mockNodes.length,
        edge_count: mockEdges.length,
      },
    ],
    nodes: [...mockNodes],
    edges: [...mockEdges],
    loading: false,
    error: null,
  };

  private listeners = new Set<Listener>();
  private initialized = false;

  constructor() {
    this.init();
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getState(): GraphStoreState {
    return { ...this.state };
  }

  public getCurrentGraph(): GraphRecord | null {
    return this.state.currentGraph;
  }

  public getGraphs(): GraphRecord[] {
    return this.state.graphs;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snapshot = {
      ...this.state,
      graphs: [...this.state.graphs],
      nodes: [...this.state.nodes],
      edges: [...this.state.edges],
    };
    this.listeners.forEach((l) => l(snapshot));
  }

  /**
   * Initializes multi-graph state: loads graphs from Supabase (or localStorage fallback),
   * selects the active graph, and loads its isolated nodes and edges.
   */
  public async init() {
    this.state.loading = true;
    this.notify();

    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await this.initUserGraphs(user.id);
          this.initialized = true;
          this.state.loading = false;
          this.notify();
          return;
        }
      }

      // Guest / Demo mode or offline fallback
      this.initLocalFallback('demo-user');
    } catch (err: any) {
      console.warn('[GraphStore] Init fallback to local store:', err);
      this.initLocalFallback('demo-user');
    } finally {
      this.state.loading = false;
      this.notify();
    }
  }

  /**
   * Loads graphs belonging to an authenticated Supabase user.
   */
  private async initUserGraphs(userId: string) {
    if (!supabase) return;

    try {
      const { data: graphsData, error: graphsErr } = await supabase
        .from('graphs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (graphsErr) {
        // Table 'graphs' might not exist yet if user hasn't executed migration
        console.warn('[GraphStore] Graphs table query error:', graphsErr.message);
        this.initLocalFallback(userId);
        return;
      }

      let userGraphs: GraphRecord[] = graphsData || [];

      // If user has no graphs in DB, create default graph "My Professional Profile"
      if (userGraphs.length === 0) {
        const defaultGraphId = generateUUID();
        const defaultGraph: GraphRecord = {
          id: defaultGraphId,
          user_id: userId,
          name: 'My Professional Profile',
          description: 'Core professional capability graph',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertErr } = await supabase.from('graphs').insert({
          id: defaultGraph.id,
          user_id: userId,
          name: defaultGraph.name,
          description: defaultGraph.description,
        });

        if (!insertErr) {
          userGraphs = [defaultGraph];

          // Check if user has legacy nodes without graph_id to associate
          const { data: legacyNodes } = await supabase.from('nodes').select('id').eq('user_id', userId).is('graph_id', null);
          if (legacyNodes && legacyNodes.length > 0) {
            await supabase.from('nodes').update({ graph_id: defaultGraphId }).eq('user_id', userId).is('graph_id', null);
            await supabase.from('edges').update({ graph_id: defaultGraphId }).eq('user_id', userId).is('graph_id', null);
          } else {
            // Seed initial default mock graph so new users start with rich visual data
            await this.seedDefaultGraphData(userId, defaultGraphId);
          }
        } else {
          console.warn('[GraphStore] Error creating default graph:', insertErr.message);
          this.initLocalFallback(userId);
          return;
        }
      }

      this.state.graphs = userGraphs;

      // Restore last active graph or default to first
      const storedActiveId = localStorage.getItem(`${LOCAL_STORAGE_ACTIVE_GRAPH_KEY}_${userId}`);
      const activeGraph = userGraphs.find((g) => g.id === storedActiveId) || userGraphs[0];

      await this.loadGraphData(userId, activeGraph);
    } catch (err) {
      console.error('[GraphStore] Failed to load user graphs:', err);
      this.initLocalFallback(userId);
    }
  }

  /**
   * Loads isolated nodes and edges for a specific graph ID.
   */
  private async loadGraphData(userId: string, graph: GraphRecord) {
    if (!supabase) return;

    this.state.currentGraph = graph;
    localStorage.setItem(`${LOCAL_STORAGE_ACTIVE_GRAPH_KEY}_${userId}`, graph.id);

    try {
      const [nodesRes, edgesRes] = await Promise.all([
        supabase.from('nodes').select('*').eq('user_id', userId).eq('graph_id', graph.id),
        supabase.from('edges').select('*').eq('user_id', userId).eq('graph_id', graph.id),
      ]);

      if (nodesRes.error || edgesRes.error) {
        console.warn('[GraphStore] Error fetching graph data from Supabase:', nodesRes.error || edgesRes.error);
        // Fall back to local storage cache for this graph
        const cached = this.getLocalGraphData(graph.id);
        this.state.nodes = cached.nodes;
        this.state.edges = cached.edges;
      } else {
        const loadedNodes: GraphNodeData[] = (nodesRes.data || []).map((n: any) => ({
          id: n.id,
          type: n.type as NodeType,
          name: n.name,
          description: n.description || '',
          metadata: n.metadata || {},
          evidenceStatus: (n.status || n.evidence_status || 'demonstrated') as any,
        }));

        const loadedEdges: GraphEdgeData[] = (edgesRes.data || []).map((e: any) => ({
          id: e.id,
          source: e.source_node_id || e.source,
          target: e.target_node_id || e.target,
          type: (e.relationship_type || e.type) as RelationshipType,
          label: e.relationship_type || e.label || '',
        }));

        if (loadedNodes.length > 0) {
          this.state.nodes = loadedNodes;
          this.state.edges = loadedEdges;
          this.saveLocalGraphData(graph.id, loadedNodes, loadedEdges);
        } else {
          const cached = this.getLocalGraphData(graph.id);
          this.state.nodes = cached.nodes;
          this.state.edges = cached.edges;
        }
      }
    } catch (err) {
      console.error('[GraphStore] loadGraphData error:', err);
      const cached = this.getLocalGraphData(graph.id);
      this.state.nodes = cached.nodes;
      this.state.edges = cached.edges;
    }

    this.notify();
  }

  /**
   * Seeds default rich data into an initial user graph so it is populated immediately.
   */
  private async seedDefaultGraphData(userId: string, graphId: string) {
    if (!supabase) return;

    try {
      // Map mock nodes to DB UUIDs
      const mockIdToDbId = new Map<string, string>();
      const nodesToInsert = mockNodes.map((mn) => {
        const dbId = generateUUID();
        mockIdToDbId.set(mn.id, dbId);
        mockIdToDbId.set(mn.name.toLowerCase(), dbId);
        return {
          id: dbId,
          user_id: userId,
          graph_id: graphId,
          name: mn.name,
          type: mn.type,
          description: mn.description || '',
          status: mn.evidenceStatus || 'demonstrated',
          metadata: mn.metadata || {},
        };
      });

      const edgesToInsert: any[] = [];
      mockEdges.forEach((me) => {
        const sourceDbId = mockIdToDbId.get(me.source) || mockIdToDbId.get(me.source.toLowerCase());
        const targetDbId = mockIdToDbId.get(me.target) || mockIdToDbId.get(me.target.toLowerCase());
        if (sourceDbId && targetDbId) {
          edgesToInsert.push({
            id: generateUUID(),
            user_id: userId,
            graph_id: graphId,
            source_node_id: sourceDbId,
            target_node_id: targetDbId,
            relationship_type: me.type,
            metadata: {},
          });
        }
      });

      await supabase.from('nodes').insert(nodesToInsert);
      if (edgesToInsert.length > 0) {
        await supabase.from('edges').insert(edgesToInsert);
      }
    } catch (err) {
      console.warn('[GraphStore] seedDefaultGraphData skipped:', err);
    }
  }

  /**
   * Switches the active view to an existing graph.
   */
  public async selectGraph(graphId: string): Promise<boolean> {
    const targetGraph = this.state.graphs.find((g) => g.id === graphId);
    if (!targetGraph) {
      console.warn('[GraphStore] Graph not found:', graphId);
      return false;
    }

    let userId = 'demo-user';
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }

    await this.loadGraphData(userId, targetGraph);
    return true;
  }

  /**
   * OPERATION 1: CREATE A COMPLETELY NEW GRAPH
   * Creates a new, independent graph with its own unique graph ID.
   * Saves extracted nodes, relationships, projects, and evidence strictly under this new graph.
   * Never modifies or overwrites any existing graph.
   */
  public async createNewGraph(
    name: string,
    description?: string,
    initialData?: StructuredGraphResult
  ): Promise<{ success: boolean; graph?: GraphRecord; error?: string }> {
    try {
      let userId = 'demo-user';
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      }

      const newGraphId = generateUUID();
      const newGraph: GraphRecord = {
        id: newGraphId,
        user_id: userId,
        name: (name || 'Untitled Graph').trim(),
        description: description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        node_count: initialData?.nodes?.length || 0,
        edge_count: initialData?.relationships?.length || 0,
      };

      // 1. Persist graph entity to Supabase
      if (supabase && userId !== 'demo-user') {
        const { error: graphErr } = await supabase.from('graphs').insert({
          id: newGraph.id,
          user_id: userId,
          name: newGraph.name,
          description: newGraph.description,
        });

        if (graphErr) {
          console.warn('[GraphStore] Error inserting new graph to Supabase:', graphErr.message);
        }
      }

      // 2. Map and insert extracted nodes & relationships exclusively under this new graph
      const stateNodes: GraphNodeData[] = [];
      const stateEdges: GraphEdgeData[] = [];

      if (initialData && initialData.nodes && initialData.nodes.length > 0) {
        const difyIdToDbId = new Map<string, string>();
        const nodesToInsert: any[] = [];
        const edgesToInsert: any[] = [];

        // Map Dify node IDs to new unique database UUIDs
        initialData.nodes.forEach((n) => {
          const nodeDbId = generateUUID();
          difyIdToDbId.set(n.id, nodeDbId);
          difyIdToDbId.set(n.name.toLowerCase(), nodeDbId);

          nodesToInsert.push({
            id: nodeDbId,
            user_id: userId,
            graph_id: newGraphId,
            name: n.name,
            type: n.type,
            description: n.description || '',
            status: n.evidenceStatus || 'demonstrated',
            metadata: n.metadata || {},
          });

          stateNodes.push({
            id: nodeDbId,
            name: n.name,
            type: n.type as NodeType,
            description: n.description,
            metadata: n.metadata,
            evidenceStatus: (n.evidenceStatus as any) || 'demonstrated',
          });
        });

        // Map relationships
        (initialData.relationships || []).forEach((r) => {
          const sourceDbId = difyIdToDbId.get(r.source) || difyIdToDbId.get(r.source.toLowerCase());
          const targetDbId = difyIdToDbId.get(r.target) || difyIdToDbId.get(r.target.toLowerCase());

          if (sourceDbId && targetDbId && sourceDbId !== targetDbId) {
            const edgeDbId = generateUUID();
            const relType = r.type || r.label || 'RELATED_TO';

            edgesToInsert.push({
              id: edgeDbId,
              user_id: userId,
              graph_id: newGraphId,
              source_node_id: sourceDbId,
              target_node_id: targetDbId,
              relationship_type: relType,
              metadata: {},
            });

            stateEdges.push({
              id: edgeDbId,
              source: sourceDbId,
              target: targetDbId,
              type: relType as RelationshipType,
              label: r.label || relType,
            });
          }
        });

        // Insert into Supabase
        if (supabase && userId !== 'demo-user') {
          if (nodesToInsert.length > 0) {
            const { error: nErr } = await supabase.from('nodes').insert(nodesToInsert);
            if (nErr) console.warn('[GraphStore] Error inserting nodes:', nErr.message);
          }
          if (edgesToInsert.length > 0) {
            const { error: eErr } = await supabase.from('edges').insert(edgesToInsert);
            if (eErr) console.warn('[GraphStore] Error inserting edges:', eErr.message);
          }
        }
      }

      // 3. Update in-memory state and local storage cache
      this.saveLocalGraphData(newGraphId, stateNodes, stateEdges);
      const updatedGraphs = [newGraph, ...this.state.graphs];
      this.state.graphs = updatedGraphs;
      this.state.currentGraph = newGraph;
      this.state.nodes = stateNodes;
      this.state.edges = stateEdges;
      this.saveLocalGraphsList(userId, updatedGraphs);
      localStorage.setItem(`${LOCAL_STORAGE_ACTIVE_GRAPH_KEY}_${userId}`, newGraphId);

      this.notify();
      return { success: true, graph: newGraph };
    } catch (err: any) {
      console.error('[GraphStore] createNewGraph failed:', err);
      return { success: false, error: err.message || 'Failed to create new graph' };
    }
  }

  /**
   * OPERATION 2: ADD INFORMATION TO EXISTING GRAPH
   * Merges extracted information exclusively into the currently selected graph.
   * Deduplicates nodes and relationships ONLY within this target graph.
   * All other graphs remain completely untouched.
   */
  public async addInformationToGraph(
    graphId: string,
    data: StructuredGraphResult
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let userId = 'demo-user';
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      }

      const targetGraph = this.state.graphs.find((g) => g.id === graphId);
      if (!targetGraph) {
        return { success: false, error: 'Target graph not found' };
      }

      // If target graph is not currently active, switch to it first
      if (this.state.currentGraph?.id !== graphId) {
        await this.selectGraph(graphId);
      }

      const existingNodes = [...this.state.nodes];
      const existingEdges = [...this.state.edges];

      const difyIdToDbId = new Map<string, string>();
      const nameTypeToExistingNode = new Map<string, GraphNodeData>();

      existingNodes.forEach((n) => {
        nameTypeToExistingNode.set(`${n.name.trim().toLowerCase()}::${n.type.toLowerCase()}`, n);
        difyIdToDbId.set(n.name.trim().toLowerCase(), n.id);
      });

      const newNodesToInsert: any[] = [];
      const newEdgesToInsert: any[] = [];
      const addedStateNodes: GraphNodeData[] = [];
      const addedStateEdges: GraphEdgeData[] = [];

      // 1. Deduplicate and merge nodes within this graph only
      (data.nodes || []).forEach((n) => {
        const key = `${n.name.trim().toLowerCase()}::${n.type.toLowerCase()}`;
        const existingNode = nameTypeToExistingNode.get(key);

        if (existingNode) {
          // Equivalent node already exists in this graph: map Dify ID to existing node's UUID
          difyIdToDbId.set(n.id, existingNode.id);
          difyIdToDbId.set(n.name.trim().toLowerCase(), existingNode.id);
        } else {
          // New node for this graph: generate UUID
          const newNodeDbId = generateUUID();
          difyIdToDbId.set(n.id, newNodeDbId);
          difyIdToDbId.set(n.name.trim().toLowerCase(), newNodeDbId);

          newNodesToInsert.push({
            id: newNodeDbId,
            user_id: userId,
            graph_id: graphId,
            name: n.name,
            type: n.type,
            description: n.description || '',
            status: n.evidenceStatus || 'demonstrated',
            metadata: n.metadata || {},
          });

          const stateNode: GraphNodeData = {
            id: newNodeDbId,
            name: n.name,
            type: n.type as NodeType,
            description: n.description,
            metadata: n.metadata,
            evidenceStatus: (n.evidenceStatus as any) || 'demonstrated',
          };

          addedStateNodes.push(stateNode);
          nameTypeToExistingNode.set(key, stateNode);
        }
      });

      // 2. Deduplicate and merge relationships within this graph only
      (data.relationships || []).forEach((r) => {
        const sourceDbId = difyIdToDbId.get(r.source) || difyIdToDbId.get(r.source.trim().toLowerCase());
        const targetDbId = difyIdToDbId.get(r.target) || difyIdToDbId.get(r.target.trim().toLowerCase());

        if (sourceDbId && targetDbId && sourceDbId !== targetDbId) {
          const relType = r.type || r.label || 'RELATED_TO';

          // Avoid duplicate edge in this graph
          const isDuplicateEdge =
            existingEdges.some(
              (e) => e.source === sourceDbId && e.target === targetDbId && e.type === relType
            ) ||
            addedStateEdges.some(
              (e) => e.source === sourceDbId && e.target === targetDbId && e.type === relType
            );

          if (!isDuplicateEdge) {
            const edgeDbId = generateUUID();
            newEdgesToInsert.push({
              id: edgeDbId,
              user_id: userId,
              graph_id: graphId,
              source_node_id: sourceDbId,
              target_node_id: targetDbId,
              relationship_type: relType,
              metadata: {},
            });

            addedStateEdges.push({
              id: edgeDbId,
              source: sourceDbId,
              target: targetDbId,
              type: relType as RelationshipType,
              label: r.label || relType,
            });
          }
        }
      });

      // 3. Persist new entities to Supabase
      if (supabase && userId !== 'demo-user') {
        if (newNodesToInsert.length > 0) {
          const { error: nErr } = await supabase.from('nodes').insert(newNodesToInsert);
          if (nErr) console.warn('[GraphStore] Error inserting added nodes:', nErr.message);
        }
        if (newEdgesToInsert.length > 0) {
          const { error: eErr } = await supabase.from('edges').insert(newEdgesToInsert);
          if (eErr) console.warn('[GraphStore] Error inserting added edges:', eErr.message);
        }
        // Update graph updated_at
        await supabase
          .from('graphs')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', graphId);
      }

      // 4. Update in-memory state and local cache
      const updatedNodes = [...existingNodes, ...addedStateNodes];
      const updatedEdges = [...existingEdges, ...addedStateEdges];
      this.state.nodes = updatedNodes;
      this.state.edges = updatedEdges;
      this.saveLocalGraphData(graphId, updatedNodes, updatedEdges);

      // Update graph list timestamp
      targetGraph.updated_at = new Date().toISOString();
      targetGraph.node_count = updatedNodes.length;
      targetGraph.edge_count = updatedEdges.length;
      this.saveLocalGraphsList(userId, this.state.graphs);

      this.notify();
      return { success: true };
    } catch (err: any) {
      console.error('[GraphStore] addInformationToGraph failed:', err);
      return { success: false, error: err.message || 'Failed to add information to graph' };
    }
  }

  /**
   * Compatibility alias for AIReviewPage (delegates to addInformationToGraph or createNewGraph).
   */
  public async saveApprovedGraph(
    graph: StructuredGraphResult,
    options?: { mode?: 'create' | 'add'; graphName?: string; targetGraphId?: string }
  ): Promise<{ success: boolean; error?: string }> {
    const mode = options?.mode || (this.state.currentGraph ? 'add' : 'create');

    if (mode === 'create') {
      const res = await this.createNewGraph(options?.graphName || 'My Professional Profile', undefined, graph);
      return { success: res.success, error: res.error };
    } else {
      const targetId = options?.targetGraphId || this.state.currentGraph?.id;
      if (!targetId) {
        const res = await this.createNewGraph(options?.graphName || 'My Professional Profile', undefined, graph);
        return { success: res.success, error: res.error };
      }
      return this.addInformationToGraph(targetId, graph);
    }
  }

  /**
   * Renames an existing graph.
   */
  public async renameGraph(graphId: string, newName: string): Promise<boolean> {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    let userId = 'demo-user';
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }

    const g = this.state.graphs.find((item) => item.id === graphId);
    if (!g) return false;

    g.name = trimmed;
    g.updated_at = new Date().toISOString();

    if (this.state.currentGraph?.id === graphId) {
      this.state.currentGraph.name = trimmed;
    }

    if (supabase && userId !== 'demo-user') {
      await supabase.from('graphs').update({ name: trimmed, updated_at: new Date().toISOString() }).eq('id', graphId);
    }

    this.saveLocalGraphsList(userId, this.state.graphs);
    this.notify();
    return true;
  }

  /**
   * Deletes a graph and its associated nodes/edges.
   * If the active graph is deleted, switches to the next available graph.
   */
  public async deleteGraph(graphId: string): Promise<boolean> {
    let userId = 'demo-user';
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }

    // 1. Delete from Supabase
    if (supabase && userId !== 'demo-user') {
      // Cascading foreign keys handle nodes & edges, but execute explicit cleanup for safety
      await supabase.from('edges').delete().eq('graph_id', graphId).eq('user_id', userId);
      await supabase.from('nodes').delete().eq('graph_id', graphId).eq('user_id', userId);
      await supabase.from('graphs').delete().eq('id', graphId).eq('user_id', userId);
    }

    // 2. Remove local storage entry
    localStorage.removeItem(`capgraph_data_${graphId}`);

    // 3. Update in-memory graph list
    const updatedGraphs = this.state.graphs.filter((g) => g.id !== graphId);
    this.state.graphs = updatedGraphs;
    this.saveLocalGraphsList(userId, updatedGraphs);

    // 4. If current graph was deleted, select next available or create empty
    if (this.state.currentGraph?.id === graphId) {
      if (updatedGraphs.length > 0) {
        await this.selectGraph(updatedGraphs[0].id);
      } else {
        // Create fresh default graph
        await this.createNewGraph('My Professional Profile', 'Default capability graph');
      }
    } else {
      this.notify();
    }

    return true;
  }

  // ============================================================================
  // LOCAL STORAGE FALLBACKS (Guarantees 100% operation offline or prior to DB migration)
  // ============================================================================

  private initLocalFallback(userId: string) {
    const rawList = localStorage.getItem(`${LOCAL_STORAGE_GRAPHS_KEY}_${userId}`);
    let graphs: GraphRecord[] = [];

    if (rawList) {
      try {
        graphs = JSON.parse(rawList);
      } catch (e) {
        graphs = [];
      }
    }

    if (graphs.length === 0) {
      const defaultId = generateUUID();
      graphs = [
        {
          id: defaultId,
          user_id: userId,
          name: 'My Professional Profile',
          description: 'Core professional capability graph',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      this.saveLocalGraphsList(userId, graphs);
      this.saveLocalGraphData(defaultId, [...mockNodes], [...mockEdges]);
    }

    this.state.graphs = graphs;
    const storedActiveId = localStorage.getItem(`${LOCAL_STORAGE_ACTIVE_GRAPH_KEY}_${userId}`);
    const active = graphs.find((g) => g.id === storedActiveId) || graphs[0];
    this.state.currentGraph = active;

    const data = this.getLocalGraphData(active.id);
    this.state.nodes = data.nodes;
    this.state.edges = data.edges;
    this.notify();
  }

  private getLocalGraphData(graphId: string): { nodes: GraphNodeData[]; edges: GraphEdgeData[] } {
    const raw = localStorage.getItem(`capgraph_data_${graphId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.nodes && parsed.nodes.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fall through
      }
    }
    return { nodes: [...mockNodes], edges: [...mockEdges] };
  }

  private saveLocalGraphData(graphId: string, nodes: GraphNodeData[], edges: GraphEdgeData[]) {
    try {
      localStorage.setItem(`capgraph_data_${graphId}`, JSON.stringify({ nodes, edges }));
    } catch (e) {
      console.warn('[GraphStore] LocalStorage quota exceeded or error:', e);
    }
  }

  private saveLocalGraphsList(userId: string, graphs: GraphRecord[]) {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_GRAPHS_KEY}_${userId}`, JSON.stringify(graphs));
    } catch (e) {
      console.warn('[GraphStore] LocalStorage error saving graph list:', e);
    }
  }
}

export const graphStore = new GraphStore();

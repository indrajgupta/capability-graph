import assert from 'assert';

// Simulate the multi-graph store logic
class MockGraphStore {
  constructor() {
    this.graphsByUser = new Map(); // userId -> Map<graphId, GraphRecord>
    this.nodesByGraph = new Map();  // graphId -> Node[]
    this.edgesByGraph = new Map();  // graphId -> Edge[]
  }

  createGraph(userId, name, initialData) {
    const graphId = `graph-${Math.random().toString(36).substring(2, 9)}`;
    const graph = {
      id: graphId,
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
    };

    if (!this.graphsByUser.has(userId)) {
      this.graphsByUser.set(userId, new Map());
    }
    this.graphsByUser.get(userId).set(graphId, graph);

    // Isolated node and edge buckets
    this.nodesByGraph.set(graphId, []);
    this.edgesByGraph.set(graphId, []);

    if (initialData) {
      const idMap = new Map();
      (initialData.nodes || []).forEach(n => {
        const nodeDbId = `node-${Math.random().toString(36).substring(2, 9)}`;
        idMap.set(n.id, nodeDbId);
        idMap.set(n.name.toLowerCase(), nodeDbId);
        this.nodesByGraph.get(graphId).push({
          id: nodeDbId,
          graph_id: graphId,
          name: n.name,
          type: n.type,
        });
      });

      (initialData.relationships || []).forEach(r => {
        const s = idMap.get(r.source) || idMap.get(r.source.toLowerCase());
        const t = idMap.get(r.target) || idMap.get(r.target.toLowerCase());
        if (s && t) {
          this.edgesByGraph.get(graphId).push({
            id: `edge-${Math.random().toString(36).substring(2, 9)}`,
            graph_id: graphId,
            source: s,
            target: t,
            type: r.type,
          });
        }
      });
    }

    return graph;
  }

  addInformationToGraph(userId, graphId, data) {
    const userGraphs = this.graphsByUser.get(userId);
    if (!userGraphs || !userGraphs.has(graphId)) {
      throw new Error('Access denied: Graph does not belong to user');
    }

    const currentNodes = this.nodesByGraph.get(graphId);
    const currentEdges = this.edgesByGraph.get(graphId);

    const idMap = new Map();
    // Index existing nodes in this graph by name and type
    const nameMap = new Map();
    currentNodes.forEach(n => {
      nameMap.set(`${n.name.toLowerCase()}::${n.type.toLowerCase()}`, n);
      idMap.set(n.name.toLowerCase(), n.id);
    });

    // 1. Deduplicate nodes only within this graph
    (data.nodes || []).forEach(n => {
      const key = `${n.name.toLowerCase()}::${n.type.toLowerCase()}`;
      const existing = nameMap.get(key);
      if (existing) {
        idMap.set(n.id, existing.id);
        idMap.set(n.name.toLowerCase(), existing.id);
      } else {
        const newNodeId = `node-${Math.random().toString(36).substring(2, 9)}`;
        idMap.set(n.id, newNodeId);
        idMap.set(n.name.toLowerCase(), newNodeId);
        const nodeObj = {
          id: newNodeId,
          graph_id: graphId,
          name: n.name,
          type: n.type,
        };
        currentNodes.push(nodeObj);
        nameMap.set(key, nodeObj);
      }
    });

    // 2. Deduplicate edges only within this graph
    (data.relationships || []).forEach(r => {
      const s = idMap.get(r.source) || idMap.get(r.source.toLowerCase());
      const t = idMap.get(r.target) || idMap.get(r.target.toLowerCase());
      if (s && t) {
        const exists = currentEdges.some(e => e.source === s && e.target === t && e.type === r.type);
        if (!exists) {
          currentEdges.push({
            id: `edge-${Math.random().toString(36).substring(2, 9)}`,
            graph_id: graphId,
            source: s,
            target: t,
            type: r.type,
          });
        }
      }
    });
  }

  getGraphData(userId, graphId) {
    const userGraphs = this.graphsByUser.get(userId);
    if (!userGraphs || !userGraphs.has(graphId)) {
      throw new Error('Access denied: Graph does not belong to user');
    }
    return {
      graph: userGraphs.get(graphId),
      nodes: this.nodesByGraph.get(graphId),
      edges: this.edgesByGraph.get(graphId),
    };
  }
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');
  const store = new MockGraphStore();
  const USER_1 = 'user-1111';
  const USER_2 = 'user-2222';

  // -------------------------------------------------------------------------
  // TEST A: CREATE TWO GRAPHS
  // -------------------------------------------------------------------------
  console.log('\n[TEST A] Creating two independent graphs...');
  const g1 = store.createGraph(USER_1, 'My Professional Profile', {
    nodes: [
      { id: '1', name: 'React', type: 'technology' },
      { id: '2', name: 'Supabase', type: 'technology' },
      { id: '3', name: 'Vite', type: 'technology' },
      { id: '4', name: 'FarmSeva', type: 'project' },
    ],
    relationships: [
      { source: 'FarmSeva', target: 'React', type: 'USES_TECHNOLOGY' },
      { source: 'FarmSeva', target: 'Supabase', type: 'USES_TECHNOLOGY' },
      { source: 'FarmSeva', target: 'Vite', type: 'USES_TECHNOLOGY' },
    ],
  });

  const g2 = store.createGraph(USER_1, 'SmartCampus Project', {
    nodes: [
      { id: '1', name: 'Python', type: 'technology' },
      { id: '2', name: 'FastAPI', type: 'technology' },
      { id: '3', name: 'PostgreSQL', type: 'technology' },
      { id: '4', name: 'SmartCampus', type: 'project' },
    ],
    relationships: [
      { source: 'SmartCampus', target: 'Python', type: 'USES_TECHNOLOGY' },
      { source: 'SmartCampus', target: 'FastAPI', type: 'USES_TECHNOLOGY' },
      { source: 'SmartCampus', target: 'PostgreSQL', type: 'USES_TECHNOLOGY' },
    ],
  });

  const data1 = store.getGraphData(USER_1, g1.id);
  const data2 = store.getGraphData(USER_1, g2.id);

  const g1NodeNames = data1.nodes.map(n => n.name);
  const g2NodeNames = data2.nodes.map(n => n.name);

  console.log('Graph 1 nodes:', g1NodeNames);
  console.log('Graph 2 nodes:', g2NodeNames);

  assert.ok(g1NodeNames.includes('React'), 'G1 must include React');
  assert.ok(g1NodeNames.includes('FarmSeva'), 'G1 must include FarmSeva');
  assert.ok(!g1NodeNames.includes('SmartCampus'), 'G1 must NOT contain SmartCampus');
  assert.ok(!g1NodeNames.includes('FastAPI'), 'G1 must NOT contain FastAPI');

  assert.ok(g2NodeNames.includes('SmartCampus'), 'G2 must include SmartCampus');
  assert.ok(!g2NodeNames.includes('FarmSeva'), 'G2 must NOT contain FarmSeva');
  console.log('✓ TEST A PASSED: Two graphs are completely isolated');

  // -------------------------------------------------------------------------
  // TEST B: ADD INFORMATION TO GRAPH 1
  // -------------------------------------------------------------------------
  console.log('\n[TEST B] Adding information to Graph 1...');
  store.addInformationToGraph(USER_1, g1.id, {
    nodes: [
      { id: 'n_py', name: 'Python', type: 'technology' },
      { id: 'n_fs', name: 'FarmSeva', type: 'project' },
    ],
    relationships: [
      { source: 'FarmSeva', target: 'Python', type: 'USES_TECHNOLOGY' },
    ],
  });

  const data1Updated = store.getGraphData(USER_1, g1.id);
  const data2Untouched = store.getGraphData(USER_1, g2.id);

  const g1UpdatedNames = data1Updated.nodes.map(n => n.name);
  console.log('Graph 1 nodes after addition:', g1UpdatedNames);
  assert.ok(g1UpdatedNames.includes('Python'), 'Graph 1 now includes Python');
  // Deduplication check: FarmSeva should appear exactly ONCE
  const farmSevaCount = data1Updated.nodes.filter(n => n.name.toLowerCase() === 'farmseva').length;
  assert.strictEqual(farmSevaCount, 1, 'FarmSeva was not duplicated in Graph 1');

  // Graph 2 remains unchanged
  assert.deepStrictEqual(data2Untouched.nodes.map(n => n.name), g2NodeNames, 'Graph 2 remained completely untouched');
  console.log('✓ TEST B PASSED: Added info only merged into Graph 1, no duplicate FarmSeva, Graph 2 untouched');

  // -------------------------------------------------------------------------
  // TEST C: SAME TECHNOLOGY IN DIFFERENT GRAPHS
  // -------------------------------------------------------------------------
  console.log('\n[TEST C] Verifying independent node identities for same tech (Python)...');
  const pythonG1 = data1Updated.nodes.find(n => n.name === 'Python');
  const pythonG2 = data2Untouched.nodes.find(n => n.name === 'Python');

  console.log(`Python in Graph 1 ID: ${pythonG1.id} (graph_id: ${pythonG1.graph_id})`);
  console.log(`Python in Graph 2 ID: ${pythonG2.id} (graph_id: ${pythonG2.graph_id})`);

  assert.notStrictEqual(pythonG1.id, pythonG2.id, 'Python nodes must have separate IDs');
  assert.notStrictEqual(pythonG1.graph_id, pythonG2.graph_id, 'Python nodes must have separate graph_ids');
  console.log('✓ TEST C PASSED: Python exists independently in both graphs without cross-bleeding');

  // -------------------------------------------------------------------------
  // TEST D: RELOAD / RE-RETRIEVE
  // -------------------------------------------------------------------------
  console.log('\n[TEST D] Simulating reload and retrieving each graph...');
  const reloadG1 = store.getGraphData(USER_1, g1.id);
  const reloadG2 = store.getGraphData(USER_1, g2.id);
  assert.strictEqual(reloadG1.nodes.length, 5, 'Graph 1 has 5 nodes (React, Supabase, Vite, FarmSeva, Python)');
  assert.strictEqual(reloadG2.nodes.length, 4, 'Graph 2 has 4 nodes (Python, FastAPI, PostgreSQL, SmartCampus)');
  console.log('✓ TEST D PASSED: Each graph maintains its own state across reload simulation');

  // -------------------------------------------------------------------------
  // TEST E: MULTIPLE USERS & SECURITY ISOLATION
  // -------------------------------------------------------------------------
  console.log('\n[TEST E] Verifying multi-user isolation and RLS enforcement...');
  let crossUserBlocked = false;
  try {
    store.getGraphData(USER_2, g1.id);
  } catch (err) {
    crossUserBlocked = true;
  }
  assert.ok(crossUserBlocked, 'User 2 cannot read User 1 graph');

  let crossUserWriteBlocked = false;
  try {
    store.addInformationToGraph(USER_2, g1.id, {
      nodes: [{ id: 'hack', name: 'Malicious Node', type: 'technology' }],
    });
  } catch (err) {
    crossUserWriteBlocked = true;
  }
  assert.ok(crossUserWriteBlocked, 'User 2 cannot write to User 1 graph');
  console.log('✓ TEST E PASSED: Row level security prevents unauthorized access or tampering');

  console.log('\n=========================================');
  console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
}

runTests();

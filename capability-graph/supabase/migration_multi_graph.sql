-- ==============================================================================
-- CAPABILITYGRAPH: MULTI-GRAPH MIGRATION SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
--
-- This migration:
-- 1. Creates public.graphs table to allow users to maintain multiple independent graphs.
-- 2. Adds graph_id to nodes, edges, projects, and evidence tables.
-- 3. Safely backfills existing records by auto-creating a default graph per user,
--    ensuring ZERO existing data is lost or assigned to another user.
-- 4. Creates performance indexes on (user_id, graph_id).
-- 5. Configures Row Level Security (RLS) policies enforcing user and graph ownership.
-- ==============================================================================

-- 1. CREATE GRAPHS TABLE
CREATE TABLE IF NOT EXISTS public.graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on graphs
ALTER TABLE public.graphs ENABLE ROW LEVEL SECURITY;

-- Graphs RLS policies
DROP POLICY IF EXISTS "Users can view own graphs" ON public.graphs;
CREATE POLICY "Users can view own graphs"
  ON public.graphs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own graphs" ON public.graphs;
CREATE POLICY "Users can insert own graphs"
  ON public.graphs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own graphs" ON public.graphs;
CREATE POLICY "Users can update own graphs"
  ON public.graphs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own graphs" ON public.graphs;
CREATE POLICY "Users can delete own graphs"
  ON public.graphs FOR DELETE
  USING (auth.uid() = user_id);


-- 2. ADD graph_id COLUMN TO EXISTING TABLES
ALTER TABLE public.nodes
  ADD COLUMN IF NOT EXISTS graph_id UUID REFERENCES public.graphs(id) ON DELETE CASCADE;

ALTER TABLE public.edges
  ADD COLUMN IF NOT EXISTS graph_id UUID REFERENCES public.graphs(id) ON DELETE CASCADE;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS graph_id UUID REFERENCES public.graphs(id) ON DELETE CASCADE;

ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS graph_id UUID REFERENCES public.graphs(id) ON DELETE CASCADE;


-- 3. SAFE DATA PRESERVATION / BACKFILL
-- If any user has existing rows without a graph_id, create a default graph for them
-- and associate their existing records with it.
DO $$
DECLARE
  u RECORD;
  default_gid UUID;
BEGIN
  FOR u IN
    SELECT DISTINCT user_id FROM (
      SELECT user_id FROM public.nodes WHERE graph_id IS NULL AND user_id IS NOT NULL
      UNION
      SELECT user_id FROM public.edges WHERE graph_id IS NULL AND user_id IS NOT NULL
      UNION
      SELECT user_id FROM public.projects WHERE graph_id IS NULL AND user_id IS NOT NULL
      UNION
      SELECT user_id FROM public.evidence WHERE graph_id IS NULL AND user_id IS NOT NULL
    ) AS existing_records
  LOOP
    -- Look for an existing graph for this user or create a new default one
    SELECT id INTO default_gid FROM public.graphs WHERE user_id = u.user_id ORDER BY created_at ASC LIMIT 1;
    IF default_gid IS NULL THEN
      INSERT INTO public.graphs (user_id, name, description)
      VALUES (u.user_id, 'My Professional Profile', 'Default imported capability graph')
      RETURNING id INTO default_gid;
    END IF;

    -- Update orphaned records
    UPDATE public.nodes SET graph_id = default_gid WHERE user_id = u.user_id AND graph_id IS NULL;
    UPDATE public.edges SET graph_id = default_gid WHERE user_id = u.user_id AND graph_id IS NULL;
    UPDATE public.projects SET graph_id = default_gid WHERE user_id = u.user_id AND graph_id IS NULL;
    UPDATE public.evidence SET graph_id = default_gid WHERE user_id = u.user_id AND graph_id IS NULL;
  END LOOP;
END $$;


-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_graphs_user_id ON public.graphs(user_id);
CREATE INDEX IF NOT EXISTS idx_nodes_graph_id ON public.nodes(graph_id);
CREATE INDEX IF NOT EXISTS idx_nodes_user_graph ON public.nodes(user_id, graph_id);
CREATE INDEX IF NOT EXISTS idx_edges_graph_id ON public.edges(graph_id);
CREATE INDEX IF NOT EXISTS idx_edges_user_graph ON public.edges(user_id, graph_id);
CREATE INDEX IF NOT EXISTS idx_projects_graph_id ON public.projects(graph_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_graph ON public.projects(user_id, graph_id);
CREATE INDEX IF NOT EXISTS idx_evidence_graph_id ON public.evidence(graph_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_graph ON public.evidence(user_id, graph_id);


-- 5. UPDATE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- NODES POLICIES
DROP POLICY IF EXISTS "Users can view own nodes" ON public.nodes;
CREATE POLICY "Users can view own nodes"
  ON public.nodes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own nodes" ON public.nodes;
CREATE POLICY "Users can insert own nodes"
  ON public.nodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own nodes" ON public.nodes;
CREATE POLICY "Users can update own nodes"
  ON public.nodes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own nodes" ON public.nodes;
CREATE POLICY "Users can delete own nodes"
  ON public.nodes FOR DELETE
  USING (auth.uid() = user_id);

-- EDGES POLICIES
DROP POLICY IF EXISTS "Users can view own edges" ON public.edges;
CREATE POLICY "Users can view own edges"
  ON public.edges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own edges" ON public.edges;
CREATE POLICY "Users can insert own edges"
  ON public.edges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own edges" ON public.edges;
CREATE POLICY "Users can update own edges"
  ON public.edges FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own edges" ON public.edges;
CREATE POLICY "Users can delete own edges"
  ON public.edges FOR DELETE
  USING (auth.uid() = user_id);

-- PROJECTS POLICIES
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- EVIDENCE POLICIES
DROP POLICY IF EXISTS "Users can view own evidence" ON public.evidence;
CREATE POLICY "Users can view own evidence"
  ON public.evidence FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own evidence" ON public.evidence;
CREATE POLICY "Users can insert own evidence"
  ON public.evidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own evidence" ON public.evidence;
CREATE POLICY "Users can update own evidence"
  ON public.evidence FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own evidence" ON public.evidence;
CREATE POLICY "Users can delete own evidence"
  ON public.evidence FOR DELETE
  USING (auth.uid() = user_id);

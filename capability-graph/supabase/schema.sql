-- Supabase Schema for CapabilityGraph
-- Run this in your Supabase SQL Editor to set up tables with Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'User',
  headline TEXT DEFAULT 'Engineer',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Graph Nodes Table
CREATE TABLE IF NOT EXISTS public.graph_nodes (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  evidence_status TEXT DEFAULT 'claimed',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- Enable RLS for graph_nodes
ALTER TABLE public.graph_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own graph nodes"
  ON public.graph_nodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own graph nodes"
  ON public.graph_nodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own graph nodes"
  ON public.graph_nodes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own graph nodes"
  ON public.graph_nodes FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Graph Edges / Relationships Table
CREATE TABLE IF NOT EXISTS public.graph_edges (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL,
  label TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- Enable RLS for graph_edges
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own graph edges"
  ON public.graph_edges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own graph edges"
  ON public.graph_edges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own graph edges"
  ON public.graph_edges FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Evidence Table
CREATE TABLE IF NOT EXISTS public.evidence (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT DEFAULT '',
  node_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

-- Enable RLS for evidence
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own evidence"
  ON public.evidence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evidence"
  ON public.evidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

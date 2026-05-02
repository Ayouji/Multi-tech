-- ============================================================
-- Multi-tech App — Supabase Schema
-- Exécutez ce script dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Table: clients
CREATE TABLE IF NOT EXISTS public.clients (
  id            BIGSERIAL PRIMARY KEY,
  nom           TEXT        NOT NULL,
  ville         TEXT        NOT NULL DEFAULT '',
  type_client   TEXT        NOT NULL DEFAULT 'mon_client',
  email         TEXT,
  telephone     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id            BIGSERIAL PRIMARY KEY,
  client_id     BIGINT      REFERENCES public.clients(id) ON DELETE SET NULL,
  client_nom    TEXT,
  type          TEXT        NOT NULL DEFAULT 'intervention',
  importance    TEXT        NOT NULL DEFAULT 'urgent_important',
  duree         NUMERIC     DEFAULT 0,
  date_fixee    TIMESTAMPTZ,
  description   TEXT,
  statut        TEXT        NOT NULL DEFAULT 'pending',
  task_libre    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: tracking
CREATE TABLE IF NOT EXISTS public.tracking (
  id            BIGSERIAL PRIMARY KEY,
  task_id       BIGINT      REFERENCES public.tasks(id) ON DELETE CASCADE,
  temps_estime  NUMERIC     DEFAULT 0,
  temps_reel    NUMERIC     DEFAULT 0,
  contraintes   TEXT,
  images        JSONB       DEFAULT '[]',
  date          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  date          TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.clients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Policies: allow all for now (simplify for local dev)
CREATE POLICY "allow_all_clients"   ON public.clients   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tasks"     ON public.tasks     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tracking"  ON public.tracking  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);

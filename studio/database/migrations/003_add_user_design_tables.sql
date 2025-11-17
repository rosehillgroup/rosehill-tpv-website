-- Migration: Add user accounts and design management tables
-- Description: Adds projects and saved_designs tables, plus user_id tracking on jobs
-- Date: 2025-01-17
-- Author: TPV Studio

-- ============================================================================
-- PART 1: Add user_id to existing studio_jobs table
-- ============================================================================

-- Add user_id column to track which user created each job
ALTER TABLE studio_jobs
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for user job queries
CREATE INDEX IF NOT EXISTS idx_studio_jobs_user_id ON studio_jobs(user_id);

-- Add comment
COMMENT ON COLUMN studio_jobs.user_id IS 'User who created this generation job (NULL for legacy jobs)';


-- ============================================================================
-- PART 2: Create projects table for organizing designs
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User ownership
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Project metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#1a365d', -- Hex color for project badge/UI

  -- Denormalized stats (for performance)
  design_count INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

-- Comments
COMMENT ON TABLE projects IS 'User-created projects for organizing saved designs';
COMMENT ON COLUMN projects.user_id IS 'Owner of this project';
COMMENT ON COLUMN projects.name IS 'Project name (e.g., "Playground A", "School XYZ")';
COMMENT ON COLUMN projects.color IS 'Hex color for project badge in UI';
COMMENT ON COLUMN projects.design_count IS 'Cached count of designs in this project';


-- ============================================================================
-- PART 3: Create saved_designs table for storing user designs
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_designs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership and organization
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  job_id UUID REFERENCES studio_jobs(id) ON DELETE SET NULL,

  -- Design metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Input data (how the design was created)
  input_mode VARCHAR(50) NOT NULL, -- 'prompt', 'image', 'svg'
  prompt TEXT,
  uploaded_file_url TEXT,
  dimensions JSONB NOT NULL, -- { widthMM: number, lengthMM: number }

  -- Generated outputs from AI
  original_svg_url TEXT NOT NULL,
  original_png_url TEXT,
  thumbnail_url TEXT,

  -- Color recipes (JSONB for flexibility)
  blend_recipes JSONB, -- Array of blend recipe objects
  solid_recipes JSONB, -- Array of solid recipe objects
  color_mapping JSONB, -- Map of original hex -> blend hex
  solid_color_mapping JSONB, -- Map of original hex -> solid hex

  -- User color edits (separate Maps for blend/solid modes)
  solid_color_edits JSONB DEFAULT '{}'::jsonb, -- Map of originalHex -> {newHex}
  blend_color_edits JSONB DEFAULT '{}'::jsonb, -- Map of originalHex -> {newHex}

  -- Final recolored outputs
  final_blend_svg_url TEXT,
  final_solid_svg_url TEXT,
  preferred_view_mode VARCHAR(20) DEFAULT 'solid', -- 'solid' or 'blend'

  -- Aspect ratio info
  aspect_ratio_mapping JSONB, -- full, framing, or tiling layout info

  -- Sharing (for future Phase 3)
  share_code VARCHAR(12) UNIQUE,
  is_public BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_opened_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_designs_user_id ON saved_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_project_id ON saved_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_job_id ON saved_designs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_created_at ON saved_designs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_designs_updated_at ON saved_designs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_designs_share_code ON saved_designs(share_code) WHERE share_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_designs_tags ON saved_designs USING GIN(tags);

-- Comments
COMMENT ON TABLE saved_designs IS 'User-saved TPV designs with full state for editing/loading';
COMMENT ON COLUMN saved_designs.user_id IS 'Owner of this saved design';
COMMENT ON COLUMN saved_designs.project_id IS 'Optional project this design belongs to';
COMMENT ON COLUMN saved_designs.job_id IS 'Link to original generation job';
COMMENT ON COLUMN saved_designs.input_mode IS 'How design was created: prompt, image, or svg';
COMMENT ON COLUMN saved_designs.dimensions IS 'Surface dimensions: {widthMM, lengthMM}';
COMMENT ON COLUMN saved_designs.blend_recipes IS 'TPV blend formulas (1-2 component mixes)';
COMMENT ON COLUMN saved_designs.solid_recipes IS 'Solid TPV color matches';
COMMENT ON COLUMN saved_designs.solid_color_edits IS 'User edits in solid mode: {originalHex: {newHex}}';
COMMENT ON COLUMN saved_designs.blend_color_edits IS 'User edits in blend mode: {originalHex: {newHex}}';
COMMENT ON COLUMN saved_designs.share_code IS 'Short code for public sharing (future use)';


-- ============================================================================
-- PART 4: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only see/modify their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Saved designs: Users can see their own designs + public designs
CREATE POLICY "Users can view their own designs"
  ON saved_designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public designs"
  ON saved_designs FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert their own designs"
  ON saved_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON saved_designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
  ON saved_designs FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================================
-- PART 5: Triggers for automatic timestamp updates
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for saved_designs table
DROP TRIGGER IF EXISTS update_saved_designs_updated_at ON saved_designs;
CREATE TRIGGER update_saved_designs_updated_at
  BEFORE UPDATE ON saved_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- PART 6: Function to update project design count
-- ============================================================================

-- Function to recalculate design count for a project
CREATE OR REPLACE FUNCTION update_project_design_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for old project (if design was moved)
  IF TG_OP = 'UPDATE' AND OLD.project_id IS NOT NULL AND OLD.project_id != NEW.project_id THEN
    UPDATE projects
    SET design_count = (
      SELECT COUNT(*) FROM saved_designs WHERE project_id = OLD.project_id
    )
    WHERE id = OLD.project_id;
  END IF;

  -- Update count for project being removed from (on DELETE)
  IF TG_OP = 'DELETE' AND OLD.project_id IS NOT NULL THEN
    UPDATE projects
    SET design_count = (
      SELECT COUNT(*) FROM saved_designs WHERE project_id = OLD.project_id
    )
    WHERE id = OLD.project_id;
  END IF;

  -- Update count for new/current project
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.project_id IS NOT NULL THEN
    UPDATE projects
    SET design_count = (
      SELECT COUNT(*) FROM saved_designs WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update project design counts
DROP TRIGGER IF EXISTS update_project_count_on_design_change ON saved_designs;
CREATE TRIGGER update_project_count_on_design_change
  AFTER INSERT OR UPDATE OF project_id OR DELETE ON saved_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_project_design_count();


-- ============================================================================
-- Migration complete!
-- ============================================================================

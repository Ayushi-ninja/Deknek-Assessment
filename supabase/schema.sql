-- ============================================================
-- DEKNEK 3D MARKETPLACE — SUPABASE SCHEMA
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users (custom name-based auth, not auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read users (needed for login lookup)
CREATE POLICY "Allow public read on users"
  ON users FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert new users (self-registration)
CREATE POLICY "Allow public insert on users"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

-- ============================================================
-- TABLE: models
-- ============================================================
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  model_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read models (public catalog)
CREATE POLICY "Allow public read access on models"
  ON models FOR SELECT
  TO public
  USING (true);

-- Allow only admins to insert models
CREATE POLICY "Allow admins to insert models"
  ON models FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow only admins to update models
CREATE POLICY "Allow admins to update models"
  ON models FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow only admins to delete models
CREATE POLICY "Allow admins to delete models"
  ON models FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================
-- TABLE: custom_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  budget NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_name ON custom_requests(user_name);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);

-- Enable RLS
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all requests (public catalog pattern)
CREATE POLICY "Allow public read on custom_requests"
  ON custom_requests FOR SELECT
  TO public
  USING (true);

-- Allow anyone to submit a custom request
CREATE POLICY "Allow public insert on custom_requests"
  ON custom_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- ============================================================
-- FUNCTION + TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_requests_updated_at
  BEFORE UPDATE ON custom_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: Insert sample models to verify connection works
-- Uncomment and run to populate the catalog for testing
-- ============================================================
/*
INSERT INTO models (name, description, price, category, model_url, thumbnail_url) VALUES
  ('Cyber Helmet', 'High-fidelity sci-fi helmet asset with PBR textures.', 29.99, 'Wearables', 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/sci-fi-helmet/model.gltf', NULL),
  ('Neon Sphere', 'Animated neon energy sphere for game environments.', 14.99, 'Props', 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/neon-sphere/model.gltf', NULL),
  ('Mech Suit', 'Full-body mech suit with articulated joints.', 89.99, 'Characters', 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/mech-suit/model.gltf', NULL);
*/

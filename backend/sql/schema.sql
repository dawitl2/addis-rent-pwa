CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  preferred_area TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (lower(username));

CREATE TABLE IF NOT EXISTS agents (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  specialty TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  deals INTEGER NOT NULL DEFAULT 0 CHECK (deals >= 0),
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  bio TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  property_type TEXT NOT NULL,
  intent TEXT NOT NULL CHECK (intent IN ('Buy', 'Rent')),
  price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  rooms INTEGER NOT NULL CHECK (rooms >= 0),
  size_sqm INTEGER NOT NULL CHECK (size_sqm >= 0),
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold')),
  owner_kind TEXT NOT NULL DEFAULT 'demo' CHECK (owner_kind IN ('demo', 'user')),
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
  listed_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_images (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT REFERENCES properties(id) ON DELETE SET NULL,
  agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_intent ON properties(intent);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent_id ON inquiries(agent_id);

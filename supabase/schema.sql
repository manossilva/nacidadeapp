-- ============================================================
-- Aju Guide — Schema do banco (Supabase / PostgreSQL)
-- Rodar no SQL Editor do Supabase: https://supabase.com/dashboard
-- ============================================================

-- Extensão para cálculo de distância geográfica
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;

-- ============================================================
-- PLACES — locais (bares, restaurantes, pontos turísticos)
-- ============================================================
CREATE TABLE places (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  category              TEXT NOT NULL,
  -- valores: 'gastronomia', 'praia', 'cultura', 'festa', 'passeio', 'hospedagem'
  description           TEXT,
  short_description     TEXT,       -- máx 140 chars, usado nos cards
  address               TEXT,
  neighborhood          TEXT,
  latitude              NUMERIC(10, 7),
  longitude             NUMERIC(10, 7),
  cover_image_url       TEXT,
  gallery_urls          TEXT[],
  whatsapp              TEXT,        -- formato: +5579...
  instagram             TEXT,
  website               TEXT,
  opening_hours         JSONB,       -- { "mon": "10:00-22:00", "sat": "fechado", ... }
  price_range           TEXT,        -- '$', '$$', '$$$'
  tags                  TEXT[],      -- ['família', 'vista do mar', 'ao vivo']
  plan_tier             TEXT DEFAULT 'free',  -- 'free', 'basic', 'pro', 'destaque'
  is_published          BOOLEAN DEFAULT false,
  is_featured           BOOLEAN DEFAULT false,
  view_count            INT DEFAULT 0,
  whatsapp_click_count  INT DEFAULT 0,
  share_count           INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_places_category  ON places(category);
CREATE INDEX idx_places_published ON places(is_published);
CREATE INDEX idx_places_featured  ON places(is_featured);
CREATE INDEX idx_places_location  ON places USING gist (
  ll_to_earth(latitude, longitude)
);

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- EVENTS — eventos com data
-- ============================================================
CREATE TABLE events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  category              TEXT NOT NULL,
  -- valores: 'show', 'festival', 'gastronômico', 'cultural', 'esportivo', 'outro'
  description           TEXT,
  short_description     TEXT,
  place_id              UUID REFERENCES places(id) ON DELETE SET NULL,
  custom_location       TEXT,
  latitude              NUMERIC(10, 7),
  longitude             NUMERIC(10, 7),
  cover_image_url       TEXT,
  starts_at             TIMESTAMPTZ NOT NULL,
  ends_at               TIMESTAMPTZ,
  ticket_url            TEXT,
  price_info            TEXT,       -- 'Gratuito', 'R$ 30', 'R$ 30-80'
  organizer_name        TEXT,
  organizer_whatsapp    TEXT,
  plan_tier             TEXT DEFAULT 'free',
  is_published          BOOLEAN DEFAULT false,
  is_featured           BOOLEAN DEFAULT false,
  view_count            INT DEFAULT 0,
  whatsapp_click_count  INT DEFAULT 0,
  share_count           INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_category  ON events(category);
CREATE INDEX idx_events_published ON events(is_published);

-- ============================================================
-- ADVERTISERS — anunciantes pagantes
-- ============================================================
CREATE TABLE advertisers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name    TEXT NOT NULL,
  contact_name     TEXT,
  cnpj             TEXT,
  whatsapp         TEXT,
  email            TEXT,
  plan             TEXT NOT NULL,  -- 'basic', 'pro', 'destaque'
  monthly_fee      NUMERIC(10, 2),
  contract_start   DATE,
  contract_end     DATE,
  payment_status   TEXT DEFAULT 'pending',  -- 'paid', 'pending', 'overdue'
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ADVERTISER_ASSETS — ligação anunciante ↔ locais/eventos
-- ============================================================
CREATE TABLE advertiser_assets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id  UUID REFERENCES advertisers(id) ON DELETE CASCADE,
  place_id       UUID REFERENCES places(id) ON DELETE CASCADE,
  event_id       UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INTERACTIONS — analytics de cliques (sem dados pessoais sensíveis)
-- ============================================================
CREATE TABLE interactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id          UUID REFERENCES places(id) ON DELETE CASCADE,
  event_id          UUID REFERENCES events(id) ON DELETE CASCADE,
  interaction_type  TEXT NOT NULL,  -- 'view', 'whatsapp_click', 'share', 'maps_click'
  user_agent        TEXT,
  referrer          TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_interactions_place  ON interactions(place_id);
CREATE INDEX idx_interactions_event  ON interactions(event_id);
CREATE INDEX idx_interactions_type   ON interactions(interaction_type);
CREATE INDEX idx_interactions_date   ON interactions(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Substitua o email abaixo pelo seu antes de rodar em produção
-- ============================================================

-- PLACES
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_places"
  ON places FOR SELECT
  USING (is_published = true);

CREATE POLICY "admin_full_places"
  ON places FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_events"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "admin_full_events"
  ON events FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ADVERTISERS (só admin lê e escreve)
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_advertisers"
  ON advertisers FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ADVERTISER_ASSETS
ALTER TABLE advertiser_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_assets"
  ON advertiser_assets FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- INTERACTIONS: público insere (rastreio), só admin lê
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_interactions"
  ON interactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_read_interactions"
  ON interactions FOR SELECT
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ============================================================
-- CONFIGURAR O EMAIL DO ADMIN
-- Rode este comando após criar o schema, substituindo pelo seu email:
-- ============================================================
-- ALTER DATABASE postgres SET app.admin_email = 'seu@email.com';

-- ============================================================
-- SUPABASE STORAGE — criar bucket 'images'
-- Faça via dashboard: Storage > New bucket > "images" > Public
-- ============================================================

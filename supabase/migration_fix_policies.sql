-- ============================================================
-- CORRIGE as políticas admin de places, events, advertisers,
-- advertiser_assets e interactions substituindo current_setting
-- pelo e-mail hardcoded (necessário no Supabase shared infra)
-- ============================================================

-- PLACES
DROP POLICY IF EXISTS "admin_full_places" ON places;
CREATE POLICY "admin_full_places"
  ON places FOR ALL
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');

-- EVENTS
DROP POLICY IF EXISTS "admin_full_events" ON events;
CREATE POLICY "admin_full_events"
  ON events FOR ALL
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');

-- ADVERTISERS
DROP POLICY IF EXISTS "admin_full_advertisers" ON advertisers;
CREATE POLICY "admin_full_advertisers"
  ON advertisers FOR ALL
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');

-- ADVERTISER_ASSETS
DROP POLICY IF EXISTS "admin_full_assets" ON advertiser_assets;
CREATE POLICY "admin_full_assets"
  ON advertiser_assets FOR ALL
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');

-- INTERACTIONS
DROP POLICY IF EXISTS "admin_read_interactions" ON interactions;
CREATE POLICY "admin_read_interactions"
  ON interactions FOR SELECT
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');

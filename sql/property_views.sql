-- =====================================================
-- PROPERTY VIEWS TRACKING SYSTEM
-- =====================================================

-- 1. TABLE
CREATE TABLE IF NOT EXISTS property_views (
  id BIGSERIAL PRIMARY KEY,

  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,

  view_count INTEGER NOT NULL DEFAULT 1,

  first_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT property_views_unique UNIQUE (guest_id, property_id)
);

-- =====================================================
-- 2. INDEXES (for performance)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_property_views_guest
ON property_views(guest_id);

CREATE INDEX IF NOT EXISTS idx_property_views_property
ON property_views(property_id);

-- =====================================================
-- 3. FUNCTION TO INCREMENT PROPERTY VIEW
-- =====================================================

CREATE OR REPLACE FUNCTION increment_property_view(
  p_guest_id UUID,
  p_property_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN

  INSERT INTO property_views (guest_id, property_id)
  VALUES (p_guest_id, p_property_id)

  ON CONFLICT (guest_id, property_id)
  DO UPDATE
  SET
    view_count = property_views.view_count + 1,
    last_viewed_at = now();

END;
$$;

-- =====================================================
-- 4. OPTIONAL: PERMISSIONS (useful for Supabase)
-- =====================================================

GRANT EXECUTE ON FUNCTION increment_property_view(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_property_view(UUID, UUID) TO authenticated;

-- =====================================================
-- END
-- =====================================================

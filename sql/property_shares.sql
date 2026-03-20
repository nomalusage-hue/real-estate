-- Table to track property shares (without user_id)
CREATE TABLE IF NOT EXISTS property_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  share_type TEXT NOT NULL, -- 'facebook', 'twitter', 'whatsapp', 'copy'
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_shares_property ON property_shares(property_id);
CREATE INDEX IF NOT EXISTS idx_property_shares_shared_at ON property_shares(shared_at);
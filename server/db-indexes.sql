
-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_zip_code ON audits(zip_code);
CREATE INDEX IF NOT EXISTS idx_audits_stripe_payment_id ON audits(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at);
CREATE INDEX IF NOT EXISTS idx_audits_completed ON audits(completed);
CREATE INDEX IF NOT EXISTS idx_audits_primary_hazard ON audits(primary_hazard);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audits_zip_payment ON audits(zip_code, stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_audits_completed_created ON audits(completed, created_at);

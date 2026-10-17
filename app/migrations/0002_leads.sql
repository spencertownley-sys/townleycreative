-- Leads from the quote form and the free brand audit (PRD tab 4, "one inbox,
-- one tag"). Additive only: this is the live database.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,          -- 'quote' | 'audit'
  tag TEXT NOT NULL,           -- 'TC-quote' | 'TC-audit'
  email TEXT NOT NULL,
  name TEXT,
  business TEXT,
  segment TEXT,
  services TEXT,
  tier TEXT,
  bundle TEXT,
  budget TEXT,
  timeline TEXT,
  link TEXT,
  brief TEXT,
  phone TEXT,
  source TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_ip_recent ON leads (ip_hash, created_at);

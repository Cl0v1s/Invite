CREATE TABLE IF NOT EXISTS "response" (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  friend VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  value TEXT
);

CREATE TABLE IF NOT EXISTS "event" (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  intro TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  datetime TIMESTAMP NOT NULL,
  outro TEXT NOT NULL
)
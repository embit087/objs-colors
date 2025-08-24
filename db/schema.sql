-- Simple Key-Value Store Schema for SQLite
-- This schema provides a basic but efficient key-value storage system

-- Main key-value table
CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index on created_at for time-based queries (optional but usefulcls)
CREATE INDEX IF NOT EXISTS idx_kv_created_at ON kv_store(created_at);

-- Index on updated_at for finding recently modified entries
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON kv_store(updated_at);

-- Trigger to automatically update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_kv_timestamp 
    AFTER UPDATE ON kv_store
BEGIN
    UPDATE kv_store SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
END;

-- Optional: Metadata table for storing schema version and configuration
CREATE TABLE IF NOT EXISTS kv_metadata (
    meta_key TEXT PRIMARY KEY NOT NULL,
    meta_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert schema version
INSERT OR REPLACE INTO kv_metadata (meta_key, meta_value) 
VALUES ('schema_version', '1.0');

-- Insert password for color features
INSERT OR REPLACE INTO kv_store (key, value) 
VALUES ('color-feature-password', 'objs123abc');

-- Example usage queries (commented out, uncomment to test):

-- -- Insert/Update a key-value pair
-- INSERT OR REPLACE INTO kv_store (key, value) VALUES ('user:123:name', 'John Doe');

-- -- Get a value by key
-- SELECT value FROM kv_store WHERE key = 'user:123:name';

-- -- Get all keys with a prefix
-- SELECT key, value FROM kv_store WHERE key LIKE 'user:123:%';

-- -- Delete a key
-- DELETE FROM kv_store WHERE key = 'user:123:name';

-- -- Get all entries ordered by creation time
-- SELECT * FROM kv_store ORDER BY created_at DESC;

-- -- Count total entries
-- SELECT COUNT(*) FROM kv_store;
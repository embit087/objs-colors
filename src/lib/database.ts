import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { ColorsConfig } from '@/types/colors';

const DB_PATH = '/Users/office/objs/objs-ui-refine/colors-matters/objs-colors/db/database.db';
const SCHEMA_PATH = '/Users/office/objs/objs-ui-refine/colors-matters/objs-colors/db/schema.sql';

// Initialize database connection
function initDatabase() {
  // Ensure db directory exists
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // Initialize schema if database is new
  if (!fs.existsSync(DB_PATH) || db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='kv_store'").get() === undefined) {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
  }

  return db;
}

class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = initDatabase();
  }

  // Get a value by key
  get(key: string): string | null {
    try {
      const stmt = this.db.prepare('SELECT value FROM kv_store WHERE key = ?');
      const result = stmt.get(key) as { value: string } | undefined;
      return result?.value || null;
    } catch (error) {
      console.error('Database get error:', error);
      return null;
    }
  }

  // Set/Update a key-value pair
  set(key: string, value: string): boolean {
    try {
      const stmt = this.db.prepare('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)');
      stmt.run(key, value);
      return true;
    } catch (error) {
      console.error('Database set error:', error);
      return false;
    }
  }

  // Delete a key
  delete(key: string): boolean {
    try {
      const stmt = this.db.prepare('DELETE FROM kv_store WHERE key = ?');
      const result = stmt.run(key);
      return result.changes > 0;
    } catch (error) {
      console.error('Database delete error:', error);
      return false;
    }
  }

  // Get all keys with a prefix
  getByPrefix(prefix: string): Record<string, string> {
    try {
      const stmt = this.db.prepare('SELECT key, value FROM kv_store WHERE key LIKE ?');
      const results = stmt.all(`${prefix}%`) as { key: string; value: string }[];
      
      const data: Record<string, string> = {};
      results.forEach(row => {
        data[row.key] = row.value;
      });
      
      return data;
    } catch (error) {
      console.error('Database getByPrefix error:', error);
      return {};
    }
  }

  // Get colors configuration
  getColorsConfig(): ColorsConfig | null {
    try {
      const value = this.get('colors-choices');
      if (!value) return null;
      return JSON.parse(value) as ColorsConfig;
    } catch (error) {
      console.error('Error parsing colors config:', error);
      return null;
    }
  }

  // Set colors configuration
  setColorsConfig(config: ColorsConfig): boolean {
    try {
      const value = JSON.stringify(config);
      return this.set('colors-choices', value);
    } catch (error) {
      console.error('Error serializing colors config:', error);
      return false;
    }
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Singleton instance
let dbInstance: DatabaseService | null = null;

export function getDatabase(): DatabaseService {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
}

export default DatabaseService;

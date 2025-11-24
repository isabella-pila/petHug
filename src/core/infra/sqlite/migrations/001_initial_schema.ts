export const migration_001 = `

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'synced'
  );

  CREATE TABLE IF NOT EXISTS pets (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    owner_id TEXT NOT NULL,
  
    sync_status TEXT NOT NULL DEFAULT 'synced',
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  
  CREATE TABLE IF NOT EXISTS sync_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL, -- ex: 'pet', 'user'
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL, -- ex: 'create', 'update', 'delete'
    payload TEXT, -- Dados em JSON do que foi alterado
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
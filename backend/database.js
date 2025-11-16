const Database = require('better-sqlite3');
const db = new Database('./snippets.db', {  });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    code TEXT,
    language TEXT,
    tags TEXT,  -- JSON string for tags array
    visibility TEXT DEFAULT 'private',
    userId INTEGER  -- Removed FOREIGN KEY constraint since users are in localStorage
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);

module.exports = db;
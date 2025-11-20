// backend/data-json-db/db.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [{ id: 1763667590765, name: 'Demo User', email: 'demo@example.com' }],
      tags: ['javascript', 'node', 'react', 'sql'],
      snippets: [{ id: 1, userId: 1763667590765, title: 'Hello JS', code: 'console.log("hi")', tags: ['javascript'] }],
      nextId: 2
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensure();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('readDb error', err);
    return { users: [], tags: [], snippets: [], nextId: 1 };
  }
}

function writeDb(obj) {
  ensure();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2));
  } catch (err) {
    console.error('writeDb error', err);
  }
}

module.exports = { readDb, writeDb };

// backend/routes/snippets.js
const express = require('express');
const router = express.Router();

// Replace this with your real DB function.
// Below is a template. If you use sqlite, better-sqlite3, or knex, plug in your query.
async function fetchSnippetsFromDb() {
  try {
    // Example placeholders:
    // const db = require('../database'); // adjust path
    // const rows = db.prepare('SELECT id, title, code, tags FROM snippets').all();
    // return rows.map(r => ({ id: r.id, title: r.title, code: r.code, tags: JSON.parse(r.tags || '[]') }));

    return []; // fallback empty array - replace with actual DB query
  } catch (err) {
    console.error('fetchSnippetsFromDb error:', err);
    throw err;
  }
}

router.get('/', async (req, res) => {
  try {
    console.log('GET /api/snippets');
    const list = await fetchSnippetsFromDb();
    if (!Array.isArray(list)) {
      console.warn('/api/snippets returned non-array, converting to []', list);
      return res.json([]);
    }
    return res.json(list);
  } catch (err) {
    console.error('Error in GET /api/snippets:', err);
    return res.status(500).json({ message: 'Server error fetching snippets' });
  }
});

module.exports = router;

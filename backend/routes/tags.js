const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const d = db.readDb();
    const tags = Array.isArray(d.tags) ? d.tags : [];
    return res.json(tags);
  } catch (err) {
    console.error('GET /api/tags error', err && (err.stack || err.message || err));
    return res.status(500).json([]);
  }
});

module.exports = router;

router.post('/', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
    const result = stmt.run(name);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: 'Tag exists or insert failed' });
  }
});

module.exports = router;
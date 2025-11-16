const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all tags
router.get('/', (req, res) => {
  const tags = db.prepare('SELECT * FROM tags').all();
  res.json(tags);
});

// Create tag
router.post('/', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
    const result = stmt.run(name);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: 'Tag exists' });
  }
});

module.exports = router;
const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM tags');
    res.json(stmt.all());
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

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
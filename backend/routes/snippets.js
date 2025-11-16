const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all snippets (public or user's, with search)
router.get('/', (req, res) => {
  const { userId, search, tag } = req.query;
  let query = "SELECT * FROM snippets WHERE visibility = 'public'";  // Fixed: single quotes
  let params = [];
  if (userId) {
    query += ' OR userId = ?';
    params.push(userId);
  }
  if (search) {
    query += ' AND (title LIKE ? OR code LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (tag) {
    query += ' AND tags LIKE ?';
    params.push(`%${tag}%`);
  }
  try {
    const snippets = db.prepare(query).all(...params);
    res.json(snippets.map(s => ({ ...s, tags: JSON.parse(s.tags || '[]') })));
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Create snippet
router.post('/', (req, res) => {
  const { title, code, language, tags, visibility, userId } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO snippets (title, code, language, tags, visibility, userId) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(title, code, language, JSON.stringify(tags), visibility, userId);
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create snippet' });
  }
});

// Update snippet
router.put('/:id', (req, res) => {
  const { title, code, language, tags, visibility } = req.body;
  try {
    db.prepare('UPDATE snippets SET title = ?, code = ?, language = ?, tags = ?, visibility = ? WHERE id = ?').run(title, code, language, JSON.stringify(tags), visibility, req.params.id);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update snippet' });
  }
});

// Delete snippet
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM snippets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

// Get single snippet
router.get('/:id', (req, res) => {
  try {
    const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(req.params.id);
    if (snippet) {
      res.json({ ...snippet, tags: JSON.parse(snippet.tags || '[]') });
    } else {
      res.status(404).json({ error: 'Snippet not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

module.exports = router;
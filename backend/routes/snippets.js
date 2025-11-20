const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
  const { userId, search, tag } = req.query;
  let query = "SELECT * FROM snippets WHERE visibility = 'public'";
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
    const stmt = db.prepare(query);
    const snippets = stmt.all(...params);
    res.json(snippets.map(s => ({ ...s, tags: JSON.parse(s.tags || '[]') })));
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

router.post('/', (req, res) => {
  const { title, code, language, tags, visibility, userId } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO snippets (title, code, language, tags, visibility, userId) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(title, code, language, JSON.stringify(tags), visibility, userId);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Insert failed' });
  }
});

router.put('/:id', (req, res) => {
  const { title, code, language, tags, visibility } = req.body;
  try {
    db.prepare('UPDATE snippets SET title = ?, code = ?, language = ?, tags = ?, visibility = ? WHERE id = ?').run(title, code, language, JSON.stringify(tags), visibility, req.params.id);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM snippets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM snippets WHERE id = ?');
    const snippet = stmt.get(req.params.id);
    if (snippet) {
      res.json({ ...snippet, tags: JSON.parse(snippet.tags || '[]') });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;
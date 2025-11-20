const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const d = db.readDb();
    const list = Array.isArray(d.snippets) ? d.snippets : [];
    return res.json(list);
  } catch (err) {
    console.error('GET /api/snippets error', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error fetching snippets' });
  }
});

router.post('/', (req, res) => {
  try {
    console.log('POST /api/snippets body:', req.body);
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const d = db.readDb();
    const newId = d.nextId || Date.now();
    const snippet = {
      id: newId,
      userId: payload.userId || null,
      title: payload.title || 'Untitled',
      code: payload.code || '',
      tags: Array.isArray(payload.tags) ? payload.tags : []
    };
    d.snippets = Array.isArray(d.snippets) ? d.snippets : [];
    d.snippets.push(snippet);
    d.nextId = newId + 1;
    d.tags = Array.isArray(d.tags) ? d.tags : [];
    snippet.tags.forEach(t => {
      if (!d.tags.includes(t)) d.tags.push(t);
    });
    db.writeDb(d);
    return res.status(201).json(snippet);
  } catch (err) {
    console.error('POST /api/snippets error', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error creating snippet', detail: err.message || String(err) });
  }
});

module.exports = router;
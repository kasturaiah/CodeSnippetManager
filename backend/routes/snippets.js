// backend/routes/snippets.js
const express = require('express');
const router = express.Router();
const db = require('../data-json-db/db');

function matches(snippet, q) {
  // simple search/filter: userId, tag, search text
  if (!q) return true;
  if (q.userId && String(snippet.userId) !== String(q.userId)) return false;
  if (q.tag) {
    if (!Array.isArray(snippet.tags) || !snippet.tags.includes(q.tag)) return false;
  }
  if (q.search) {
    const s = q.search.toLowerCase();
    const title = (snippet.title || '').toLowerCase();
    const code = (snippet.code || '').toLowerCase();
    return title.includes(s) || code.includes(s);
  }
  return true;
}

router.get('/', (req, res) => {
  try {
    const d = db.readDb();
    const all = Array.isArray(d.snippets) ? d.snippets : [];
    const q = {
      userId: req.query.userId,
      tag: req.query.tag,
      search: req.query.search
    };
    const filtered = all.filter(s => matches(s, q));
    return res.json(filtered);
  } catch (err) {
    console.error('GET /api/snippets error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error fetching snippets' });
  }
});

router.post('/', (req, res) => {
  try {
    console.log('POST /api/snippets body:', req.body);
    const payload = req.body || {};
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const d = db.readDb();
    d.snippets = Array.isArray(d.snippets) ? d.snippets : [];
    const id = d.nextId || Date.now();
    const snippet = {
      id,
      userId: payload.userId || null,
      title: payload.title || 'Untitled',
      code: payload.code || '',
      tags: Array.isArray(payload.tags) ? payload.tags : []
    };
    d.snippets.push(snippet);
    d.nextId = id + 1;
    d.tags = Array.isArray(d.tags) ? d.tags : [];
    snippet.tags.forEach(t => { if (!d.tags.includes(t)) d.tags.push(t); });
    db.writeDb(d);
    return res.status(201).json(snippet);
  } catch (err) {
    console.error('POST /api/snippets error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error creating snippet' });
  }
});

module.exports = router;

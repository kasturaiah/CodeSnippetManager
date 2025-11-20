// backend/routes/snippets.js
const express = require('express');
const router = express.Router();
const db = require('../data-json-db/db');

// helper to find index
function findIndexById(arr, id) {
  return arr.findIndex(x => String(x.id) === String(id));
}

// GET /api/snippets
router.get('/', (req, res) => {
  try {
    const d = db.readDb();
    const all = Array.isArray(d.snippets) ? d.snippets : [];
    // simple filtering already present in your codebase; keep as-is or extend
    const q = {
      userId: req.query.userId,
      tag: req.query.tag,
      search: req.query.search
    };
    const filtered = all.filter(s => {
      if (q.userId && String(s.userId) !== String(q.userId)) return false;
      if (q.tag && (!Array.isArray(s.tags) || !s.tags.includes(q.tag))) return false;
      if (q.search) {
        const stext = q.search.toLowerCase();
        return (s.title || '').toLowerCase().includes(stext) || (s.code || '').toLowerCase().includes(stext);
      }
      return true;
    });
    return res.json(filtered);
  } catch (err) {
    console.error('GET /api/snippets error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error fetching snippets' });
  }
});

// POST /api/snippets
router.post('/', (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload || typeof payload !== 'object') return res.status(400).json({ message: 'Invalid payload' });

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

// PUT /api/snippets/:id  (edit)
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    if (!payload || typeof payload !== 'object') return res.status(400).json({ message: 'Invalid payload' });

    const d = db.readDb();
    d.snippets = Array.isArray(d.snippets) ? d.snippets : [];
    const idx = findIndexById(d.snippets, id);
    if (idx === -1) return res.status(404).json({ message: 'Snippet not found' });

    // update fields (only these fields allowed)
    const s = d.snippets[idx];
    s.title = typeof payload.title === 'string' ? payload.title : s.title;
    s.code = typeof payload.code === 'string' ? payload.code : s.code;
    s.tags = Array.isArray(payload.tags) ? payload.tags : s.tags;
    // optionally update userId if provided
    if (payload.userId !== undefined) s.userId = payload.userId;

    // ensure tags list in DB contains these tags
    d.tags = Array.isArray(d.tags) ? d.tags : [];
    s.tags.forEach(t => { if (!d.tags.includes(t)) d.tags.push(t); });

    d.snippets[idx] = s;
    db.writeDb(d);
    return res.json(s);
  } catch (err) {
    console.error('PUT /api/snippets/:id error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error updating snippet' });
  }
});

// DELETE /api/snippets/:id
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const d = db.readDb();
    d.snippets = Array.isArray(d.snippets) ? d.snippets : [];
    const idx = findIndexById(d.snippets, id);
    if (idx === -1) return res.status(404).json({ message: 'Snippet not found' });

    const removed = d.snippets.splice(idx, 1)[0];
    db.writeDb(d);
    return res.json({ success: true, removed });
  } catch (err) {
    console.error('DELETE /api/snippets/:id error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error deleting snippet' });
  }
});

module.exports = router;

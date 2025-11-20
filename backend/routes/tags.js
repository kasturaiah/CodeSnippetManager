// backend/routes/tags.js
const express = require('express');
const router = express.Router();
const db = require('../data-json-db/db');

router.get('/', (req, res) => {
  try {
    const d = db.readDb();
    const tags = Array.isArray(d.tags) ? d.tags : [];
    return res.json(tags);
  } catch (err) {
    console.error('GET /api/tags error:', err && (err.stack || err.message || err));
    // return safe empty array and 500 for visibility
    return res.status(500).json({ message: 'Server error fetching tags' });
  }
});

module.exports = router;

// backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../data-json-db/db');

router.get('/profile', (req, res) => {
  try {
    const d = db.readDb();
    const user = Array.isArray(d.users) && d.users.length ? d.users[0] : null;
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('GET /api/users/profile error:', err && (err.stack || err.message || err));
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

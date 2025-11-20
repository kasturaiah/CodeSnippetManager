// backend/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// health-check
app.get('/_health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// mount API routers (will warn if missing)
try { app.use('/api/snippets', require('./routes/snippets')); } catch (e) { console.warn('snippets router not found:', e.message); }
try { app.use('/api/tags', require('./routes/tags')); } catch (e) { console.warn('tags router not found:', e.message); }
try { app.use('/api/users', require('./routes/users')); } catch (e) { console.warn('users router not found:', e.message); }

// serve frontend build if exists
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error middleware:', err && (err.stack || err.message || err));
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

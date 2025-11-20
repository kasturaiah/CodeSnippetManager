// backend/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// health
app.get('/_health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// try to mount routes (will throw warning if file missing)
function tryMount(p, mountPath) {
  try {
    const r = require(p);
    app.use(mountPath, r);
    console.log(`Mounted ${p} => ${mountPath}`);
  } catch (err) {
    console.warn(`Could not mount ${p}: ${err && err.message}`);
  }
}

tryMount('./routes/snippets', '/api/snippets');
tryMount('./routes/tags', '/api/tags');
tryMount('./routes/users', '/api/users');

// if /api not matched -> return JSON 404
app.use('/api', (req, res) => {
  console.warn(`API 404 ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'API route not found' });
});

// serve frontend build if exists
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/.*/, (req, res) => res.sendFile(path.join(frontendBuildPath, 'index.html')));
} else {
  console.log('No frontend build at', frontendBuildPath);
}

// global error logger
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err.message || err));
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
module.exports = app;

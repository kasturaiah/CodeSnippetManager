const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

try {
  app.use('/api/tags', require('./routes/tags'));
} catch (e) {
  console.warn('No tags route found:', e.message);
}

try {
  app.use('/api/snippets', require('./routes/snippets'));
} catch (e) {
  console.warn('No snippets route found:', e.message);
}

const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled error middleware:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

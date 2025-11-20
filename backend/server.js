const express = require('express');
const cors = require('cors');
const path = require('path');
const snippetsRoutes = require('./routes/snippets');
const tagsRoutes = require('./routes/tags');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/snippets', snippetsRoutes);
app.use('/api/tags', tagsRoutes);

// Production serving - MUST BE AT THE END
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

// Init DB after server starts
require('./database');

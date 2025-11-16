const express = require('express');
const cors = require('cors');
const snippetsRoutes = require('./routes/snippets');
const tagsRoutes = require('./routes/tags');
require('./database');  // Init DB

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/snippets', snippetsRoutes);
app.use('/api/tags', tagsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost${PORT}`));
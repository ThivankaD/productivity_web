
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const db = require('./db');

const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');
const todoRoutes = require('./routes/todos');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Test MySQL connection
db.getConnection()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.error('MySQL connection error:', err));

app.get('/', (req, res) => {
  res.send('Productivity Hub Backend Running (MySQL)');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

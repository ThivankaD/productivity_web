const express = require('express');
const router = express.Router();
const db = require('../db');

// Create bookmark
router.post('/', async (req, res) => {
  const { user, title, url } = req.body;
  if (!user || !title || !url) {
    return res.status(400).json({ error: 'User, title, and url required' });
  }
  try {
    const [result] = await db.query('INSERT INTO bookmarks (user_id, name, link) VALUES (?, ?, ?)', [user, title, url]);
    const [bookmark] = await db.query('SELECT * FROM bookmarks WHERE id = ?', [result.insertId]);
    res.status(201).json(bookmark[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookmarks for user
router.get('/user/:userId', async (req, res) => {
  try {
    const [bookmarks] = await db.query('SELECT * FROM bookmarks WHERE user_id = ?', [req.params.userId]);
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete bookmark
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM bookmarks WHERE id = ?', [id]);
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
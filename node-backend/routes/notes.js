const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', async (req, res) => {
  const { user, title, content } = req.body;
  console.log('POST /notes body:', req.body);

  if (!user || !title) {
    console.log('Missing user or title');
    return res.status(400).json({ error: 'User and title required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [user, title, content]
    );

    const [note] = await db.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    console.log('Inserted note:', note[0]);

    res.status(201).json(note[0]);
  } catch (err) {
    console.error('Error inserting note:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const [notes] = await db.query(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  try {
    await db.query(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
    const [updated] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM notes WHERE id = ?', [id]);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

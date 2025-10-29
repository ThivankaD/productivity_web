const express = require('express');
const router = express.Router();
const db = require('../db'); // your mysql2/promise pool

// Create todo
router.post('/', async (req, res) => {
  const { user, task, createdAt } = req.body;
  if (!user || !task || !createdAt) {
    return res.status(400).json({ error: 'User, task, and createdAt required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO todos (user_id, task, created_at) VALUES (?, ?, ?)',
      [user, task, createdAt]
    );
    const [newTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (err) {
    console.error('Error inserting todo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get todos for user
router.get('/user/:userId', async (req, res) => {
  try {
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { task, createdAt, completed } = req.body;
  try {
    await db.query(
      'UPDATE todos SET task = ?, created_at = ?, completed = ? WHERE id = ?',
      [task, createdAt, completed ?? 0, id]
    );
    const [updated] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

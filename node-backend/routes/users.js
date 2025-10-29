const express = require('express');
const router = express.Router();
const db = require('../db');

// Login user


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('DB result:', users);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const user = users[0];
    console.log('Comparing:', user.password, password);
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
  // Optionally, exclude password from response
  const { password: _, ...userData } = user;
  res.json({ success: true, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    // Insert new user
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const [user] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.params.id]);
    if (user.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
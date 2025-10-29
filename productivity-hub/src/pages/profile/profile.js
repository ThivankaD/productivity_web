
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const navigate = useNavigate();

  // Fetch user profile from backend
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUsername(data.username || '');
        setEmail(data.email || '');
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, [userId]);

  // Register or update user profile
  const handleSave = e => {
    e.preventDefault();
    fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(res => res.json())
      .then(data => {
        setUserId(data._id);
        alert('Profile updated!');
      })
      .catch(err => alert('Error updating profile!'));
  };

  const handleLogout = () => {
    alert('Logged out!');
    navigate('/login');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      // Backend delete logic can be added here
      alert('Account deleted!');
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <form className="profile-form" onSubmit={handleSave}>
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        <button type="submit">Save Changes</button>
      </form>
      <div className="profile-actions">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <button className="delete-btn" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
}

export default Profile;

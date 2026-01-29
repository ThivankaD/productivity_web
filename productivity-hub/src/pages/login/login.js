import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function LoginPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  // Login using backend API
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password required');
      return;
    }
    try {
      const res = await fetch('http://13.61.27.233:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedIn(true);
        setError('');
        // Store userId in localStorage for notes page
        if (data.user && data.user.id) {
          localStorage.setItem('userId', data.user.id);
        }
        navigate('/notes');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h1>Productivity Hub</h1>
      {!showAuth ? (
        <button className="join-btn" onClick={() => setShowAuth(true)}>
          Join Now
        </button>
      ) : (
        <div className="auth-options">
          <button onClick={() => setAuthType('login')}>Login</button>
          <button onClick={() => setAuthType('signup')}>Sign Up</button>
          {authType === 'login' && !loggedIn && (
            <div className="auth-form">
              <h2>Login</h2>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button onClick={handleLogin}>Login</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          )}
          {authType === 'login' && loggedIn && (
            <div className="auth-form">
              <h2>Welcome!</h2>
              <p>You are now logged in.</p>
            </div>
          )}
          {authType === 'signup' && (
            <div className="auth-form">
              <h2>Sign Up</h2>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button
                onClick={async () => {
                  if (!username || !email || !password) {
                    setError('All fields are required');
                    return;
                  }
                  try {
                    const res = await fetch('http://13.61.27.233:5000/api/users/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username, email, password })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setError('');
                      alert('Signup successful! You can now log in.');
                      setAuthType('login');
                    } else {
                      setError(data.error || 'Signup failed');
                    }
                  } catch (err) {
                    setError('Signup failed');
                  }
                }}
              >Sign Up</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPage;

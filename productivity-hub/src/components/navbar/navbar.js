import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';


function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><a href="/notes">Make Note & Display</a></li>
        <li><a href="/bookmark">Store Bookmarks</a></li>
        <li><a href="/todo">Add To-Do Task</a></li>
        <li><a href="/profile">Update Profile</a></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;

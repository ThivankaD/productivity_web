 

import React, { useState, useEffect } from 'react';
import './bookmark.css';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  // Get userId from localStorage after login
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetch(`http://13.61.27.233:5000/api/bookmarks/user/${userId}`)
      .then(res => res.json())
      .then(data => setBookmarks(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching bookmarks:', err));
  }, [userId]);

  const getFavicon = url => {
    try {
      const u = new URL(url);
      return `${u.origin}/favicon.ico`;
    } catch {
      return '';
    }
  };

  const handleAdd = () => {
    if (name.trim() && link.trim()) {
      fetch('http://13.61.27.233:5000/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userId,
          title: name,
          url: link,
        })
      })
        .then(res => res.json())
        .then(newBookmark => {
          setBookmarks([...bookmarks, newBookmark]);
          setName('');
          setLink('');
        })
        .catch(err => console.error('Error adding bookmark:', err));
    }
  };
   const handleDelete = id => {
    fetch(`http://13.61.27.233:5000/api/bookmarks/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        setBookmarks(bookmarks.filter(bm => bm.id !== id && bm._id !== id));
      })
      .catch(err => console.error('Error deleting bookmark:', err));
  };

  return (
    <div className="bookmark-container">
      <h2>Bookmarks</h2>
      <div className="bookmark-input">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Bookmark name..."
        />
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Paste bookmark link..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div className="bookmark-list">
        {bookmarks.map((bm, idx) => (
          <div className="bookmark-card" key={bm._id || bm.id || idx}>
            <img
              src={getFavicon(bm.url || bm.link)}
              alt="favicon"
              className="bookmark-favicon"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="bookmark-info">
              <div className="bookmark-title">{bm.title || bm.name}</div>
              <a href={bm.url || bm.link} target="_blank" rel="noopener noreferrer">{bm.url || bm.link}</a>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(bm.id || bm._id)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookmark;

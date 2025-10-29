
import React, { useEffect, useState } from 'react';
import './notes.css';

function Notes() {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [notes, setNotes] = useState([]);
  const [titleColor, setTitleColor] = useState('#4e54c8');
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null); // for popup

  // Get userId from localStorage after login
  const userId = localStorage.getItem('userId');

  // Fetch notes from backend
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/notes/user/${userId}`)
      .then(res => res.json())
      .then(data => setNotes(Array.isArray(data) ? data : []))
      .catch(err => {
        setNotes([]);
        console.error('Error fetching notes:', err);
      });
  }, [userId]);

  // Add note to backend
  const handleAdd = () => {
    if (!userId) {
      setErrorMsg('You must be logged in to add notes.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    if (title.trim() && input.trim()) {
      fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userId,
          title,
          content: input
        })
      })
        .then(res => res.json())
        .then(newNote => {
          // Add titleColor to note object (frontend only)
          setNotes([...notes, { ...newNote, titleColor }]);
          setTitle('');
          setInput('');
          setTitleColor('#4e54c8');
          setSuccessMsg('Note added!');
          setTimeout(() => setSuccessMsg(''), 2000);
        })
        .catch(err => console.error('Error adding note:', err));
    }
  };

  const handleEdit = (idx) => {
    const note = notes[idx];
  setTitle(note.title);
  setInput(note.content || note.text);
  setTitleColor(note.titleColor || '#4e54c8');
  setEditIdx(idx);
  };

  // Local update only (backend update can be added)
  const handleUpdate = async () => {
    if (editIdx !== null && title.trim() && input.trim()) {
      const noteToUpdate = notes[editIdx];
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${noteToUpdate.id || noteToUpdate._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content: input })
        });
        const updatedNote = await res.json();
        // Keep titleColor in frontend state
        const updated = [...notes];
        updated[editIdx] = { ...updatedNote, titleColor };
        setNotes(updated);
        setTitle('');
        setInput('');
        setTitleColor('#4e54c8');
        setEditIdx(null);
        setSuccessMsg('Note updated!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (err) {
        setErrorMsg('Error updating note');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  return (
    <div className="notes-container-full">
      
      <div className="notes-input">
        <h2>Notes</h2>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
        />
        <div style={{ margin: '8px 0' }}>
          <label style={{ marginRight: '8px' }}>Title Highlight Color:</label>
          <input
            type="color"
            value={titleColor}
            onChange={e => setTitleColor(e.target.value)}
            style={{ verticalAlign: 'middle' }}
          />
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a note..."
          rows={4}
          className="note-textarea"
        />
        {editIdx === null ? (
          <>
            <button onClick={handleAdd}>Add</button>
            {successMsg && <div style={{ color: 'green', marginTop: '8px' }}>{successMsg}</div>}
            {errorMsg && <div style={{ color: 'red', marginTop: '8px' }}>{errorMsg}</div>}
          </>
        ) : (
          <button onClick={handleUpdate}>Update</button>
        )}
      </div>

      <div className="notes-list-row">
        {notes.map((note, idx) => (
          <div
            className="note-card-full"
            key={note._id || idx}
            onClick={() => setSelectedNote(note)} // open popup
          >
            <div
              className="note-title-full"
              style={{ background: note.titleColor || '#4e54c8' }}
            >
              {note.title}
            </div>
            <div className="note-text-preview">
              {((note.content || note.text) && (note.content || note.text).length > 0)
                ? ((note.content || note.text).length > 60
                    ? (note.content || note.text).substring(0, 60) + '...'
                    : (note.content || note.text))
                : ''}
            </div>
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening popup
                handleEdit(idx);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-title"
            >
              {selectedNote.title}
            </div>
            <div className="modal-body">{selectedNote.content || selectedNote.text}</div>
            <button className="close-btn" onClick={() => setSelectedNote(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;

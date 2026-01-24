
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
  const [addModalOpen, setAddModalOpen] = useState(false);

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
          setAddModalOpen(false);
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
    setAddModalOpen(true);
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
        setAddModalOpen(false);
        setSuccessMsg('Note updated!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (err) {
        setErrorMsg('Error updating note');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    if (editIdx !== null) {
      const noteToDelete = notes[editIdx];
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${noteToDelete.id || noteToDelete._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(notes.filter((_, idx) => idx !== editIdx));
          setTitle('');
          setInput('');
          setTitleColor('#4e54c8');
          setEditIdx(null);
          setAddModalOpen(false);
          setSuccessMsg('Note deleted!');
          setTimeout(() => setSuccessMsg(''), 2000);
        } else {
          setErrorMsg(data.error || 'Error deleting note');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      } catch (err) {
        console.error('Error deleting note:', err);
        setErrorMsg('Error deleting note');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  return (
    <div className="notes-container-full">
      <div className="notes-header">
        <h2>Notes</h2>
        <button className="add-note-btn" onClick={() => setAddModalOpen(true)}>
          + Add Note
        </button>
      </div>
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

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

      {/* View Note Popup Modal */}
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

      {/* Add/Edit Note Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setAddModalOpen(false);
          setEditIdx(null);
          setTitle('');
          setInput('');
          setTitleColor('#4e54c8');
        }}>
          <div className="modal-content add-note-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editIdx === null ? 'Add Note' : 'Edit Note'}</h2>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note title..."
              className="add-note-input"
            />
            <div className="color-picker-section">
              <label>Title Highlight Color:</label>
              <input
                type="color"
                value={titleColor}
                onChange={e => setTitleColor(e.target.value)}
              />
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Write a note..."
              rows={6}
              className="add-note-textarea"
            />
            <div className="modal-buttons">
              <button className="add-btn" onClick={editIdx === null ? handleAdd : handleUpdate}>
                {editIdx === null ? 'Add' : 'Update'}
              </button>
              {editIdx !== null && (
                <button className="delete-btn-modal" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;

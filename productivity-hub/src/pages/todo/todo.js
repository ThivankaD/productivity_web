 


import React, { useState, useEffect } from 'react';
import './todo.css';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [created_at, setCreated_at] = useState('');
   const [editIdx, setEditIdx] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editCreated_at, setEditCreated_at] = useState('');

  // Get userId from localStorage after login
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/todos/user/${userId}`)
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching todos:', err));
  }, [userId]);

  const handleAdd = () => {
    if (task.trim() && created_at) {
      fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userId,
          task,
          createdAt: created_at,
        })
      })
        .then(res => res.json())
        .then(newTodo => {
          setTasks([...tasks, newTodo]);
          setTask('');
          setCreated_at('');
        })
        .catch(err => console.error('Error adding todo:', err));
    }
  };

    const handleEdit = idx => {
    setEditIdx(idx);
  setEditTask(tasks[idx].task);
  setEditCreated_at(tasks[idx].created_at);
  };

  const handleUpdate = async () => {
    if (editIdx !== null && editTask.trim() && editCreated_at) {
      const todoToUpdate = tasks[editIdx];
      try {
        const res = await fetch(`http://localhost:5000/api/todos/${todoToUpdate.id || todoToUpdate._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: editTask, createdAt: editCreated_at })
        });
        const updatedTodo = await res.json();
        const updated = [...tasks];
        updated[editIdx] = updatedTodo;
        setTasks(updated);
        setEditIdx(null);
        setEditTask('');
        setEditCreated_at('');
      } catch (err) {
        console.error('Error updating todo:', err);
      }
    }
  };

  const handleDelete = id => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id && t._id !== id));
      })
      .catch(err => console.error('Error deleting todo:', err));
  };
   const handleToggleCompleted = async idx => {
    const todo = tasks[idx];
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${todo.id || todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: todo.task,
          createdAt: todo.created_at,
          completed: todo.completed ? 0 : 1
        })
      });
      const updatedTodo = await res.json();
      const updated = [...tasks];
      updated[idx] = updatedTodo;
      setTasks(updated);
    } catch (err) {
      console.error('Error toggling completed:', err);
    }
  };
 

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>📝 To-Do List</h2>
        <span className="todo-count">{tasks.filter(t => !t.completed).length} pending</span>
      </div>
      
      <div className="todo-input-card">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="What needs to be done?"
          className="task-input"
        />
        <div className="input-actions">
          <input
            type="date"
            value={created_at}
            onChange={e => setCreated_at(e.target.value)}
            className="date-input"
          />
          <button onClick={handleAdd} className="add-btn">+ Add Task</button>
        </div>
      </div>

      <div className="todo-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>🎯 No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          tasks.map((item, idx) => (
            <div key={item.id || item._id || idx} className={`todo-item ${item.completed ? 'completed' : ''}`}>
              {editIdx === idx ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTask}
                    onChange={e => setEditTask(e.target.value)}
                    className="edit-input"
                    placeholder="Task name"
                  />
                  <input
                    type="date"
                    value={editCreated_at}
                    onChange={e => setEditCreated_at(e.target.value)}
                    className="edit-date"
                  />
                  <div className="edit-actions">
                    <button onClick={handleUpdate} className="save-btn">✓ Save</button>
                    <button onClick={() => setEditIdx(null)} className="cancel-btn">✕ Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <button 
                      onClick={() => handleToggleCompleted(idx)} 
                      className="checkbox-btn"
                      title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {item.completed ? '✓' : '○'}
                    </button>
                    <div className="task-details">
                      <span className="task-name">{item.task}</span>
                      <span className="task-date">📅 {item.created_at}</span>
                    </div>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => handleEdit(idx)} className="edit-btn" title="Edit task">✏️</button>
                    <button onClick={() => handleDelete(item.id || item._id)} className="delete-btn" title="Delete task">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Todo;

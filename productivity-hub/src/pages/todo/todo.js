 


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
      <h2>To-Do List</h2>
      <div className="todo-input">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Enter task..."
        />
        <input
          type="date"
          value={created_at}
          onChange={e => setCreated_at(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map((item, idx) => (
          <li key={item.id || item._id || idx}>
            {editIdx === idx ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={e => setEditTask(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <input
                  type="date"
                  value={editCreated_at}
                  onChange={e => setEditCreated_at(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <button onClick={handleUpdate} style={{ marginRight: '8px' }}>Save</button>
                <button onClick={() => setEditIdx(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.task}</span>
                <span className="todo-date">{item.created_at}</span>
                <button onClick={() => handleToggleCompleted(idx)} style={{ marginLeft: '8px', color: item.completed ? 'green' : 'gray' }}>
                  {item.completed ? 'Completed' : 'Mark Completed'}
                </button>
                <button onClick={() => handleEdit(idx)} style={{ marginLeft: '8px' }}>Edit</button>
                <button onClick={() => handleDelete(item.id || item._id)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;

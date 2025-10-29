
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Notes from './pages/notes/notes';
import Bookmark from './pages/bookmark/bookmark';
import Todo from './pages/todo/todo';
import Profile from './pages/profile/profile';
import LoginPage from './pages/login/login';
import './App.css';

function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

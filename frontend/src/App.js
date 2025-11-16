import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateSnippet from './pages/CreateSnippet';
import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [snippets, setSnippets] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSnippets();
      fetchTags();
    }
  }, [user]);

  const fetchSnippets = async (search = '', tag = '') => {
    const params = new URLSearchParams({ userId: user?.id || '', search, tag });
    const res = await fetch(`/api/snippets?${params}`);
    const data = await res.json();
    setSnippets(data);
  };
  const fetchTags = async () => {
    const res = await fetch('/api/tags');
    const data = await res.json();
    setTags(data);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchSnippets();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <Router>
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={user ? <Home snippets={snippets} tags={tags} onSearch={fetchSnippets} onUpdate={fetchSnippets} user={user} /> : <Navigate to="/login" />} />
            <Route path="/create" element={user ? <CreateSnippet onCreate={() => { fetchSnippets(); }} user={user} /> : <Navigate to="/login" />} />  // Force refresh after create
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
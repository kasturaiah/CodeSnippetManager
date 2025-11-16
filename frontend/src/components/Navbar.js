import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>SnippetManager</Link>
        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/create" onClick={() => setIsOpen(false)}>Create</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
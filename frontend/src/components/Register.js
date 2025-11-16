import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === form.email)) {
      alert('Email already exists');
    } else {
      const newUser = { id: Date.now(), ...form };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onRegister(newUser);
      navigate('/');
    } 
    };  

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <form onSubmit={handleSubmit} className="card" style={{ width: '400px' }}>
            <h2 style={{ textAlign: 'center', color: '#4ecdc4' }}>Register</h2>
        <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="form-input" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-input" required />
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
    </div>
  );
};

export default Register;

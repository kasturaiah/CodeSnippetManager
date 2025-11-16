import React, { useState } from 'react';

const SnippetForm = ({ onCreate, user }) => {
  const [form, setForm] = useState({ title: '', code: '', language: 'javascript', tags: [], visibility: 'private' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a snippet.');
      return;
    }
    setLoading(true);
    try {
      console.log('Creating snippet for userId:', user.id);  // Debug
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: parseInt(user.id) })  // Ensure number
      });
      if (res.ok) {
        alert('Snippet created successfully!');
        onCreate();
        setForm({ title: '', code: '', language: 'javascript', tags: [], visibility: 'private' });
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to create snippet'}`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ color: '#ff9a9e' }}>Create Snippet</h3>
      <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required />
      <textarea placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="form-input" style={{ height: '120px' }} required />
      <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="form-input">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <input type="text" placeholder="Tags (comma-separated)" onChange={(e) => setForm({ ...form, tags: e.target.value.split(',') })} className="form-input" />
      <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="form-input">
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default SnippetForm;
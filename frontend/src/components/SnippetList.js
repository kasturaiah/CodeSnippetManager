// frontend/src/components/SnippetList.js
import React, { useEffect, useState } from 'react';

export default function SnippetList() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/snippets');
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }
      const data = await res.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching /api/snippets', err);
      setError('Failed to load snippets');
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function deleteSnippet(id) {
    if (!window.confirm('Delete this snippet?')) return;
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }
      await res.json(); // consumes response
      // update local list
      setSnippets(prev => prev.filter(s => String(s.id) !== String(id)));
    } catch (err) {
      console.error('Error deleting snippet', err);
      alert('Failed to delete snippet');
    }
  }

  async function editSnippet(snippet) {
    // simple prompt-based edit (title, code, tags)
    const newTitle = window.prompt('Edit title', snippet.title || '');
    if (newTitle === null) return; // cancel
    const newCode = window.prompt('Edit code', snippet.code || '');
    if (newCode === null) return;
    const newTagsRaw = window.prompt('Edit tags (comma separated)', Array.isArray(snippet.tags) ? snippet.tags.join(',') : '');
    if (newTagsRaw === null) return;
    const newTags = newTagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, code: newCode, tags: newTags })
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }
      const updated = await res.json();
      setSnippets(prev => prev.map(s => (String(s.id) === String(updated.id) ? updated : s)));
    } catch (err) {
      console.error('Error editing snippet', err);
      alert('Failed to update snippet');
    }
  }

  if (loading) return <div>Loading snippets…</div>;
  if (error) return <div>{error}</div>;
  if (!Array.isArray(snippets) || snippets.length === 0) return <div>No snippets found.</div>;

  return (
    <div>
      {snippets.map((s, idx) => (
        <div key={s.id || idx} style={{ border: '1px solid #ddd', margin: 8, padding: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{s.title || 'Untitled'}</h3>
            <div>
              <button onClick={() => editSnippet(s)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => deleteSnippet(s.id)}>Delete</button>
            </div>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{s.code || ''}</pre>
          <div>Tags: {(Array.isArray(s.tags) ? s.tags.join(', ') : '')}</div>
        </div>
      ))}
    </div>
  );
}

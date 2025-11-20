// frontend/src/components/SnippetList.js
import React, { useEffect, useState } from 'react';

export default function SnippetList() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch('/api/snippets')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Status ${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setSnippets(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error fetching /api/snippets', err);
        if (mounted) {
          setError('Failed to load snippets');
          setSnippets([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading snippets…</div>;
  if (error) return <div>{error}</div>;

  if (!Array.isArray(snippets) || snippets.length === 0) {
    return <div>No snippets found.</div>;
  }

  return (
    <div>
      {snippets.map((s, idx) => (
        <div key={s.id || idx} style={{ border: '1px solid #ddd', margin: '8px', padding: '8px' }}>
          <h3>{s.title || 'Untitled'}</h3>
          <pre>{s.code || ''}</pre>
          <div>Tags: {(Array.isArray(s.tags) ? s.tags.join(', ') : '')}</div>
        </div>
      ))}
    </div>
  );
}

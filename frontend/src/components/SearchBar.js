// frontend/src/components/SearchBar.js
import React, { useEffect, useState } from 'react';

export default function SearchBar({ onSelect }) {
  const [tags, setTags] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch('/api/tags')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Status ${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setTags(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error fetching /api/tags', err);
        if (mounted) {
          setError('Failed to load tags');
          setTags([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = (Array.isArray(tags) ? tags : []).filter((t) =>
    (t || '').toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div>Loading tags…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <input
        placeholder="Search tags..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ul>
        {filtered.length === 0 && <li>No tags found</li>}
        {filtered.map((tag, i) => (
          <li key={i} onClick={() => onSelect && onSelect(tag)}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

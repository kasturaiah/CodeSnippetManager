import React, { useState } from 'react';

const SearchBar = ({ onSearch, tags }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSearch = () => {
    onSearch(search, selectedTag);
  };

  return (
    <div className="card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search snippets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input"
        style={{ flex: 1 }}
      />
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="form-input" style={{ width: '200px' }}>
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.name}>{tag.name}</option>
        ))}
      </select>
      <button onClick={handleSearch} className="btn btn-primary">Search</button>
    </div>
  );
};

export default SearchBar;
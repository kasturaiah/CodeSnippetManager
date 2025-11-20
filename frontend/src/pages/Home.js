import React from 'react';
import SearchBar from '../components/SearchBar';
import SnippetList from '../components/SnippetList';

const Home = ({ snippets, tags, onSearch, onUpdate, user }) => {
  const handleEdit = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        alert('Snippet updated successfully!');
        onUpdate();  // Refresh the list
      } else {
        alert('Failed to update snippet.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      alert('You must be logged in to delete snippets.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Snippet deleted successfully!');
          onUpdate();  // Refresh the list
        } else {
          alert('Failed to delete snippet.');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Snippets</h1>
      <SearchBar onSearch={onSearch} tags={tags} />
      <SnippetList snippets={snippets} onEdit={handleEdit} onDelete={handleDelete} user={user} />
    </div>
  );
};

export default Home;
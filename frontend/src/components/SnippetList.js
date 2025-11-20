import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetList = ({ snippets, onEdit, onDelete, user }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', code: '', language: 'javascript', tags: [], visibility: 'private' });

  const startEdit = (snippet) => {
    if (!user || parseInt(snippet.userId) !== parseInt(user.id)) {
      alert('You can only edit your own snippets.');
      return;
    }
    setEditingId(snippet.id);
    setEditForm({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags,
      visibility: snippet.visibility
    });
  };

  const saveEdit = () => {
    if (!editForm.title || !editForm.code) {
      alert('Title and code are required.');
      return;
    }
    onEdit(editingId, editForm);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      {snippets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No snippets found. Create one to get started!</p>
      ) : (
        snippets.map(snippet => (
          <div key={snippet.id} className="card">
            {editingId === snippet.id ? (
              <div>
                <h3>Editing Snippet</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="form-input"
                />
                <textarea
                  placeholder="Code"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  className="form-input"
                  style={{ height: '120px' }}
                />
                <select
                  value={editForm.language}
                  onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                  className="form-input"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={editForm.tags.join(', ')}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(', ') })}
                  className="form-input"
                />
                <select
                  value={editForm.visibility}
                  onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
                  className="form-input"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <button onClick={saveEdit} className="btn btn-primary" style={{ marginRight: '10px' }}>Save</button>
                <button onClick={cancelEdit} className="btn btn-danger">Cancel</button>
              </div>
            ) : (
              <>
                <h3>{snippet.title}</h3>
                <p>Language: {snippet.language}</p>
                <p>Tags: {snippet.tags.join(', ')}</p>
                <p>Visibility: {snippet.visibility}</p>
                <div className="snippet-code">
                  <SyntaxHighlighter language={snippet.language} style={tomorrow}>
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
                {user && parseInt(snippet.userId) === parseInt(user.id) && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => startEdit(snippet)}
                      className="btn btn-secondary"
                      style={{ marginRight: '10px' }}
                      title="Edit this snippet"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(snippet.id)}
                      className="btn btn-danger"
                      title="Delete this snippet"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SnippetList;
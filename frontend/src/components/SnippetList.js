import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetList = ({ snippets, onEdit, onDelete, user }) => (
  <div>
    {snippets.length === 0 ? (
      <p style={{ textAlign: 'center', color: '#666' }}>No snippets found. Create one to get started!</p>
    ) : (
      snippets.map(snippet => {
        // Debug logging
        console.log('Snippet:', snippet.id, 'userId:', snippet.userId, 'type:', typeof snippet.userId);
        console.log('User:', user ? user.id : 'null', 'type:', user ? typeof user.id : 'N/A');
        console.log('Can edit/delete:', user && snippet.userId === user.id);

        return (
          <div key={snippet.id} className="card">
            <h3>{snippet.title}</h3>
            <p>Language: {snippet.language}</p>
            <p>Tags: {snippet.tags.join(', ')}</p>
            <p>Visibility: {snippet.visibility}</p>
            <div className="snippet-code">
              <SyntaxHighlighter language={snippet.language} style={tomorrow}>
                {snippet.code}
              </SyntaxHighlighter>
            </div>
            {user && parseInt(snippet.userId) === parseInt(user.id) ? (  // Ensure number comparison
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => onEdit(snippet)}
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
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>Not your snippet - no edit/delete options.</p>
            )}
          </div>
        );
      })
    )}
  </div>
);

export default SnippetList;
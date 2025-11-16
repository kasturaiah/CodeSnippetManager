import React from 'react';
import SnippetForm from '../components/SnippetForm';

const CreateSnippet = ({ onCreate, user }) => (
  <div>
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Snippet</h1>
    <SnippetForm onCreate={onCreate} user={user} />
    <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
      After creating, go to Home to view, edit, or delete your snippets.
    </p>
  </div>
);

export default CreateSnippet;
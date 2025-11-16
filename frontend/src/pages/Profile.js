import React from 'react';

const Profile = ({ user }) => (
  <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center' }}>Profile</h2>
    <p><strong>Username:</strong> {user.username}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>User ID:</strong> {user.id}</p>
  </div>
);

export default Profile;
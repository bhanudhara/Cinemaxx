import React from 'react';

const NotFoundPage: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <a href="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>Go to Home</a>
  </div>
);

export default NotFoundPage;

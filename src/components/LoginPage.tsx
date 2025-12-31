import React from 'react';

const LoginPage: React.FC<{ onLogin: (user: { email: string; provider: string }) => void }>
  = ({ onLogin }) => {
  // Simple login form for demonstration
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    // Simulate login
    onLogin({ email, provider: 'email' });
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;

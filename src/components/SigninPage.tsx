import React from 'react';

const SigninPage: React.FC<{ onSignin: (user: { email: string; provider: string }) => void }>
  = ({ onSignin }) => {
  // Simple register form for demonstration
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    // Simulate register
    onSignin({ email, provider: 'email' });
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default SigninPage;

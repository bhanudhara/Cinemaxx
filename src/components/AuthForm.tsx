
import './AuthForm.css';
import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (user: { email: string; provider: string }) => void;
  isLogin?: boolean;
}

const SOCIALS = [
  { name: 'Google', icon: '🔵' },
  { name: 'Facebook', icon: '🔷' },
  { name: 'Apple', icon: '⚫' },
];

export const AuthForm: React.FC<AuthFormProps> = ({ onAuth, isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSocial = (provider: string) => {
    const user = { email: provider + '@example.com', provider };
    localStorage.setItem('user', JSON.stringify(user));
    onAuth(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (isLogin) {
      if (!users[email] || users[email].password !== password) {
        setError('Invalid credentials');
        return;
      }
      localStorage.setItem('user', JSON.stringify({ email, provider: 'email' }));
      onAuth({ email, provider: 'email' });
    } else {
      if (users[email]) {
        setError('User already exists');
        return;
      }
      users[email] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify({ email, provider: 'email' }));
      onAuth({ email, provider: 'email' });
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="socials">
        <p>Or {isLogin ? 'login' : 'register'} with:</p>
        {SOCIALS.map(s => (
          <button key={s.name} onClick={() => handleSocial(s.name)}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};

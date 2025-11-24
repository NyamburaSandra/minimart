import React, { useState } from 'react';
import './Auth.css';

type User = { email: string; isAdmin?: boolean };
const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin credentials
    if (email === 'admin@gmail.com' && password === '12345') {
      onLogin({ email, isAdmin: true });
    } else if (email && password) {
      // Regular user login
      onLogin({ email, isAdmin: false });
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <div className="auth-hint">
        <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '1rem', textAlign: 'center' }}>
          Admin: admin@gmail.com / 12345
        </p>
      </div>
    </div>
  );
};

export default Login;

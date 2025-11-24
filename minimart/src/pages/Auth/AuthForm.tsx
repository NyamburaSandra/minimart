import React, { useState } from 'react';
import './Auth.css';

type User = { email: string; isAdmin?: boolean };

type AuthFormProps = {
  onLogin: (user: User) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

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
      <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
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
        {error && <div className="error">{error}</div>}
        <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
      </form>
      
      <div className="auth-toggle">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(false);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="toggle-link"
            >
              Create account
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(true);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="toggle-link"
            >
              Sign In
            </a>
          </p>
        )}
      </div>

      {isLogin && (
        <div className="auth-hint">
          <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '1rem', textAlign: 'center' }}>
            Admin: admin@gmail.com / 12345
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;

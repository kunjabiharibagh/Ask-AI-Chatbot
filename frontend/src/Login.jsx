import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isSignup ? 'signup' : 'login';
    const body = isSignup ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      onLogin(data.token);
    } catch (err) {
      setError('Could not reach server');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-eyebrow">Ask AI Chatbot</div>
        <h1>{isSignup ? 'Create your account' : 'Welcome back to Ask AI'}</h1>
        <p className="auth-subtitle">Ask anything. Get answers grounded in real context.</p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
        </form>

        <button className="auth-toggle" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default Login;
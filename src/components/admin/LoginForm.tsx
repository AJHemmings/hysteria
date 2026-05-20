import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await resetPassword(resetEmail);
    if (resetError) {
      setError(resetError);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  const switchToForgot = () => {
    setView('forgot');
    setResetEmail(email);
    setError('');
  };

  if (view === 'forgot') {
    return (
      <div className="login-page">
        <div className="login-card glass-card">
          <h1 className="login-title">HYSTERIA</h1>
          <p className="login-subtitle">Reset Password</p>

          {resetSent ? (
            <div className="login-success">
              Check your email for a reset link. You can close this page.
            </div>
          ) : (
            <form onSubmit={handleReset} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@hysteria.band"
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="btn btn--primary login-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <button className="login-back login-back--btn" onClick={() => { setView('login'); setError(''); setResetSent(false); }}>
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <h1 className="login-title">HYSTERIA</h1>
        <p className="login-subtitle">Admin Dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hysteria.band"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button type="button" className="login-forgot-link" onClick={switchToForgot}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn--primary login-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <a href="/" className="login-back">← Back to site</a>
      </div>
    </div>
  );
}

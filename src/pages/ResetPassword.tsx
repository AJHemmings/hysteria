import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import '../components/admin/LoginForm.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle error redirects from Supabase (e.g. expired or already-used link)
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error_code');
    if (errorCode) {
      const description = params.get('error_description')?.replace(/\+/g, ' ');
      setError(description ?? 'This link is invalid or has expired. Please request a new one.');
      return;
    }

    // With PKCE flow, Supabase processes token_hash from query params during init —
    // PASSWORD_RECOVERY may fire before this component mounts. Always check for an
    // existing session first so we don't miss it.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  };

  if (!ready) {
    return (
      <div className="login-page">
        <div className="login-card glass-card">
          <h1 className="login-title">HYSTERIA</h1>
          {error ? (
            <>
              <div className="login-error">{error}</div>
              <a href="/admin/login" className="btn btn--primary login-submit">Back to Login</a>
            </>
          ) : (
            <p className="login-subtitle">Verifying reset link...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <h1 className="login-title">HYSTERIA</h1>
        <p className="login-subtitle">Set New Password</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="new-password" className="form-label">New Password</label>
            <input
              id="new-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="form-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn--primary login-submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

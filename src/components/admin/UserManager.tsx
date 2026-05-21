import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './UserManager.css';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user.id ?? null);
    });
  }, []);

  const toggleAdmin = async (userId: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !current })
        .eq('id', userId);
      if (error) throw error;
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, is_admin: !current } : u)
      );
      showToast('success', `Admin ${!current ? 'granted' : 'revoked'}`);
    } catch (err) {
      console.error('Failed to update admin status:', err);
      showToast('error', 'Failed to update admin status');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            email: inviteEmail,
            redirectTo: `${window.location.origin}/admin/reset-password`,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send invitation');
      setInviteEmail('');
      showToast('success', `Invitation sent to ${inviteEmail}`);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation';
      showToast('error', message);
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ action: 'delete', userId }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast('success', `${email} deleted`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      showToast('error', message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <div className="user-manager">
      <h2 className="heading-md" style={{ marginBottom: 'var(--space-lg)' }}>User Management</h2>

      {/* Invite form */}
      <form onSubmit={handleInvite} className="user-manager__invite glass-card">
        <h3 className="user-manager__form-title">Invite New User</h3>
        <div className="user-manager__invite-row">
          <input
            type="email"
            className="form-input"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
          <button type="submit" className="btn btn--primary" disabled={inviting}>
            {inviting ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
        <p className="user-manager__invite-hint">
          They'll receive an email to set their own password.
        </p>
      </form>

      {/* Users list */}
      {loading ? (
        <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>No users found</p>
      ) : (
        <div className="user-manager__list">
          {users.map((user) => (
            <div key={user.id} className="user-manager__item glass-card">
              <div className="user-manager__user-info">
                <span className="user-manager__email">{user.email}</span>
                <span className="user-manager__date">Joined {formatDate(user.created_at)}</span>
              </div>
              <div className="user-manager__actions">
                <span className={`user-manager__badge${user.is_admin ? ' user-manager__badge--admin' : ''}`}>
                  {user.is_admin ? 'Admin' : 'User'}
                </span>
                <button
                  className={`user-manager__toggle${user.is_admin ? ' user-manager__toggle--on' : ''}`}
                  onClick={() => toggleAdmin(user.id, user.is_admin)}
                  title={user.is_admin ? 'Revoke admin' : 'Grant admin'}
                  type="button"
                  aria-label={`${user.is_admin ? 'Revoke' : 'Grant'} admin for ${user.email}`}
                >
                  <span className="user-manager__toggle-knob" />
                </button>
                <button
                  className="btn btn--danger btn--small"
                  onClick={() => handleDelete(user.id, user.email)}
                  disabled={user.id === currentUserId || deletingId === user.id}
                  title={user.id === currentUserId ? "You can't delete your own account" : 'Delete user'}
                  type="button"
                >
                  {deletingId === user.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './GigManager.css';

interface Gig {
  id: string;
  date: string;
  venue_name: string;
  city: string;
  ticket_url: string;
}

export default function GigManager() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New gig form
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTicketUrl, setNewTicketUrl] = useState('');

  // Edit form
  const [editDate, setEditDate] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTicketUrl, setEditTicketUrl] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGigs = async () => {
    try {
      setLoading(true);
      // Cleanup past gigs (fallback for non-pg_cron)
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('gig_dates').delete().lt('date', today);

      const { data, error } = await supabase
        .from('gig_dates')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setGigs(data || []);
    } catch (err) {
      console.error('Failed to fetch gigs:', err);
      showToast('error', 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('gig_dates').insert({
        date: newDate,
        venue_name: newVenue,
        city: newCity,
        ticket_url: newTicketUrl,
      });
      if (error) throw error;

      setNewDate('');
      setNewVenue('');
      setNewCity('');
      setNewTicketUrl('');
      showToast('success', 'Gig added successfully');
      fetchGigs();
    } catch (err) {
      console.error('Failed to add gig:', err);
      showToast('error', 'Failed to add gig');
    }
  };

  const startEdit = (gig: Gig) => {
    setEditingId(gig.id);
    setEditDate(gig.date);
    setEditVenue(gig.venue_name);
    setEditCity(gig.city);
    setEditTicketUrl(gig.ticket_url);
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gig_dates')
        .update({
          date: editDate,
          venue_name: editVenue,
          city: editCity,
          ticket_url: editTicketUrl,
        })
        .eq('id', id);

      if (error) throw error;
      setEditingId(null);
      showToast('success', 'Gig updated');
      fetchGigs();
    } catch (err) {
      console.error('Failed to update gig:', err);
      showToast('error', 'Failed to update gig');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gig?')) return;
    try {
      const { error } = await supabase.from('gig_dates').delete().eq('id', id);
      if (error) throw error;
      showToast('success', 'Gig deleted');
      fetchGigs();
    } catch (err) {
      console.error('Failed to delete gig:', err);
      showToast('error', 'Failed to delete gig');
    }
  };

  return (
    <div className="gig-manager">
      <h2 className="heading-md" style={{ marginBottom: 'var(--space-lg)' }}>Manage Gig Dates</h2>

      {/* Add form */}
      <form onSubmit={handleAdd} className="gig-manager__add glass-card">
        <h3 className="gig-manager__form-title">Add New Gig</h3>
        <div className="gig-manager__form-grid">
          <div className="form-group">
            <label htmlFor="new-date" className="form-label">Date</label>
            <input
              id="new-date"
              type="date"
              className="form-input"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-venue" className="form-label">Venue Name</label>
            <input
              id="new-venue"
              type="text"
              className="form-input"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              placeholder="The O2 Arena"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-city" className="form-label">City</label>
            <input
              id="new-city"
              type="text"
              className="form-input"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="London"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-ticket" className="form-label">Ticket URL</label>
            <input
              id="new-ticket"
              type="url"
              className="form-input"
              value={newTicketUrl}
              onChange={(e) => setNewTicketUrl(e.target.value)}
              placeholder="https://tickets.venue.com/..."
            />
          </div>
        </div>
        <button type="submit" className="btn btn--primary">Add Gig</button>
      </form>

      {/* Gigs list */}
      {loading ? (
        <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : gigs.length === 0 ? (
        <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>No gigs scheduled</p>
      ) : (
        <div className="gig-manager__list">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-manager__item glass-card">
              {editingId === gig.id ? (
                /* Edit mode */
                <div className="gig-manager__edit">
                  <div className="gig-manager__form-grid">
                    <input
                      type="date"
                      className="form-input"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={editVenue}
                      onChange={(e) => setEditVenue(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                    />
                    <input
                      type="url"
                      className="form-input"
                      value={editTicketUrl}
                      onChange={(e) => setEditTicketUrl(e.target.value)}
                    />
                  </div>
                  <div className="gig-manager__edit-actions">
                    <button onClick={() => handleUpdate(gig.id)} className="btn btn--primary btn--small">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn btn--outline btn--small">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="gig-manager__view">
                  <div className="gig-manager__gig-info">
                    <span className="gig-manager__gig-date">{gig.date}</span>
                    <span className="gig-manager__gig-venue">{gig.venue_name}</span>
                    <span className="gig-manager__gig-city">{gig.city}</span>
                  </div>
                  <div className="gig-manager__actions">
                    <button onClick={() => startEdit(gig)} className="btn btn--outline btn--small">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(gig.id)} className="btn btn--danger btn--small">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

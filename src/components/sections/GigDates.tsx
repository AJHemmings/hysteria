import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './GigDates.css';

interface Gig {
  id: string;
  date: string;
  venue_name: string;
  city: string;
  ticket_url: string;
}

function formatDate(dateStr: string): { day: string; month: string; year: string } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    year: date.getFullYear().toString(),
  };
}

export default function GigDates() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGigs() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('gig_dates')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true });

        if (error) throw error;
        setGigs(data || []);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGigs();
  }, []);

  return (
    <section className="section gig-dates" id="gig-dates">
      <div className="section__inner">
        <h2 className="heading-lg section__title">Gig Dates</h2>

        {loading ? (
          <div className="gig-dates__loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="gig-dates__skeleton" />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <p className="gig-dates__empty">No upcoming gigs — stay tuned!</p>
        ) : (
          <div className="gig-dates__list">
            {gigs.map((gig, index) => {
              const { day, month, year } = formatDate(gig.date);
              return (
                <div
                  key={gig.id}
                  className="gig-dates__item glass-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                >
                  <div className="gig-dates__date">
                    <span className="gig-dates__day">{day}</span>
                    <span className="gig-dates__month">{month}</span>
                    <span className="gig-dates__year">{year}</span>
                  </div>
                  <div className="gig-dates__divider" />
                  <div className="gig-dates__info">
                    {gig.ticket_url ? (
                      <a
                        href={gig.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gig-dates__venue"
                      >
                        {gig.venue_name}
                      </a>
                    ) : (
                      <span className="gig-dates__venue gig-dates__venue--no-link">
                        {gig.venue_name}
                      </span>
                    )}
                    <span className="gig-dates__city">{gig.city}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

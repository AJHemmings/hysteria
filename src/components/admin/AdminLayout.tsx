import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GigManager from './GigManager';
import SettingsManager from './SettingsManager';
import VideoManager from './VideoManager';
import UserManager from './UserManager';
import './AdminLayout.css';

type Tab = 'gigs' | 'settings' | 'video' | 'users';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('gigs');
  const { signOut } = useAuth();

  return (
    <div className="admin">
      {/* Top bar */}
      <header className="admin__header">
        <div className="admin__header-inner">
          <h1 className="admin__title">
            <span className="admin__brand">HYSTERIA</span> Admin
          </h1>
          <div className="admin__header-actions">
            <a href="/" className="admin__link">View Site</a>
            <button onClick={signOut} className="btn btn--outline btn--small">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="admin__tabs">
        <button
          className={`admin__tab ${activeTab === 'gigs' ? 'active' : ''}`}
          onClick={() => setActiveTab('gigs')}
        >
          Gig Dates
        </button>
        <button
          className={`admin__tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`admin__tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          Video
        </button>
        <button
          className={`admin__tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </nav>

      {/* Content */}
      <main className="admin__content">
        {activeTab === 'gigs' && <GigManager />}
        {activeTab === 'settings' && <SettingsManager />}
        {activeTab === 'video' && <VideoManager />}
        {activeTab === 'users' && <UserManager />}
      </main>
    </div>
  );
}

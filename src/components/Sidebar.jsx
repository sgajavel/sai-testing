import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬛' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'team', label: 'Team', icon: '👥' },
];

const NavIcon = ({ id }) => {
  if (id === 'dashboard') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
  if (id === 'timeline') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
  if (id === 'tasks') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/>
    </svg>
  );
  if (id === 'team') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  return null;
};

export default function Sidebar({ activeView, setActiveView, tasks }) {
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: 'white'
          }}>E</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>EcomLaunch</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project Manager</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px', marginBottom: '6px' }}>Navigation</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 10px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500',
              color: activeView === item.id ? 'var(--accent-light)' : 'var(--text-secondary)',
              background: activeView === item.id ? 'var(--accent-dim)' : 'transparent',
              transition: 'all 0.15s',
              marginBottom: '2px',
            }}
            onMouseEnter={e => { if (activeView !== item.id) e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { if (activeView !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
          >
            <span style={{ color: activeView === item.id ? 'var(--accent-light)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <NavIcon id={item.id} />
            </span>
            {item.label}
            {activeView === item.id && (
              <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-light)' }} />
            )}
          </button>
        ))}
      </nav>

      {/* Progress */}
      <div style={{ padding: '16px', margin: '0 10px 16px', background: 'var(--bg-hover)', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Overall Progress</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-light)' }}>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>{completedCount} of {tasks.length} tasks done</div>
      </div>

      {/* Week indicator */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Current Sprint</div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Week 3 of 10</div>
        <div style={{ fontSize: '11px', color: 'var(--accent-light)', marginTop: '2px' }}>Dev Sprint 1</div>
      </div>
    </aside>
  );
}

import { LayoutDashboard, Briefcase, Kanban, Settings, Zap } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/hiringData';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'pipeline',  label: 'Pipeline',     icon: Kanban          },
  { id: 'jobs',      label: 'Job Postings', icon: Briefcase       },
];

export default function Sidebar({ activeView, setActiveView, jobs, candidates, onSelectCandidate }) {
  const openJobs = jobs.filter(j => j.status === 'active').length;
  const activeCandidates = candidates.filter(c => c.stage !== 'hired').length;
  const hired = candidates.filter(c => c.stage === 'hired').length;

  const badgeFor = (id) => {
    if (id === 'pipeline') return activeCandidates || null;
    if (id === 'jobs') return openJobs || null;
    return null;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <Zap size={16} />
        </div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">Velocity Labs</div>
          <div className="sidebar-logo-sub">Hiring Hub</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Workspace</div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeView === id ? 'active' : ''}`}
            onClick={() => setActiveView(id)}
          >
            <Icon size={16} className="nav-icon" />
            {label}
            {badgeFor(id) != null && (
              <span className="nav-badge">{badgeFor(id)}</span>
            )}
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 14 }}>At a Glance</div>
        {[
          { label: 'Active Candidates', value: activeCandidates, color: '#6366f1', view: 'pipeline' },
          { label: 'Hired This Quarter', value: hired,            color: '#10b981', view: 'pipeline' },
          { label: 'Open Roles',         value: openJobs,         color: '#f59e0b', view: 'jobs'     },
        ].map(({ label, value, color, view }) => (
          <button
            key={label}
            onClick={() => setActiveView(view)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 10px', borderRadius: 8, width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
              {label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
          </button>
        ))}

        {/* Recent candidates — quick access */}
        {(() => {
          const today = new Date('2026-04-14');
          const recent = [...candidates]
            .sort((a, b) => {
              const aDate = a.notes.length > 0 ? a.notes[a.notes.length - 1].date : a.appliedAt;
              const bDate = b.notes.length > 0 ? b.notes[b.notes.length - 1].date : b.appliedAt;
              return new Date(bDate) - new Date(aDate);
            })
            .slice(0, 4);
          return (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 14 }}>Recent</div>
              {recent.map(c => {
                const stage = PIPELINE_STAGES.find(s => s.id === c.stage);
                const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCandidate?.(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '5px 10px', borderRadius: 8, width: '100%',
                      background: 'none', border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div
                      className="avatar"
                      style={{ background: c.avatarColor, width: 22, height: 22, fontSize: 8, flexShrink: 0 }}
                    >
                      {initials}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 5px',
                      borderRadius: 4, background: stage?.bg, color: stage?.color,
                      flexShrink: 0, whiteSpace: 'nowrap',
                    }}>
                      {stage?.label}
                    </span>
                  </button>
                );
              })}
            </>
          );
        })()}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 2px' }}>
          <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>SC</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Sam Chen</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recruiter</div>
          </div>
          <button className="btn btn-ghost btn-icon-sm" style={{ marginLeft: 'auto' }}>
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

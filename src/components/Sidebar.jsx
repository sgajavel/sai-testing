import { LayoutDashboard, Briefcase, Kanban, Settings, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'pipeline',  label: 'Pipeline',     icon: Kanban          },
  { id: 'jobs',      label: 'Job Postings', icon: Briefcase       },
];

export default function Sidebar({ activeView, setActiveView, jobs, candidates }) {
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
          { label: 'Active Candidates', value: activeCandidates, color: '#6366f1' },
          { label: 'Hired This Quarter', value: hired,           color: '#10b981' },
          { label: 'Open Roles',         value: openJobs,        color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '5px 10px', borderRadius: 8,
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
              {label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 14 }}>Departments</div>
        {[
          { label: 'New Business',  dept: 'New Business'  },
          { label: 'Client-Facing', dept: 'Client-Facing' },
        ].map(({ label, dept }) => {
          const count = candidates.filter(c => {
            const job = jobs.find(j => j.id === c.jobId);
            return job?.department === dept && c.stage !== 'hired';
          }).length;
          return (
            <div key={dept} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 10px', borderRadius: 8,
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{count}</span>
            </div>
          );
        })}
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

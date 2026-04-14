import { Briefcase, Users, TrendingUp, CheckCircle, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/hiringData';

const fmt = (n) => n?.toLocaleString() ?? '—';

function StatCard({ icon: Icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg }}>
        <Icon size={18} style={{ color: 'white' }} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && (
        <div className="stat-change" style={{ color: subColor ?? 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function StageBar({ stage, count, max }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="stage-bar-row">
      <div className="stage-bar-label">{stage.label}</div>
      <div className="stage-bar-track">
        <div
          className="stage-bar-fill"
          style={{ width: `${pct}%`, background: stage.color }}
        />
      </div>
      <div className="stage-bar-count">{count}</div>
    </div>
  );
}

export default function Dashboard({ jobs, candidates, onViewPipeline, onViewJobs, onSelectCandidate }) {
  const activeJobs = jobs.filter(j => j.status === 'active');
  const activeCandidates = candidates.filter(c => c.stage !== 'hired');
  const hired = candidates.filter(c => c.stage === 'hired');
  const today = new Date('2026-04-14');

  // Avg days in pipeline for hired candidates
  const avgDays = hired.length > 0
    ? Math.round(hired.reduce((acc, c) => {
        const diff = (today - new Date(c.appliedAt)) / (1000 * 60 * 60 * 24);
        return acc + diff;
      }, 0) / hired.length)
    : null;

  // Candidates by stage
  const stageCounts = PIPELINE_STAGES.map(s => ({
    ...s,
    count: candidates.filter(c => c.stage === s.id).length,
  }));
  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  // Roles by urgency (open longest with fewest late-stage candidates)
  const urgentRoles = activeJobs.map(job => {
    const jobCandidates = candidates.filter(c => c.jobId === job.id);
    const lateStage = jobCandidates.filter(c =>
      ['panel_interview', 'final_interview', 'offer_extended'].includes(c.stage)
    ).length;
    const daysOpen = Math.floor((today - new Date(job.postedAt)) / (1000 * 60 * 60 * 24));
    return { ...job, candidateCount: jobCandidates.length, lateStage, daysOpen };
  }).sort((a, b) => b.daysOpen - a.daysOpen);

  // Recent candidate activity (last 5 updated)
  const recentCandidates = [...candidates]
    .filter(c => c.notes.length > 0)
    .sort((a, b) => {
      const aDate = a.notes[a.notes.length - 1]?.date ?? a.appliedAt;
      const bDate = b.notes[b.notes.length - 1]?.date ?? b.appliedAt;
      return new Date(bDate) - new Date(aDate);
    })
    .slice(0, 5);

  const getStage = (id) => PIPELINE_STAGES.find(s => s.id === id);
  const daysAgoLabel = (dateStr) => {
    const diff = Math.floor((today - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff}d ago`;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Hiring Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              Velocity Labs — Go-To-Market Recruiting &middot; Q2 2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={onViewJobs}>View Jobs</button>
            <button className="btn btn-primary btn-sm" onClick={() => onViewPipeline('all')}>
              Open Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={Briefcase}
          iconBg="linear-gradient(135deg,#6366f1,#8b5cf6)"
          label="Open Positions"
          value={activeJobs.length}
          sub="Across GTM org"
        />
        <StatCard
          icon={Users}
          iconBg="linear-gradient(135deg,#ec4899,#f97316)"
          label="Active Candidates"
          value={activeCandidates.length}
          sub="In pipeline"
        />
        <StatCard
          icon={CheckCircle}
          iconBg="linear-gradient(135deg,#10b981,#059669)"
          label="Hired This Quarter"
          value={hired.length}
          sub="Target: 6"
          subColor={hired.length >= 4 ? 'var(--green)' : 'var(--amber)'}
        />
        <StatCard
          icon={Clock}
          iconBg="linear-gradient(135deg,#f59e0b,#f97316)"
          label="Avg. Days to Hire"
          value={avgDays != null ? `${avgDays}d` : '—'}
          sub={avgDays != null ? (avgDays <= 45 ? 'On track' : 'Above target') : 'No hires yet'}
          subColor={avgDays != null && avgDays <= 45 ? 'var(--green)' : 'var(--amber)'}
        />
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        {/* Pipeline by stage */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Candidates by Stage</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>All active roles combined</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onViewPipeline('all')} style={{ gap: 4 }}>
              View <ArrowRight size={13} />
            </button>
          </div>
          <div className="stage-bars">
            {stageCounts.map(s => (
              <StageBar key={s.id} stage={s} count={s.count} max={maxCount} />
            ))}
          </div>
        </div>

        {/* Open roles urgency */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Open Roles</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Sorted by time open</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onViewJobs} style={{ gap: 4 }}>
              Manage <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {urgentRoles.map(role => {
              const isUrgent = role.daysOpen > 30 && role.lateStage === 0;
              return (
                <div key={role.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onClick={() => onViewPipeline(role.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {role.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {role.candidateCount} candidates &middot; {role.lateStage} late-stage
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isUrgent ? 'var(--red)' : 'var(--text-muted)' }}>
                      {role.daysOpen}d open
                    </div>
                    {isUrgent && (
                      <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 600 }}>Needs attention</div>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Interview Activity</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onViewPipeline('all')} style={{ gap: 4 }}>
            View Pipeline <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recentCandidates.map((c, i) => {
            const stage = getStage(c.stage);
            const lastNote = c.notes[c.notes.length - 1];
            const job = null; // just show stage
            return (
              <div
                key={c.id}
                onClick={() => onSelectCandidate?.(c.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 8px', margin: '0 -8px',
                  borderRadius: 8,
                  borderBottom: i < recentCandidates.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="avatar avatar-md" style={{ background: c.avatarColor }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-hover)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'var(--accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'transparent'}
                    >{c.name}</span>
                    <span className="badge" style={{ background: stage?.bg, color: stage?.color }}>
                      {stage?.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lastNote?.content?.slice(0, 90)}{lastNote?.content?.length > 90 ? '…' : ''}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
                  {daysAgoLabel(lastNote?.date ?? c.appliedAt)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

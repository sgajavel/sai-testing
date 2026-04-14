import { Plus, MapPin, DollarSign, Users, Clock, ChevronRight, Edit2, ToggleLeft, ToggleRight, Briefcase } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/hiringData';

const DEPT_COLORS = {
  'New Business':  { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  'Client-Facing': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

function fmtK(n) { return n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`; }

export default function Jobs({ jobs, candidates, onAddJob, onEditJob, onUpdateJob, onViewPipeline }) {
  const today = new Date('2026-04-14');

  const getCandidatesByStage = (jobId) => {
    const jobCandidates = candidates.filter(c => c.jobId === jobId);
    return PIPELINE_STAGES.reduce((acc, s) => {
      acc[s.id] = jobCandidates.filter(c => c.stage === s.id).length;
      return acc;
    }, {});
  };

  const daysOpen = (postedAt) =>
    Math.floor((today - new Date(postedAt)) / (1000 * 60 * 60 * 24));

  const activeJobs = jobs.filter(j => j.status === 'active');
  const closedJobs = jobs.filter(j => j.status === 'closed');

  return (
    <div className="jobs-view">
      {/* Header */}
      <div className="page-header" style={{ paddingTop: 28 }}>
        <div>
          <h1 className="page-title">Job Postings</h1>
          <p className="page-subtitle">
            {activeJobs.length} open &middot; {closedJobs.length} closed &middot; {candidates.length} total candidates
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddJob}>
          <Plus size={15} /> New Posting
        </button>
      </div>

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '20px 0 10px', padding: '0 2px' }}>
            Active ({activeJobs.length})
          </div>
          <div className="jobs-grid" style={{ marginTop: 0 }}>
            {activeJobs.map(job => {
              const stageCounts = getCandidatesByStage(job.id);
              const total = Object.values(stageCounts).reduce((a, b) => a + b, 0);
              const dept = DEPT_COLORS[job.department] ?? DEPT_COLORS['New Business'];
              const days = daysOpen(job.postedAt);
              const lateStage = (stageCounts['panel_interview'] ?? 0) + (stageCounts['final_interview'] ?? 0) + (stageCounts['offer_extended'] ?? 0);

              return (
                <div key={job.id} className="job-card">
                  {/* Icon */}
                  <div className="job-icon" style={{ background: dept.bg }}>
                    <Briefcase size={18} style={{ color: dept.color }} />
                  </div>

                  {/* Info */}
                  <div className="job-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="job-title">{job.title}</span>
                      <span className="badge" style={{ background: dept.bg, color: dept.color }}>
                        {job.department}
                      </span>
                      {days > 30 && lateStage === 0 && (
                        <span className="badge badge-red">Needs Attention</span>
                      )}
                    </div>

                    <div className="job-meta">
                      <span className="job-meta-item">
                        <MapPin size={11} /> {job.location}
                      </span>
                      <span className="job-meta-item">
                        <Clock size={11} /> {days}d open
                      </span>
                      <span className="job-meta-item">
                        <Users size={11} /> {total} candidates
                      </span>
                    </div>

                    <div className="job-comp">
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}>OTE: </span>
                      {fmtK(job.ote.min)}–{fmtK(job.ote.max)}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}> &middot; Base: </span>
                      {fmtK(job.baseSalary.min)}–{fmtK(job.baseSalary.max)}
                    </div>

                    {/* Stage pills */}
                    <div className="job-stage-pills">
                      {PIPELINE_STAGES.filter(s => stageCounts[s.id] > 0).map(s => (
                        <div key={s.id} className="job-stage-pill" style={{ background: s.bg, color: s.color }}>
                          <span>{stageCounts[s.id]}</span>
                          <span style={{ opacity: 0.8 }}>{s.label}</span>
                        </div>
                      ))}
                      {total === 0 && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No candidates yet</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="job-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewPipeline(job.id)}
                      style={{ gap: 5 }}
                    >
                      Pipeline <ChevronRight size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => onEditJob(job)}
                      title="Edit posting"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => onUpdateJob(job.id, { status: 'closed' })}
                      title="Close posting"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ToggleRight size={16} style={{ color: 'var(--green)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Closed jobs */}
      {closedJobs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10, padding: '0 2px' }}>
            Closed ({closedJobs.length})
          </div>
          <div className="jobs-grid" style={{ marginTop: 0 }}>
            {closedJobs.map(job => {
              const stageCounts = getCandidatesByStage(job.id);
              const hired = stageCounts['hired'] ?? 0;
              const dept = DEPT_COLORS[job.department] ?? DEPT_COLORS['New Business'];

              return (
                <div key={job.id} className="job-card" style={{ opacity: 0.6 }}>
                  <div className="job-icon" style={{ background: 'var(--bg-hover)' }}>
                    <Briefcase size={18} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div className="job-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="job-title" style={{ color: 'var(--text-secondary)' }}>{job.title}</span>
                      <span className="badge badge-muted">Closed</span>
                      {hired > 0 && <span className="badge badge-green">{hired} hired</span>}
                    </div>
                    <div className="job-meta" style={{ marginTop: 4 }}>
                      <span className="job-meta-item"><MapPin size={11} /> {job.location}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => onUpdateJob(job.id, { status: 'active' })}
                      title="Reopen posting"
                    >
                      <ToggleLeft size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

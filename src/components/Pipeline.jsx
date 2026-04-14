import { useState, useRef } from 'react';
import { Plus, Filter, GripVertical, Star, Clock, ChevronDown, X } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/hiringData';

function overallScore(ratings) {
  const vals = Object.values(ratings).filter(v => v > 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function MiniStars({ score }) {
  const full = Math.round(score);
  return (
    <div className="star-row-mini">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={10}
          fill={i <= full ? '#f59e0b' : 'none'}
          stroke={i <= full ? '#f59e0b' : 'var(--text-muted)'}
        />
      ))}
      {score > 0 && (
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 3 }}>{score.toFixed(1)}</span>
      )}
    </div>
  );
}

function CandidateCard({ candidate, onClick, onDragStart, onDragEnd, isDragging }) {
  const today = new Date('2026-04-14');
  const days = Math.floor((today - new Date(candidate.appliedAt)) / (1000 * 60 * 60 * 24));
  const score = overallScore(candidate.ratings);
  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <div className="candidate-card-top">
        <div className="avatar" style={{ background: candidate.avatarColor }}>{initials}</div>
        <div className="candidate-card-info">
          <div className="candidate-name">{candidate.name}</div>
          <div className="candidate-role">{candidate.currentRole} @ {candidate.currentCompany}</div>
        </div>
        <GripVertical size={14} style={{ color: 'var(--text-muted)', cursor: 'grab', marginTop: 2, flexShrink: 0 }} />
      </div>
      <div className="candidate-card-meta">
        <div className="candidate-days">
          <Clock size={10} /> {days}d
        </div>
        <MiniStars score={score} />
      </div>
      {candidate.source && (
        <div style={{ marginTop: 7 }}>
          <span className="badge badge-muted" style={{ fontSize: 10, padding: '2px 6px' }}>{candidate.source}</span>
        </div>
      )}
    </div>
  );
}

function AddCandidateModal({ jobs, stageId, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', currentRole: '', currentCompany: '',
    yearsExperience: '', source: 'LinkedIn', jobId: jobs[0]?.id ?? '',
    noticePeriod: '', expectedOTE: '',
  });

  const avatarColors = ['#6366f1','#ec4899','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316'];
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.jobId) return;
    onAdd({
      ...form,
      yearsExperience: Number(form.yearsExperience) || 0,
      stage: stageId,
      appliedAt: new Date().toISOString().split('T')[0],
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      ratings: { salesExperience: 0, quotaAttainment: 0, salesMethodology: 0, techStack: 0, cultureFit: 0, communication: 0, availability: 0 },
      notes: [],
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Add Candidate</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
              Starting in: {PIPELINE_STAGES.find(s => s.id === stageId)?.label}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={form.jobId} onChange={e => set('jobId', e.target.value)}>
                  {jobs.filter(j => j.status === 'active').map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Current Title</label>
                <input placeholder="Senior AE" value={form.currentRole} onChange={e => set('currentRole', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Current Company</label>
                <input placeholder="Gong" value={form.currentCompany} onChange={e => set('currentCompany', e.target.value)} />
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" placeholder="jane@gmail.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input placeholder="+1 (415) 555-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">Years Exp.</label>
                <input type="number" min="0" max="30" placeholder="5" value={form.yearsExperience} onChange={e => set('yearsExperience', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select value={form.source} onChange={e => set('source', e.target.value)}>
                  {['LinkedIn','Greenhouse','Referral','Outbound','AngelList','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notice Period</label>
                <input placeholder="2 weeks" value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Candidate</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Pipeline({ jobs, candidates, jobFilter, onFilterChange, onUpdateCandidate, onSelectCandidate, onAddCandidate }) {
  const [dragCandidateId, setDragCandidateId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [addingToStage, setAddingToStage] = useState(null);
  const dragCounter = useRef({});

  const filtered = jobFilter === 'all'
    ? candidates
    : candidates.filter(c => c.jobId === jobFilter);

  const getForStage = (stageId) => filtered.filter(c => c.stage === stageId);

  const handleDragStart = (e, candidateId) => {
    setDragCandidateId(candidateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragCandidateId(null);
    setDragOverStage(null);
    dragCounter.current = {};
  };

  const handleDragEnter = (e, stageId) => {
    e.preventDefault();
    dragCounter.current[stageId] = (dragCounter.current[stageId] ?? 0) + 1;
    setDragOverStage(stageId);
  };

  const handleDragLeave = (e, stageId) => {
    dragCounter.current[stageId] = (dragCounter.current[stageId] ?? 1) - 1;
    if (dragCounter.current[stageId] <= 0) {
      setDragOverStage(prev => prev === stageId ? null : prev);
    }
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    dragCounter.current = {};
    setDragOverStage(null);
    if (dragCandidateId) {
      onUpdateCandidate(dragCandidateId, { stage: stageId });
    }
    setDragCandidateId(null);
  };

  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="pipeline-view">
      {/* Header */}
      <div className="pipeline-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Candidate Pipeline</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              {filtered.length} candidates &middot; Drag cards to advance stages
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setAddingToStage('applied')}>
            <Plus size={15} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="pipeline-filter-bar">
        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4 }}>Role:</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${jobFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onFilterChange('all')}
          >
            All Roles
          </button>
          {activeJobs.map(job => (
            <button
              key={job.id}
              className={`btn btn-sm ${jobFilter === job.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onFilterChange(job.id)}
            >
              {job.title.replace('Account Executive', 'AE').replace('Sales Development Representative', 'SDR').replace('Customer Success Manager', 'CSM')}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="pipeline-board">
        {PIPELINE_STAGES.map(stage => {
          const stageCandidates = getForStage(stage.id);
          const isDragOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`stage-column ${isDragOver && dragCandidateId ? 'drag-over' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => handleDragEnter(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column header */}
              <div className="stage-column-header">
                <div className="stage-column-top-bar" style={{ background: stage.color }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="stage-column-title" style={{ color: stage.color }}>{stage.label}</span>
                    <span className="stage-column-count">{stageCandidates.length}</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-icon-sm"
                    onClick={() => setAddingToStage(stage.id)}
                    title={`Add candidate to ${stage.label}`}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="stage-column-cards">
                {stageCandidates.length === 0 ? (
                  <div className="empty-col">
                    <div style={{ fontSize: 20, opacity: 0.3 }}>—</div>
                    <div>Drop here</div>
                  </div>
                ) : (
                  stageCandidates.map(c => (
                    <CandidateCard
                      key={c.id}
                      candidate={c}
                      isDragging={dragCandidateId === c.id}
                      onClick={() => onSelectCandidate(c.id)}
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {addingToStage && (
        <AddCandidateModal
          jobs={jobs}
          stageId={addingToStage}
          onClose={() => setAddingToStage(null)}
          onAdd={onAddCandidate}
        />
      )}
    </div>
  );
}

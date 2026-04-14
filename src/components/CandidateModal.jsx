import { useState } from 'react';
import { X, Star, Mail, Phone, Link, Briefcase, Clock, ChevronRight, Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import { PIPELINE_STAGES, RATING_CRITERIA } from '../data/hiringData';

function overallScore(ratings) {
  const vals = Object.values(ratings).filter(v => v > 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="rating-stars">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          className="star-btn"
          disabled={readonly}
          onClick={() => !readonly && onChange(i === value ? 0 : i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', padding: '1px' }}
        >
          <Star
            size={16}
            fill={(hover || value) >= i ? '#f59e0b' : 'none'}
            stroke={(hover || value) >= i ? '#f59e0b' : 'var(--text-muted)'}
          />
        </button>
      ))}
    </div>
  );
}

function NoteCard({ note }) {
  const stage = PIPELINE_STAGES.find(s => s.id === note.stage);
  return (
    <div className="note-card">
      <div className="note-header">
        <span className="badge" style={{ background: stage?.bg, color: stage?.color, fontSize: 10 }}>
          {stage?.label ?? note.stage}
        </span>
        <span className="note-interviewer">{note.interviewer}</span>
        <span className="note-date">{note.date}</span>
      </div>
      <div className="note-content">{note.content}</div>
    </div>
  );
}

export default function CandidateModal({ candidate, job, onClose, onUpdate, onDelete }) {
  const [tab, setTab] = useState('overview');
  const [ratings, setRatings] = useState({ ...candidate.ratings });
  const [stage, setStage] = useState(candidate.stage);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteInterviewer, setNoteInterviewer] = useState('Sam Chen');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const today = new Date('2026-04-14');
  const daysInPipeline = Math.floor((today - new Date(candidate.appliedAt)) / (1000 * 60 * 60 * 24));
  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const score = overallScore(ratings);
  const currentStage = PIPELINE_STAGES.find(s => s.id === stage);

  const handleRatingChange = (key, val) => {
    const updated = { ...ratings, [key]: val };
    setRatings(updated);
    onUpdate({ ratings: updated });
  };

  const handleStageChange = (newStage) => {
    setStage(newStage);
    onUpdate({ stage: newStage });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      id: `n-${Date.now()}`,
      stage,
      interviewer: noteInterviewer.trim() || 'Anonymous',
      date: today.toISOString().split('T')[0],
      content: noteText.trim(),
    };
    const updatedNotes = [...candidate.notes, newNote];
    onUpdate({ notes: updatedNotes });
    setNoteText('');
    setShowNoteForm(false);
  };

  const nextStage = PIPELINE_STAGES[PIPELINE_STAGES.findIndex(s => s.id === stage) + 1];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-full" style={{ maxHeight: '94vh' }}>

        {/* Sticky header */}
        <div className="modal-header" style={{ flexDirection: 'column', gap: 0, padding: '20px 24px 0', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
            {/* Candidate info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="avatar avatar-xl" style={{ background: candidate.avatarColor }}>{initials}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{candidate.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {candidate.currentRole} @ {candidate.currentCompany}
                  {candidate.yearsExperience > 0 && ` · ${candidate.yearsExperience}y exp.`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {/* Current stage badge */}
                  <span className="badge" style={{ background: currentStage?.bg, color: currentStage?.color }}>
                    {currentStage?.label}
                  </span>
                  {/* Overall score */}
                  {score > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {score.toFixed(1)}/5
                    </span>
                  )}
                  <span className="badge badge-muted" style={{ fontSize: 10 }}>
                    <Clock size={9} style={{ marginRight: 2 }} />{daysInPipeline}d in pipeline
                  </span>
                  {job && (
                    <span className="badge badge-accent" style={{ fontSize: 10 }}>{job.title}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Close + actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {nextStage && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStageChange(nextStage.id)}
                  style={{ gap: 5 }}
                >
                  Move to {nextStage.label} <ChevronRight size={13} />
                </button>
              )}
              <button className="btn btn-ghost btn-icon" onClick={onClose}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="modal-tabs" style={{ padding: '0', borderBottom: '1px solid var(--border)', margin: '0 -24px', paddingLeft: 24 }}>
            {['overview', 'ratings', 'notes'].map(t => (
              <button key={t} className={`modal-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t === 'overview' ? 'Overview' : t === 'ratings' ? 'Ratings' : `Notes (${candidate.notes.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '20px 24px' }}>

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Contact info */}
              <div>
                <div className="section-title">Contact</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {candidate.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <a href={`mailto:${candidate.email}`} style={{ color: 'var(--accent-hover)', textDecoration: 'none' }}>{candidate.email}</a>
                    </div>
                  )}
                  {candidate.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <Phone size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)' }}>{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.linkedIn && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <Link size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--accent-hover)' }}>{candidate.linkedIn}</span>
                      <ExternalLink size={11} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="divider" style={{ margin: '0' }} />

              {/* Details grid */}
              <div>
                <div className="section-title">Details</div>
                <div className="info-grid">
                  <div>
                    <div className="info-item-label">Source</div>
                    <div className="info-item-value">{candidate.source || '—'}</div>
                  </div>
                  <div>
                    <div className="info-item-label">Applied</div>
                    <div className="info-item-value">{candidate.appliedAt}</div>
                  </div>
                  <div>
                    <div className="info-item-label">Notice Period</div>
                    <div className="info-item-value">{candidate.noticePeriod || '—'}</div>
                  </div>
                  <div>
                    <div className="info-item-label">Expected OTE</div>
                    <div className="info-item-value">{candidate.expectedOTE || '—'}</div>
                  </div>
                  {candidate.startDate && (
                    <div>
                      <div className="info-item-label">Start Date</div>
                      <div className="info-item-value" style={{ color: 'var(--green)', fontWeight: 600 }}>{candidate.startDate}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="divider" style={{ margin: '0' }} />

              {/* Stage selector */}
              <div>
                <div className="section-title">Move Stage</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {PIPELINE_STAGES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStageChange(s.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 8, border: '1px solid',
                        borderColor: stage === s.id ? s.color : 'var(--border)',
                        background: stage === s.id ? s.bg : 'transparent',
                        color: stage === s.id ? s.color : 'var(--text-secondary)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job info */}
              {job && (
                <>
                  <div className="divider" style={{ margin: '0' }} />
                  <div>
                    <div className="section-title">Applied Role</div>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                        {job.department} · {job.location}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 5 }}>
                        OTE {job.ote?.min ? `$${(job.ote.min/1000).toFixed(0)}K–$${(job.ote.max/1000).toFixed(0)}K` : '—'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* File attachments (demo) */}
              {candidate.name && (
                <>
                  <div className="divider" style={{ margin: '0' }} />
                  <div>
                    <div className="section-title">Files</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '7px 11px', borderRadius: 8,
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        fontSize: 12, color: 'var(--text-primary)',
                      }}>
                        <FileText size={13} style={{ color: 'var(--accent)' }} />
                        {candidate.name.toLowerCase().replace(' ', '_')}_resume.pdf
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── RATINGS TAB ── */}
          {tab === 'ratings' && (
            <div>
              {/* Score summary */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', borderRadius: 12,
                background: score >= 4 ? 'var(--green-dim)' : score >= 3 ? 'var(--amber-dim)' : 'var(--bg-secondary)',
                border: '1px solid var(--border)', marginBottom: 20,
              }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: score >= 4 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--text-primary)', lineHeight: 1 }}>
                    {score > 0 ? score.toFixed(1) : '—'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>/ 5.0</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {score >= 4.5 ? 'Exceptional Candidate' : score >= 4 ? 'Strong Candidate' : score >= 3 ? 'Good Candidate' : score > 0 ? 'Needs Review' : 'Not Yet Rated'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                    {score > 0 ? `Based on ${Object.values(ratings).filter(v => v > 0).length} of ${RATING_CRITERIA.length} criteria rated` : 'Rate criteria below to generate a score'}
                  </div>
                  {score > 0 && (
                    <div className="progress-bar" style={{ marginTop: 8 }}>
                      <div className="progress-fill" style={{ width: `${(score / 5) * 100}%`, background: score >= 4 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--accent)' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Individual criteria */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {RATING_CRITERIA.map(criterion => (
                  <div key={criterion.id} className="rating-row">
                    <div style={{ flex: 1 }}>
                      <div className="rating-label">{criterion.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{criterion.desc}</div>
                    </div>
                    <StarRating
                      value={ratings[criterion.id] ?? 0}
                      onChange={(val) => handleRatingChange(criterion.id, val)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTES TAB ── */}
          {tab === 'notes' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="section-title" style={{ margin: 0 }}>Interview Notes</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowNoteForm(!showNoteForm)}>
                  <Plus size={13} /> Add Note
                </button>
              </div>

              {/* Add note form */}
              {showNoteForm && (
                <div className="add-note-form" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Interviewer</label>
                      <input
                        placeholder="Your name"
                        value={noteInterviewer}
                        onChange={e => setNoteInterviewer(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Stage</label>
                      <select value={stage} onChange={e => setStage(e.target.value)}>
                        {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      rows={4}
                      placeholder="Interview notes, observations, red flags, highlights..."
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowNoteForm(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleAddNote} disabled={!noteText.trim()}>Save Note</button>
                  </div>
                </div>
              )}

              {/* Notes list */}
              {candidate.notes.length === 0 && !showNoteForm ? (
                <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)' }}>
                  <FileText size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No notes yet</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Add interview notes to track this candidate's progress</div>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => setShowNoteForm(true)}>
                    <Plus size={13} /> Add First Note
                  </button>
                </div>
              ) : (
                [...candidate.notes].reverse().map(note => (
                  <NoteCard key={note.id} note={note} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            {!confirmDelete ? (
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={13} /> Remove Candidate
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--red)' }}>Remove {candidate.name}?</span>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Confirm</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            )}
          </div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

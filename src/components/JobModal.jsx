import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const DEPARTMENTS = ['New Business', 'Client-Facing'];
const LOCATIONS = ['Remote / San Francisco', 'Remote / New York', 'Remote / Chicago', 'Remote / Austin', 'Remote / Los Angeles', 'Hybrid / San Francisco', 'On-site / San Francisco'];

export default function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title:          job?.title          ?? '',
    department:     job?.department     ?? 'New Business',
    type:           job?.type           ?? 'Full-time',
    location:       job?.location       ?? 'Remote / San Francisco',
    hiringManager:  job?.hiringManager  ?? '',
    recruiter:      job?.recruiter      ?? 'Sam Chen',
    oteMin:         job?.ote?.min       ?? '',
    oteMax:         job?.ote?.max       ?? '',
    baseMin:        job?.baseSalary?.min ?? '',
    baseMax:        job?.baseSalary?.max ?? '',
    description:    job?.description    ?? '',
    requirements:   job?.requirements   ?? [''],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setReq = (i, val) => {
    const reqs = [...form.requirements];
    reqs[i] = val;
    set('requirements', reqs);
  };

  const addReq = () => set('requirements', [...form.requirements, '']);
  const removeReq = (i) => set('requirements', form.requirements.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      title:        form.title.trim(),
      department:   form.department,
      type:         form.type,
      location:     form.location,
      hiringManager: form.hiringManager.trim(),
      recruiter:    form.recruiter.trim(),
      ote:          { min: Number(form.oteMin) || 0, max: Number(form.oteMax) || 0 },
      baseSalary:   { min: Number(form.baseMin) || 0, max: Number(form.baseMax) || 0 },
      description:  form.description.trim(),
      requirements: form.requirements.map(r => r.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
              {job ? 'Edit Job Posting' : 'New Job Posting'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
              {job ? `Editing: ${job.title}` : 'Create a new open role on the Velocity Labs GTM team'}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Title + Dept */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  placeholder="e.g. Account Executive — Enterprise"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Type + Location */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {['Full-time', 'Part-time', 'Contract'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <select value={form.location} onChange={e => set('location', e.target.value)}>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Compensation */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: 10 }}>Compensation</label>
              <div className="form-row form-row-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.3px' }}>Base Salary Range</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="number" placeholder="100000" value={form.baseMin}
                      onChange={e => set('baseMin', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: 12 }}>to</span>
                    <input
                      type="number" placeholder="120000" value={form.baseMax}
                      onChange={e => set('baseMax', e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.3px' }}>OTE (On-Target Earnings)</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="number" placeholder="200000" value={form.oteMin}
                      onChange={e => set('oteMin', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: 12 }}>to</span>
                    <input
                      type="number" placeholder="240000" value={form.oteMax}
                      onChange={e => set('oteMax', e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Hiring Manager</label>
                <input placeholder="Alex Rivera" value={form.hiringManager} onChange={e => set('hiringManager', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Recruiter</label>
                <input placeholder="Sam Chen" value={form.recruiter} onChange={e => set('recruiter', e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Role Description</label>
              <textarea
                rows={4}
                placeholder="Describe the role, what you'll be doing, and why it matters..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            {/* Requirements */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Requirements</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addReq} style={{ gap: 4 }}>
                  <Plus size={13} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.requirements.map((req, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <input
                      placeholder={`Requirement ${i + 1}`}
                      value={req}
                      onChange={e => setReq(i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {form.requirements.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => removeReq(i)}
                        style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {job ? 'Save Changes' : 'Create Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

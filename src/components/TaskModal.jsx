import React, { useState } from 'react';
import { CATEGORIES, STATUS_OPTIONS, PRIORITY_OPTIONS, TEAM_MEMBERS } from '../data/projectData';

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const isNew = !task;
  const [form, setForm] = useState(task || {
    title: '',
    category: 'Development',
    status: 'Not Started',
    priority: 'Medium',
    assignee: 1,
    week: 1,
    description: '',
    dueDate: 'Week 1',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  const priorityColors = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#10b981' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {isNew ? 'Add New Task' : 'Edit Task'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: '20px', color: 'var(--text-muted)' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className="form-input"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                style={{ color: priorityColors[form.priority] }}
              >
                {PRIORITY_OPTIONS.map(p => <option key={p} style={{ color: priorityColors[p] }}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timeline Week</label>
              <select className="form-input" value={form.week} onChange={e => set('week', Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>Week {w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select className="form-input" value={form.assignee} onChange={e => set('assignee', Number(e.target.value))}>
              {TEAM_MEMBERS.map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
              ))}
            </select>
          </div>

          {/* Assignee preview */}
          {form.assignee && (() => {
            const member = TEAM_MEMBERS.find(m => m.id === form.assignee);
            if (!member) return null;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '16px' }}>
                <div className="avatar" style={{ background: member.color }}>{member.avatar}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{member.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
                </div>
              </div>
            );
          })()}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            {!isNew && (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => { onDelete(task.id); onClose(); }}>
                Delete
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isNew ? 'Add Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

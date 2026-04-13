import React, { useState } from 'react';
import { CATEGORIES, STATUS_OPTIONS, PRIORITY_OPTIONS, TEAM_MEMBERS } from '../data/projectData';
import TaskModal from './TaskModal';

function getCategoryColor(cat) {
  const map = {
    Design: '#f59e0b', Development: '#6366f1', Content: '#10b981',
    Marketing: '#ec4899', Testing: '#06b6d4', Launch: '#f97316',
  };
  return map[cat] || '#9399b2';
}

function getStatusStyle(status) {
  if (status === 'Completed') return { bg: 'rgba(16,185,129,0.12)', color: '#10b981' };
  if (status === 'In Progress') return { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' };
  if (status === 'Blocked') return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
  return { bg: 'rgba(92,99,128,0.12)', color: '#9399b2' };
}

function getPriorityStyle(p) {
  if (p === 'Critical') return { color: '#ef4444' };
  if (p === 'High') return { color: '#f97316' };
  if (p === 'Medium') return { color: '#f59e0b' };
  return { color: '#10b981' };
}

function StatusDot({ status }) {
  const s = getStatusStyle(status);
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.color }} />
      {status}
    </span>
  );
}

function TaskCard({ task, onEdit, onStatusChange }) {
  const member = TEAM_MEMBERS.find(m => m.id === task.assignee);
  const color = getCategoryColor(task.category);
  const prStyle = getPriorityStyle(task.priority);
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: '10px',
        padding: '14px',
        transition: 'all 0.15s',
        opacity: isCompleted ? 0.75 : 1,
        cursor: 'pointer',
      }}
      onClick={() => onEdit(task)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.borderLeftColor = color; e.currentTarget.style.background = 'var(--bg-card)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <h3 style={{
          fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4,
          textDecoration: isCompleted ? 'line-through' : 'none',
          flex: 1,
        }}>{task.title}</h3>
        <span style={{ fontSize: '11px', fontWeight: '700', color: prStyle.color, flexShrink: 0 }}>
          {task.priority === 'Critical' ? '🔴' : task.priority === 'High' ? '🟠' : task.priority === 'Medium' ? '🟡' : '🟢'}
        </span>
      </div>

      {task.description && (
        <p className="truncate" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{task.description}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <StatusDot status={task.status} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>W{task.week}</span>
          {member && (
            <div className="avatar" style={{ background: member.color, width: '22px', height: '22px', fontSize: '9px' }} title={member.name}>
              {member.avatar}
            </div>
          )}
        </div>
      </div>

      {/* Quick status update */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
        {STATUS_OPTIONS.map(s => {
          const sStyle = getStatusStyle(s);
          return (
            <button
              key={s}
              title={s}
              onClick={() => onStatusChange(task.id, s)}
              style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: task.status === s ? sStyle.color : 'var(--border)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategorySection({ category, tasks, onEdit, onStatusChange }) {
  const color = getCategoryColor(category);
  const done = tasks.filter(t => t.status === 'Completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div style={{ minWidth: '280px', maxWidth: '340px', flex: '1 1 280px' }}>
      {/* Category Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 14px', background: 'var(--bg-secondary)',
        borderRadius: '10px 10px 0 0', borderBottom: `2px solid ${color}`,
        border: '1px solid var(--border)',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', flex: 1 }}>{category}</span>
        <span style={{ fontSize: '11px', color, fontWeight: '700' }}>{pct}%</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--border)', borderRadius: '99px', padding: '1px 7px', fontWeight: '600' }}>
          {tasks.length}
        </span>
      </div>

      {/* Progress */}
      <div style={{ height: '3px', background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
      </div>

      {/* Tasks */}
      <div style={{
        border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px',
        padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px',
        minHeight: '80px', background: 'var(--bg-primary)',
      }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>No tasks</div>
        ) : (
          tasks.map(t => (
            <TaskCard key={t.id} task={t} onEdit={onEdit} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}

export default function Tasks({ tasks, onUpdateTask, onAddTask, onDeleteTask }) {
  const [editingTask, setEditingTask] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterAssignee !== 'All' && t.assignee !== Number(filterAssignee)) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = (form) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, form);
    } else {
      onAddTask({ ...form, id: Date.now() });
    }
    setEditingTask(null);
    setAddingNew(false);
  };

  const handleStatusChange = (id, status) => onUpdateTask(id, { status });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const overallPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="fade-in" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{completedCount} of {tasks.length} tasks completed · {overallPct}% overall</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border)' }}>
            {['board', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                  background: viewMode === v ? 'var(--accent)' : 'transparent',
                  color: viewMode === v ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {v === 'board' ? '⊞ Board' : '☰ List'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setAddingNew(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          style={{ width: '200px' }}
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
          <option value="All">All Members</option>
          {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {(filterStatus !== 'All' || filterCategory !== 'All' || filterAssignee !== 'All' || search) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setFilterStatus('All'); setFilterCategory('All'); setFilterAssignee('All'); setSearch(''); }}
          >
            Clear filters
          </button>
        )}
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {viewMode === 'board' ? (
        /* Board View */
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', flexWrap: 'wrap' }}>
          {(filterCategory === 'All' ? CATEGORIES : [filterCategory]).map(cat => (
            <CategorySection
              key={cat}
              category={cat}
              tasks={filtered.filter(t => t.category === cat)}
              onEdit={setEditingTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                {['Task', 'Category', 'Status', 'Priority', 'Assignee', 'Week', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => {
                const member = TEAM_MEMBERS.find(m => m.id === task.assignee);
                const color = getCategoryColor(task.category);
                const sStyle = getStatusStyle(task.status);
                const prStyle = getPriorityStyle(task.priority);
                return (
                  <tr
                    key={task.id}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setEditingTask(task)}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{task.title}</div>
                      {task.description && <div className="truncate" style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '300px' }}>{task.description}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge" style={{ background: `${color}15`, color }}>{task.category}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge" style={{ background: sStyle.bg, color: sStyle.color }}>{task.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: prStyle.color }}>{task.priority}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {member && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar" style={{ background: member.color }}>{member.avatar}</div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.name}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>W{task.week}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={e => { e.stopPropagation(); setEditingTask(task); }}
                        style={{ fontSize: '15px', color: 'var(--text-muted)' }}
                      >
                        ✏
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tasks match your filters
            </div>
          )}
        </div>
      )}

      {(editingTask || addingNew) && (
        <TaskModal
          task={editingTask || null}
          onClose={() => { setEditingTask(null); setAddingNew(false); }}
          onSave={handleSave}
          onDelete={(id) => { onDeleteTask(id); setEditingTask(null); }}
        />
      )}
    </div>
  );
}

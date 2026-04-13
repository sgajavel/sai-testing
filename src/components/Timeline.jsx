import React, { useState } from 'react';
import { MILESTONES, CATEGORIES, TEAM_MEMBERS } from '../data/projectData';

const CURRENT_WEEK = 3;
const WEEKS = Array.from({ length: 10 }, (_, i) => i + 1);

function getCategoryColor(cat) {
  const map = {
    Design: '#f59e0b', Development: '#6366f1', Content: '#10b981',
    Marketing: '#ec4899', Testing: '#06b6d4', Launch: '#f97316',
  };
  return map[cat] || '#9399b2';
}

function getStatusOpacity(status) {
  if (status === 'Completed') return 1;
  if (status === 'In Progress') return 0.85;
  if (status === 'Blocked') return 0.9;
  return 0.5;
}

function TaskBar({ task, totalWeeks = 10, onClick }) {
  const [hovered, setHovered] = useState(false);
  const weekWidth = 100 / totalWeeks;
  const left = `${(task.week - 1) * weekWidth}%`;
  const width = `${weekWidth * 0.85}%`;
  const color = getCategoryColor(task.category);
  const isCompleted = task.status === 'Completed';
  const isBlocked = task.status === 'Blocked';
  const isProgress = task.status === 'In Progress';

  const member = TEAM_MEMBERS.find(m => m.id === task.assignee);

  return (
    <div
      title={`${task.title} — ${task.status}`}
      onClick={() => onClick(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left,
        width,
        height: '28px',
        background: isCompleted
          ? `linear-gradient(90deg, ${color}, ${color}cc)`
          : isBlocked
          ? `linear-gradient(90deg, #ef4444, #f87171)`
          : isProgress
          ? `linear-gradient(90deg, ${color}99, ${color}66)`
          : `${color}30`,
        border: `1px solid ${isBlocked ? '#ef444466' : isCompleted ? `${color}99` : isProgress ? `${color}66` : `${color}30`}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '6px',
        gap: '4px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: hovered ? 'scaleY(1.08)' : 'scaleY(1)',
        zIndex: hovered ? 10 : 1,
        overflow: 'hidden',
        boxShadow: hovered ? `0 4px 12px ${color}40` : 'none',
      }}
    >
      {isCompleted && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {isBlocked && <span style={{ fontSize: '9px', flexShrink: 0 }}>⚠</span>}
      <span style={{
        fontSize: '10px', fontWeight: '600', color: isCompleted || isProgress ? 'white' : `${color}`,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        opacity: isCompleted || isProgress ? 1 : 0.8,
      }}>
        {task.title}
      </span>
    </div>
  );
}

function MilestoneLine({ week, totalWeeks }) {
  const milestone = MILESTONES.find(m => m.week === week);
  if (!milestone) return null;

  const left = `${((week - 1) / totalWeeks) * 100}%`;

  return (
    <div style={{ position: 'absolute', left, top: 0, bottom: 0, width: '2px', background: 'rgba(99,102,241,0.25)', zIndex: 5, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--accent)', color: 'white', fontSize: '9px', fontWeight: '700',
        padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap',
      }}>
        {milestone.title}
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, onUpdateStatus, onUpdateAssignee }) {
  if (!task) return null;
  const member = TEAM_MEMBERS.find(m => m.id === task.assignee);
  const color = getCategoryColor(task.category);

  const priorityColors = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#10b981' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span className="badge" style={{ background: `${color}20`, color, marginBottom: '8px' }}>
              {task.category}
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: 0 }}>{task.title}</h2>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: '18px', color: 'var(--text-muted)' }}>×</button>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>{task.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Due</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{task.dueDate}</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Priority</div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: priorityColors[task.priority] }}>{task.priority}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={task.status} onChange={e => onUpdateStatus(task.id, e.target.value)}>
            {['Not Started', 'In Progress', 'Completed', 'Blocked'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Assignee</label>
          <select className="form-input" value={task.assignee} onChange={e => onUpdateAssignee(task.id, Number(e.target.value))}>
            {TEAM_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
            ))}
          </select>
        </div>

        {member && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div className="avatar avatar-lg" style={{ background: member.color }}>{member.avatar}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{member.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.role}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline({ tasks, onUpdateTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState(new Set(CATEGORIES));

  const toggleCategory = (cat) => {
    setVisibleCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filteredTasks = tasks.filter(t => visibleCategories.has(t.category));

  const handleUpdateStatus = (id, status) => {
    onUpdateTask(id, { status });
    setSelectedTask(prev => prev ? { ...prev, status } : null);
  };
  const handleUpdateAssignee = (id, assignee) => {
    onUpdateTask(id, { assignee });
    setSelectedTask(prev => prev ? { ...prev, assignee } : null);
  };

  const ROW_HEIGHT = 44;
  const HEADER_HEIGHT = 40;
  const LABEL_WIDTH = 100;

  return (
    <div className="fade-in" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Timeline</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>10-week Gantt chart with milestones and task progress</p>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {CATEGORIES.map(cat => {
          const color = getCategoryColor(cat);
          const active = visibleCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="badge"
              style={{
                background: active ? `${color}20` : 'var(--bg-secondary)',
                color: active ? color : 'var(--text-muted)',
                border: `1px solid ${active ? `${color}40` : 'var(--border)'}`,
                cursor: 'pointer', padding: '5px 12px', fontSize: '12px',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? color : 'var(--text-muted)' }} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gantt Chart */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Milestone header */}
        <div style={{ padding: '12px 0 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '32px', paddingLeft: LABEL_WIDTH + 16 }}>
            {WEEKS.map(w => {
              const milestone = MILESTONES.find(m => m.week === w);
              return (
                <div key={w} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  {milestone && (
                    <div style={{
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                      background: w === CURRENT_WEEK ? 'var(--accent)' : w < CURRENT_WEEK ? '#10b981' : 'var(--border-light)',
                      color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 6px',
                      borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10,
                    }}>
                      ★ {milestone.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Week headers */}
          <div style={{ display: 'flex', alignItems: 'center', height: HEADER_HEIGHT, paddingLeft: LABEL_WIDTH + 16 }}>
            {WEEKS.map(w => (
              <div key={w} style={{
                flex: 1, textAlign: 'center',
                fontSize: '12px', fontWeight: w === CURRENT_WEEK ? '800' : '600',
                color: w === CURRENT_WEEK ? 'var(--accent-light)' : w < CURRENT_WEEK ? 'var(--text-muted)' : 'var(--text-secondary)',
              }}>
                W{w}
                {w === CURRENT_WEEK && (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', margin: '2px auto 0' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div style={{ overflow: 'auto' }}>
          {CATEGORIES.filter(cat => visibleCategories.has(cat)).map((category, catIdx) => {
            const catTasks = filteredTasks.filter(t => t.category === category);
            const color = getCategoryColor(category);

            return (
              <div key={category}>
                {/* Category row header */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: catIdx % 2 === 0 ? 'var(--bg-card)' : `${color}05`,
                  borderBottom: '1px solid var(--border)',
                  minHeight: `${ROW_HEIGHT * catTasks.length + 16}px`,
                }}>
                  {/* Label */}
                  <div style={{
                    width: LABEL_WIDTH + 16, flexShrink: 0, paddingLeft: '16px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                    paddingTop: '10px',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{category}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{catTasks.length} tasks</div>
                  </div>

                  {/* Task bars */}
                  <div style={{ flex: 1, position: 'relative', paddingTop: '8px', paddingBottom: '8px' }}>
                    {/* Week grid lines */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                      {WEEKS.map(w => (
                        <div key={w} style={{
                          flex: 1,
                          borderRight: '1px solid var(--border)',
                          background: w === CURRENT_WEEK ? 'rgba(99,102,241,0.04)' : 'transparent',
                        }} />
                      ))}
                    </div>

                    {catTasks.map((task, i) => (
                      <div key={task.id} style={{ position: 'relative', height: ROW_HEIGHT, display: 'flex', alignItems: 'center' }}>
                        <TaskBar task={task} totalWeeks={10} onClick={setSelectedTask} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'var(--bg-secondary)' }}>
          {[
            { label: 'Completed', bg: '#10b981', border: '#10b98199' },
            { label: 'In Progress', bg: '#6366f155', border: '#6366f166' },
            { label: 'Not Started', bg: '#6366f120', border: '#6366f120' },
            { label: 'Blocked', bg: '#ef444466', border: '#ef444499' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '24px', height: '10px', borderRadius: '3px', background: item.bg, border: `1px solid ${item.border}` }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <div style={{ width: '2px', height: '14px', background: 'var(--accent)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Milestone</span>
          </div>
        </div>
      </div>

      {/* Milestone reference list */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Milestone Reference</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {MILESTONES.map(m => {
            const isPast = m.week < CURRENT_WEEK;
            const isCurrent = m.week === CURRENT_WEEK;
            return (
              <div key={m.id} style={{
                padding: '12px', borderRadius: '8px',
                border: `1px solid ${isCurrent ? 'var(--accent)' : 'var(--border)'}`,
                background: isCurrent ? 'var(--accent-dim)' : isPast ? 'rgba(16,185,129,0.05)' : 'var(--bg-secondary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: isPast ? '#10b981' : isCurrent ? 'var(--accent)' : 'var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '700', color: 'white',
                  }}>{isPast ? '✓' : m.week}</div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: isCurrent ? 'var(--accent-light)' : 'var(--text-primary)' }}>{m.title}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{m.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
        />
      )}
    </div>
  );
}

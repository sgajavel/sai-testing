import React, { useState } from 'react';
import { TEAM_MEMBERS, CATEGORIES } from '../data/projectData';

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
  return { bg: 'rgba(92,99,128,0.1)', color: '#9399b2' };
}

function MemberCard({ member, tasks }) {
  const [expanded, setExpanded] = useState(false);
  const memberTasks = tasks.filter(t => t.assignee === member.id);
  const done = memberTasks.filter(t => t.status === 'Completed').length;
  const inProg = memberTasks.filter(t => t.status === 'In Progress').length;
  const blocked = memberTasks.filter(t => t.status === 'Blocked').length;
  const pct = memberTasks.length ? Math.round((done / memberTasks.length) * 100) : 0;

  const categoryBreakdown = CATEGORIES.map(cat => ({
    cat, count: memberTasks.filter(t => t.category === cat).length,
  })).filter(x => x.count > 0);

  return (
    <div className="card" style={{ transition: 'all 0.2s' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div className="avatar avatar-xl" style={{ background: member.color }}>{member.avatar}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{member.name}</h3>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{member.role}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {blocked > 0 && (
              <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                {blocked} blocked
              </span>
            )}
            {inProg > 0 && (
              <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                {inProg} active
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: member.color, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{done}/{memberTasks.length} done</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: '12px' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${member.color}, ${member.color}aa)` }} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'Total', value: memberTasks.length, color: 'var(--text-primary)' },
          { label: 'Done', value: done, color: '#10b981' },
          { label: 'Active', value: inProg, color: '#6366f1' },
          { label: 'Blocked', value: blocked, color: blocked > 0 ? '#ef4444' : 'var(--text-muted)' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categoryBreakdown.map(({ cat, count }) => (
              <span key={cat} className="badge" style={{ background: `${getCategoryColor(cat)}15`, color: getCategoryColor(cat) }}>
                {cat} · {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ width: '100%', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '6px' }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▲ Hide tasks' : `▼ View all tasks (${memberTasks.length})`}
      </button>

      {/* Task list */}
      {expanded && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {memberTasks.map(task => {
            const sStyle = getStatusStyle(task.status);
            const color = getCategoryColor(task.category);
            return (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
                background: 'var(--bg-secondary)', borderRadius: '7px',
                borderLeft: `3px solid ${color}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>Week {task.week} · {task.category}</div>
                </div>
                <span className="badge" style={{ background: sStyle.bg, color: sStyle.color, flexShrink: 0 }}>{task.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Team({ tasks }) {
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;

  return (
    <div className="fade-in" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Team</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          {TEAM_MEMBERS.length} team members · {completed} tasks completed · {inProgress} in progress
        </p>
      </div>

      {/* Team overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {TEAM_MEMBERS.map(member => {
          const memberTasks = tasks.filter(t => t.assignee === member.id);
          const done = memberTasks.filter(t => t.status === 'Completed').length;
          const pct = memberTasks.length ? Math.round((done / memberTasks.length) * 100) : 0;

          return (
            <div key={member.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="avatar" style={{ background: member.color }}>{member.avatar}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{member.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
                </div>
              </div>
              <div className="progress-bar" style={{ height: '4px' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${member.color}, ${member.color}99)` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{done}/{memberTasks.length} tasks</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: member.color }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {TEAM_MEMBERS.map(member => (
          <MemberCard key={member.id} member={member} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { CATEGORIES, TEAM_MEMBERS, MILESTONES } from '../data/projectData';

const CURRENT_WEEK = 3;

function getCategoryColor(cat) {
  const map = {
    Design: '#f59e0b', Development: '#6366f1', Content: '#10b981',
    Marketing: '#ec4899', Testing: '#06b6d4', Launch: '#f97316',
  };
  return map[cat] || '#9399b2';
}

function getStatusColor(status) {
  if (status === 'Completed') return '#10b981';
  if (status === 'In Progress') return '#6366f1';
  if (status === 'Blocked') return '#ef4444';
  return '#5c6380';
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color || 'var(--accent)'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  );
}

function CategoryProgress({ category, tasks }) {
  const catTasks = tasks.filter(t => t.category === category);
  const done = catTasks.filter(t => t.status === 'Completed').length;
  const inProgress = catTasks.filter(t => t.status === 'In Progress').length;
  const blocked = catTasks.filter(t => t.status === 'Blocked').length;
  const pct = catTasks.length ? Math.round((done / catTasks.length) * 100) : 0;
  const color = getCategoryColor(category);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{category}</span>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{done}/{catTasks.length}</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color }}>{pct}%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        {inProgress > 0 && <span style={{ fontSize: '11px', color: '#6366f1' }}>{inProgress} in progress</span>}
        {blocked > 0 && <span style={{ fontSize: '11px', color: '#ef4444' }}>{blocked} blocked</span>}
      </div>
    </div>
  );
}

function MilestoneItem({ milestone, isCurrent, isPast }) {
  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '12px 0',
      borderBottom: '1px solid var(--border)',
      opacity: isPast ? 0.6 : 1,
    }}>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: isPast ? 'var(--status-completed)' : isCurrent ? 'var(--accent)' : 'var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: '700', color: 'white',
          flexShrink: 0,
          boxShadow: isCurrent ? '0 0 0 4px var(--accent-dim)' : 'none',
        }}>
          {isPast ? '✓' : milestone.week}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: isCurrent ? 'var(--accent-light)' : 'var(--text-primary)' }}>{milestone.title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{milestone.description}</div>
        <div style={{ fontSize: '11px', color: isPast ? 'var(--status-completed)' : isCurrent ? 'var(--accent)' : 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>
          {isPast ? 'Completed' : isCurrent ? '← Current' : `Week ${milestone.week}`}
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ tasks }) {
  const recent = [...tasks]
    .filter(t => t.status !== 'Not Started')
    .slice(0, 6);

  return (
    <div>
      {recent.map((task, i) => (
        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(task.status), flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="truncate" style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{task.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{task.category} · {task.status}</div>
          </div>
          <span className="badge" style={{ background: `${getCategoryColor(task.category)}20`, color: getCategoryColor(task.category), flexShrink: 0 }}>
            {task.category}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeamWorkload({ tasks }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {TEAM_MEMBERS.map(member => {
        const memberTasks = tasks.filter(t => t.assignee === member.id);
        const done = memberTasks.filter(t => t.status === 'Completed').length;
        const inProg = memberTasks.filter(t => t.status === 'In Progress').length;
        return (
          <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar" style={{ background: member.color }}>{member.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{member.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{done}/{memberTasks.length} done</span>
              </div>
              <div className="progress-bar" style={{ height: '4px' }}>
                <div className="progress-fill" style={{
                  width: `${memberTasks.length ? (done / memberTasks.length) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${member.color}, ${member.color}aa)`,
                }} />
              </div>
            </div>
            {inProg > 0 && (
              <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', flexShrink: 0 }}>{inProg} active</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const blocked = tasks.filter(t => t.status === 'Blocked').length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;
  const overallPct = Math.round((completed / total) * 100);

  const upcomingMilestones = MILESTONES.filter(m => m.week >= CURRENT_WEEK).slice(0, 4);
  const pastMilestones = MILESTONES.filter(m => m.week < CURRENT_WEEK);

  const priorityCritical = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length;

  return (
    <div className="fade-in" style={{ padding: '28px', maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Project Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>E-Commerce Launch · Week 3 of 10 · Target: Go-Live in 7 weeks</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Overall Progress" value={`${overallPct}%`} sub={`${completed} of ${total} tasks completed`} color="var(--accent-light)" icon="🎯" />
        <StatCard label="In Progress" value={inProgress} sub="Actively being worked on" color="#6366f1" icon="⚡" />
        <StatCard label="Completed" value={completed} sub={`${notStarted} tasks remaining`} color="#10b981" icon="✅" />
        <StatCard label="Blocked" value={blocked} sub="Need immediate attention" color={blocked > 0 ? '#ef4444' : '#5c6380'} icon="⚠️" />
        <StatCard label="Critical Tasks" value={priorityCritical} sub="High-priority items pending" color={priorityCritical > 0 ? '#f97316' : '#5c6380'} icon="🔥" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '20px' }}>
        {/* Category Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Progress by Category</h2>
            <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
              {overallPct}% overall
            </span>
          </div>
          {CATEGORIES.map(cat => (
            <CategoryProgress key={cat} category={cat} tasks={tasks} />
          ))}
        </div>

        {/* Milestones */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Milestones</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>10-week launch timeline</p>
          <div>
            {pastMilestones.map(m => <MilestoneItem key={m.id} milestone={m} isPast={true} isCurrent={false} />)}
            {MILESTONES.filter(m => m.week >= CURRENT_WEEK).map((m, i) => (
              <MilestoneItem key={m.id} milestone={m} isPast={false} isCurrent={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Active Tasks</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Tasks currently in progress or completed</p>
          <RecentActivity tasks={tasks} />
        </div>

        {/* Team Workload */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Team Workload</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Task completion per team member</p>
          <TeamWorkload tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

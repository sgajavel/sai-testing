import { useState } from 'react';
import './index.css';
import { INITIAL_TASKS } from './data/projectData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import Tasks from './components/Tasks';
import Team from './components/Team';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleUpdateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleAddTask = (task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} />;
      case 'timeline':
        return <Timeline tasks={tasks} onUpdateTask={handleUpdateTask} />;
      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'team':
        return <Team tasks={tasks} />;
      default:
        return <Dashboard tasks={tasks} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} tasks={tasks} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {renderView()}
      </main>
    </div>
  );
}

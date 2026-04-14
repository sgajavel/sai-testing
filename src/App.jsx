import { useState, useCallback } from 'react';
import './index.css';
import { INITIAL_JOBS, INITIAL_CANDIDATES } from './data/hiringData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Jobs from './components/Jobs';
import Pipeline from './components/Pipeline';
import CandidateModal from './components/CandidateModal';
import JobModal from './components/JobModal';

export default function App() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [activeView, setActiveView] = useState('dashboard');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const handleUpdateCandidate = useCallback((id, updates) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const handleAddCandidate = useCallback((candidate) => {
    setCandidates(prev => [...prev, { ...candidate, id: `c-${Date.now()}` }]);
  }, []);

  const handleDeleteCandidate = useCallback((id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    setSelectedCandidateId(null);
  }, []);

  const handleAddJob = useCallback((jobData) => {
    setJobs(prev => [...prev, {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    }]);
  }, []);

  const handleUpdateJob = useCallback((id, updates) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) ?? null;
  const selectedCandidateJob = selectedCandidate ? jobs.find(j => j.id === selectedCandidate.jobId) : null;

  const openJobModal = (job = null) => { setEditingJob(job); setShowJobModal(true); };
  const closeJobModal = () => { setShowJobModal(false); setEditingJob(null); };
  const goToPipeline = (jobId = 'all') => { setJobFilter(jobId); setActiveView('pipeline'); };

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        jobs={jobs}
        candidates={candidates}
      />

      <main className="app-main">
        {activeView === 'dashboard' && (
          <Dashboard
            jobs={jobs}
            candidates={candidates}
            onViewPipeline={goToPipeline}
            onViewJobs={() => setActiveView('jobs')}
          />
        )}
        {activeView === 'jobs' && (
          <Jobs
            jobs={jobs}
            candidates={candidates}
            onAddJob={() => openJobModal(null)}
            onEditJob={(job) => openJobModal(job)}
            onUpdateJob={handleUpdateJob}
            onViewPipeline={goToPipeline}
          />
        )}
        {activeView === 'pipeline' && (
          <Pipeline
            jobs={jobs}
            candidates={candidates}
            jobFilter={jobFilter}
            onFilterChange={setJobFilter}
            onUpdateCandidate={handleUpdateCandidate}
            onSelectCandidate={setSelectedCandidateId}
            onAddCandidate={handleAddCandidate}
          />
        )}
      </main>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          job={selectedCandidateJob}
          onClose={() => setSelectedCandidateId(null)}
          onUpdate={(updates) => handleUpdateCandidate(selectedCandidateId, updates)}
          onDelete={() => handleDeleteCandidate(selectedCandidateId)}
        />
      )}

      {showJobModal && (
        <JobModal
          job={editingJob}
          onClose={closeJobModal}
          onSave={(data) => {
            if (editingJob) {
              handleUpdateJob(editingJob.id, data);
            } else {
              handleAddJob(data);
            }
            closeJobModal();
          }}
        />
      )}
    </div>
  );
}

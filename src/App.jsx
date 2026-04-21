import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './index.css';
import { sampleRules } from './data/sampleRules';
import Dashboard from './components/Dashboard';
import ReviewWorkflow from './components/ReviewWorkflow';
import DecisionOutput from './components/DecisionOutput';

const DECISION_TO_STATUS = {
  APPROVE: 'approved',
  REJECT: 'rejected',
  REQUEST_MORE_INFO: 'needs_review',
};

export default function App() {
  const [rules, setRules] = useState(sampleRules);
  const [decisions, setDecisions] = useState({});
  const [analyses, setAnalyses] = useState({});

  function handleDecisionFinalized(ruleId, decisionData, analysis) {
    setDecisions(prev => ({ ...prev, [ruleId]: decisionData }));
    setAnalyses(prev => ({ ...prev, [ruleId]: analysis }));
    setRules(prev =>
      prev.map(r =>
        r.id === ruleId
          ? { ...r, status: DECISION_TO_STATUS[decisionData.finalDecision] || r.status }
          : r
      )
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard rules={rules} />} />
        <Route
          path="/review/:ruleId"
          element={
            <ReviewWorkflow
              rules={rules}
              onDecisionFinalized={handleDecisionFinalized}
            />
          }
        />
        <Route
          path="/decision/:ruleId"
          element={
            <DecisionOutputWrapper
              rules={rules}
              decisions={decisions}
              analyses={analyses}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function DecisionOutputWrapper({ rules, decisions, analyses }) {
  const { ruleId } = useParams();
  const rule = rules.find(r => r.id === ruleId);
  const decisionData = decisions[ruleId];
  const analysis = analyses[ruleId];
  return <DecisionOutput decisionData={decisionData} rule={rule} analysis={analysis} />;
}

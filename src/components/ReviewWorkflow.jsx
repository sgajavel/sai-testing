import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, Building2, Tag } from 'lucide-react';
import AIAnalysisPanel from './AIAnalysisPanel';
import HumanReviewPanel from './HumanReviewPanel';
import { analyzeRule } from '../utils/aiAnalysis';

export default function ReviewWorkflow({ rules, onDecisionFinalized }) {
  const { ruleId } = useParams();
  const navigate = useNavigate();

  const rule = rules.find(r => r.id === ruleId);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rule) return;
    setAnalysis(null);
    setError(null);
    setLoading(true);

    analyzeRule(
      rule.id,
      rule.ruleText,
      rule.insurerRationale,
      rule.category,
      rule.insurer,
      rule.dateSubmitted
    )
      .then(result => setAnalysis(result))
      .catch(err => setError(err.message || 'Failed to analyze rule. Check your API key.'))
      .finally(() => setLoading(false));
  }, [ruleId]);

  function handleFinalize(decisionData) {
    onDecisionFinalized(ruleId, decisionData, analysis);
    navigate(`/decision/${ruleId}`);
  }

  if (!rule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-semibold">Rule not found: {ruleId}</p>
          <button onClick={() => navigate('/')} className="mt-3 text-blue-600 hover:underline text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">Review: {rule.id}</span>
          </div>
          <span className="ml-auto text-sm text-gray-400">{rule.insurer}</span>
        </div>
      </header>

      {/* 3-column grid */}
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* LEFT: Rule Details */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Rule Details</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Meta */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4 shrink-0 text-gray-400" />
                <span className="font-mono font-bold text-blue-700">{rule.id}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4 shrink-0 text-gray-400" />
                <span>{rule.insurer}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                <span>{rule.dateSubmitted}</span>
              </div>
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  {rule.category}
                </span>
              </div>
            </div>

            {/* Rule text */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Proposed Rule</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-800 leading-relaxed">{rule.ruleText}</p>
              </div>
            </div>

            {/* Insurer rationale */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Insurer Rationale</p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-sm text-gray-700 leading-relaxed italic">"{rule.insurerRationale}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: AI Analysis */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">AI Analysis</h2>
            {loading && (
              <span className="text-xs text-blue-600 font-medium animate-pulse">Analyzing...</span>
            )}
          </div>
          <div className="p-4">
            <AIAnalysisPanel analysis={analysis} loading={loading} error={error} />
          </div>
        </div>

        {/* RIGHT: Human Review */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Analyst Review</h2>
          </div>
          <div className="p-4">
            <HumanReviewPanel
              analysis={analysis}
              onFinalize={handleFinalize}
              ruleId={ruleId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

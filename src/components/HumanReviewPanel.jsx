import { useState } from 'react';
import { Bot, User, AlertCircle, CheckCircle, XCircle, HelpCircle, ChevronRight } from 'lucide-react';

const DECISION_CONFIG = {
  APPROVE: { label: 'Approve', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  REJECT: { label: 'Reject', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: <XCircle className="w-5 h-5 text-red-600" /> },
  REQUEST_MORE_INFO: { label: 'Request More Info', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: <HelpCircle className="w-5 h-5 text-yellow-600" /> },
};

const CONFIDENCE_BADGE = {
  High: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-gray-100 text-gray-700',
};

export default function HumanReviewPanel({ analysis, onFinalize, ruleId }) {
  const [analystDecision, setAnalystDecision] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const recommendation = analysis?.recommendation;
  const aiDecision = recommendation?.decision;
  const isOverride = analystDecision && analystDecision !== aiDecision && analystDecision !== 'AI';

  function handleFinalize() {
    if (!analystDecision) return;
    const finalDecision = analystDecision === 'AI' ? aiDecision : analystDecision;
    setSubmitted(true);
    onFinalize({
      ruleId,
      finalDecision,
      analystNotes: notes,
      aiDecision,
      isOverride: analystDecision !== 'AI',
      timestamp: new Date().toISOString(),
    });
  }

  const aiConfig = aiDecision ? DECISION_CONFIG[aiDecision] : null;

  return (
    <div className="space-y-5">
      {/* AI Recommendation card */}
      {recommendation ? (
        <div className={`border rounded-xl p-4 ${aiConfig?.bg || 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">AI Recommendation</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {aiConfig?.icon}
            <span className={`font-bold text-lg ${aiConfig?.color || 'text-gray-700'}`}>
              {aiDecision?.replace('_', ' ')}
            </span>
            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${CONFIDENCE_BADGE[recommendation.confidence] || ''}`}>
              {recommendation.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{recommendation.reasoning}</p>
          {recommendation.next_steps && (
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Next Steps</p>
              <p className="text-sm text-gray-600">{recommendation.next_steps}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-sm text-gray-500 text-center">
          AI analysis not yet available
        </div>
      )}

      {/* Override indicator */}
      {isOverride && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Your decision differs from the AI recommendation
        </div>
      )}

      {/* Analyst decision */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Analyst Decision</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Decision</label>
            <select
              value={analystDecision}
              onChange={e => setAnalystDecision(e.target.value)}
              disabled={submitted || !analysis}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-60"
            >
              <option value="">— Select a decision —</option>
              <option value="AI">Accept AI Recommendation</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
              <option value="REQUEST_MORE_INFO">Request More Information</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Analyst Notes
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={submitted}
              placeholder="Add your observations, justification, or any additional context..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-60"
            />
          </div>

          <button
            onClick={handleFinalize}
            disabled={!analystDecision || submitted || !analysis}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Finalize Decision
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

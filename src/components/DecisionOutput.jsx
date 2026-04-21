import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowLeft, RotateCcw, ClipboardList, Search } from 'lucide-react';

const DECISION_CONFIG = {
  APPROVE: {
    label: 'APPROVED',
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    banner: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    statusKey: 'approved',
  },
  REJECT: {
    label: 'REJECTED',
    icon: <XCircle className="w-8 h-8 text-red-600" />,
    banner: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    statusKey: 'rejected',
  },
  REQUEST_MORE_INFO: {
    label: 'MORE INFO REQUESTED',
    icon: <HelpCircle className="w-8 h-8 text-yellow-600" />,
    banner: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    statusKey: 'needs_review',
  },
};

export default function DecisionOutput({ decisionData, rule, analysis }) {
  const navigate = useNavigate();

  if (!decisionData || !rule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No decision data available.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const config = DECISION_CONFIG[decisionData.finalDecision] || DECISION_CONFIG.REQUEST_MORE_INFO;
  const date = new Date(decisionData.timestamp).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Decision: {rule.id}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Decision Banner */}
        <div className={`border-2 rounded-xl p-6 ${config.banner}`}>
          <div className="flex items-center gap-4">
            {config.icon}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Decision Finalized</p>
              <p className={`text-2xl font-bold ${config.badge.includes('green') ? 'text-green-800' : config.badge.includes('red') ? 'text-red-800' : 'text-yellow-800'}`}>
                {config.label}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-600">Rule ID: </span>
              <span className="font-mono text-gray-800">{rule.id}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Insurer: </span>
              <span className="text-gray-800">{rule.insurer}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Category: </span>
              <span className="text-gray-800">{rule.category}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Decided: </span>
              <span className="text-gray-800">{date}</span>
            </div>
          </div>
        </div>

        {/* Rationale */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800">Rationale</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            {analysis?.recommendation?.reasoning && (
              <div>
                <p className="font-semibold text-gray-600 mb-1">AI Analysis Summary</p>
                <p>{analysis.recommendation.reasoning}</p>
              </div>
            )}
            {decisionData.analystNotes && (
              <div>
                <p className="font-semibold text-gray-600 mb-1">Analyst Notes</p>
                <p className="whitespace-pre-wrap">{decisionData.analystNotes}</p>
              </div>
            )}
            {!analysis?.recommendation?.reasoning && !decisionData.analystNotes && (
              <p className="text-gray-400 italic">No rationale provided.</p>
            )}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800">Audit Trail</h2>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="font-semibold text-gray-500">AI Suggested</dt>
              <dd className="text-gray-800 font-medium">{decisionData.aiDecision?.replace('_', ' ') || '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Final Decision</dt>
              <dd className="text-gray-800 font-medium">{decisionData.finalDecision?.replace('_', ' ') || '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Override</dt>
              <dd className={`font-medium ${decisionData.isOverride ? 'text-orange-700' : 'text-green-700'}`}>
                {decisionData.isOverride ? 'Yes — analyst overrode AI' : 'No — accepted AI recommendation'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">AI Confidence</dt>
              <dd className="text-gray-800">{analysis?.recommendation?.confidence || '—'}</dd>
            </div>
          </dl>
          {decisionData.analystNotes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <dt className="font-semibold text-gray-500 text-sm mb-1">Analyst Notes</dt>
              <dd className="text-sm text-gray-700 whitespace-pre-wrap">{decisionData.analystNotes}</dd>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/review/${rule.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Review Another Rule
          </button>
        </div>
      </main>
    </div>
  );
}

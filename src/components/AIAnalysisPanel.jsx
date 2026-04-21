import { useState } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  FileText, Search, Flag, Loader2
} from 'lucide-react';
import { evaluationCriteria } from '../data/evaluationCriteria';

const STATUS_ICON = {
  MEETS: <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />,
  FAILS: <XCircle className="w-4 h-4 text-red-600 shrink-0" />,
  NEEDS_CLARIFICATION: <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />,
};

const STATUS_CLASSES = {
  MEETS: 'border-green-200 bg-green-50',
  FAILS: 'border-red-200 bg-red-50',
  NEEDS_CLARIFICATION: 'border-yellow-200 bg-yellow-50',
};

const STATUS_TEXT = {
  MEETS: 'text-green-800',
  FAILS: 'text-red-800',
  NEEDS_CLARIFICATION: 'text-yellow-800',
};

const SEVERITY_BADGE = {
  High: 'bg-red-100 text-red-800 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Low: 'bg-blue-100 text-blue-800 border border-blue-200',
};

const SEVERITY_DOT = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
          {icon}
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function AIAnalysisPanel({ analysis, loading, error }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="font-medium">Running AI analysis...</p>
        <p className="text-sm text-gray-400">This may take 15–30 seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6">
        <XCircle className="w-8 h-8 text-red-500" />
        <p className="font-semibold text-gray-800">Analysis failed</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
        <FileText className="w-8 h-8" />
        <p className="text-sm">Analysis will appear here after loading</p>
      </div>
    );
  }

  const { extracted_details, criterion_assessment, similar_rules, flagged_concerns } = analysis;

  return (
    <div className="space-y-4">
      {/* Extracted Details */}
      <Section title="Extracted Details" icon={<FileText className="w-4 h-4 text-blue-600" />}>
        <dl className="space-y-2 text-sm">
          {[
            { label: 'Who Affected', value: extracted_details?.who_affected },
            { label: 'Conditions', value: extracted_details?.conditions },
            { label: 'Stated Rationale', value: extracted_details?.stated_rationale },
            { label: 'Category', value: extracted_details?.category },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="font-semibold text-gray-600">{label}</dt>
              <dd className="text-gray-700 mt-0.5">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Criteria Assessment */}
      <Section title="Criteria Assessment" icon={<CheckCircle className="w-4 h-4 text-blue-600" />}>
        <div className="space-y-3">
          {evaluationCriteria.map(criterion => {
            const assessment = criterion_assessment?.[criterion.key];
            if (!assessment) return null;
            const status = assessment.status || 'NEEDS_CLARIFICATION';
            return (
              <div
                key={criterion.key}
                className={`border rounded-lg p-3 ${STATUS_CLASSES[status] || STATUS_CLASSES.NEEDS_CLARIFICATION}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {STATUS_ICON[status]}
                  <span className={`font-semibold text-sm ${STATUS_TEXT[status] || ''}`}>
                    {criterion.name}
                  </span>
                  <span className={`ml-auto text-xs font-bold uppercase tracking-wide ${STATUS_TEXT[status] || ''}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 ml-6">{assessment.reasoning}</p>
                {assessment.supporting_evidence && (
                  <p className="text-xs text-gray-500 ml-6 mt-1 italic">{assessment.supporting_evidence}</p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Similar Rules */}
      <Section
        title={`Similar Rules (${similar_rules?.length || 0})`}
        icon={<Search className="w-4 h-4 text-blue-600" />}
        defaultOpen={false}
      >
        {!similar_rules?.length ? (
          <p className="text-sm text-gray-500">No similar rules identified.</p>
        ) : (
          <div className="space-y-3">
            {similar_rules.map((rule, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-blue-700">{rule.rule_id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Similarity: <strong>{Math.round((rule.similarity_score || 0) * 100)}%</strong>
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      rule.precedent_outcome?.toLowerCase().includes('approv')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rule.precedent_outcome}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700"><span className="font-medium">Why similar:</span> {rule.why_similar}</p>
                {rule.key_difference && (
                  <p className="text-gray-600 mt-0.5"><span className="font-medium">Key difference:</span> {rule.key_difference}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Flagged Concerns */}
      <Section
        title={`Flagged Concerns (${flagged_concerns?.length || 0})`}
        icon={<Flag className="w-4 h-4 text-red-500" />}
      >
        {!flagged_concerns?.length ? (
          <p className="text-sm text-gray-500">No concerns flagged.</p>
        ) : (
          <div className="space-y-3">
            {flagged_concerns.map((concern, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[concern.severity] || 'bg-gray-400'}`} />
                  <span className="font-semibold text-sm text-gray-800">{concern.concern_type}</span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${SEVERITY_BADGE[concern.severity] || ''}`}>
                    {concern.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 ml-4">{concern.description}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

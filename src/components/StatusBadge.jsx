const STATUS_CONFIG = {
  pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
  approved: { label: 'Approved', classes: 'bg-green-100 text-green-800 border border-green-200' },
  rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-800 border border-red-200' },
  needs_review: { label: 'Needs Review', classes: 'bg-orange-100 text-orange-800 border border-orange-200' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}

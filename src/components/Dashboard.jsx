import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Shield, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Dashboard({ rules }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = rules.filter(rule => {
    const matchesSearch =
      rule.id.toLowerCase().includes(search.toLowerCase()) ||
      rule.insurer.toLowerCase().includes(search.toLowerCase()) ||
      rule.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = rules.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regulatory Review Dashboard</h1>
              <p className="text-sm text-gray-500">AI-assisted auto insurance underwriting decline rule evaluation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Rules', value: rules.length, color: 'text-gray-900', bg: 'bg-white' },
            { label: 'Pending', value: counts.pending || 0, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Approved', value: counts.approved || 0, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Rejected', value: counts.rejected || 0, color: 'text-red-700', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl border border-gray-200 p-4`}>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Rule ID, insurer, or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">Rule ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Insurer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rule Summary</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Submitted</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No rules match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(rule => (
                    <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-blue-700">{rule.id}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{rule.insurer}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {rule.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs">
                        <p className="truncate" title={rule.ruleText}>{rule.ruleText}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{rule.dateSubmitted}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={rule.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/review/${rule.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Review
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {rules.length} rules
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  Clock,
  Sparkles,
  Bot,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  Play,
  ArrowUpRight,
  HelpCircle,
  FileText,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { SprintTicket, Pod } from '../types';

interface SprintHealthTabProps {
  tickets: SprintTicket[];
  selectedPod: Pod;
  setSelectedPod: (pod: Pod) => void;
  onRunAudit: () => void;
  isAuditRunning: boolean;
  onInspectPrd: (prdCode: string) => void;
}

export const SprintHealthTab: React.FC<SprintHealthTabProps> = ({
  tickets,
  selectedPod,
  setSelectedPod,
  onRunAudit,
  isAuditRunning,
  onInspectPrd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<SprintTicket | null>(null);

  const pods: Pod[] = [
    'All Pods',
    'Student Discovery',
    'Booking & Guarantors',
    'Supply & PBSA Sync',
  ];

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesPod = selectedPod === 'All Pods' || t.pod === selectedPod;
      const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesQuery =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.spilloverRootCause.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPod && matchesStatus && matchesQuery;
    });
  }, [tickets, selectedPod, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Blocked':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case 'Stale':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'In Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPrdScoreBadge = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200 font-bold';
  };

  return (
    <div className="space-y-6">
      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sprint Spillover Rate
            </span>
            <span className="inline-flex items-center space-x-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-6.2% vs W46</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">11.4%</span>
            <span className="text-xs text-slate-400 font-medium">Target: &lt;12%</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            AI root-cause triage reduced unresolved spec ambiguities before sprint kick-off.
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Idea-to-Release Cycle Time
            </span>
            <span className="inline-flex items-center space-x-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-1.8 days</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">6.4 days</span>
            <span className="text-xs text-slate-400 font-medium">Org Avg: 8.2d</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            Automated PRD gap detection cut QA-to-dev clarification roundtrips by 40%.
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              PM Admin Hours Saved
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#ED3A56] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <Sparkles className="w-3 h-3" />
              <span>n8n + Claude</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">4.2 hrs</span>
            <span className="text-xs text-slate-400 font-medium">/ week per PM</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            Autonomous status checks, blocker summaries, and automated stakeholder digests.
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Queries Resolved by Bot
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              <Bot className="w-3 h-3" />
              <span>48 / 63 Slack Qs</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">76%</span>
            <span className="text-xs text-slate-400 font-medium">Zero PM Interruption</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            Vectorized Amber PRDs answer repetitive questions across Sales, Ops, and CX.
          </p>
        </div>
      </div>

      {/* Primary Action Banner & Pod Filters */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Pod Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Pod:
          </span>
          {pods.map((pod) => {
            const count =
              pod === 'All Pods'
                ? tickets.length
                : tickets.filter((t) => t.pod === pod).length;
            const isSelected = selectedPod === pod;

            return (
              <button
                key={pod}
                onClick={() => setSelectedPod(pod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{pod}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Prominent Run Weekly Sprint Audit (n8n) Button */}
        <button
          onClick={onRunAudit}
          disabled={isAuditRunning}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ED3A56] hover:bg-[#D82945] active:scale-[0.98] transition-all shadow-md hover:shadow-lg shadow-rose-500/20 disabled:opacity-75 disabled:pointer-events-none"
        >
          {isAuditRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Backlog &amp; Executing n8n Agent...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run Weekly Sprint Audit (n8n)</span>
            </>
          )}
        </button>
      </div>

      {/* Ticket Table Controls (Search + Status Filter) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, assignees, or AI root causes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56] bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20"
          >
            <option value="all">All Statuses ({tickets.length})</option>
            <option value="blocked">Blocked</option>
            <option value="stale">Stale (&gt;48h)</option>
            <option value="in progress">In Progress</option>
            <option value="in review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* 15 Realistic Amber Sprint Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-3">Pod</th>
                <th className="py-3 px-2 text-center">SP</th>
                <th className="py-3 px-3">Assignee</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Hours Stale</th>
                <th className="py-3 px-3 text-center">PRD Score</th>
                <th className="py-3 px-4">AI Spillover Root Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.map((t) => {
                const isVeryStale = t.hoursStale >= 48;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setSelectedTicketForDetail(t)}
                  >
                    {/* Ticket Key & Title */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="flex items-start space-x-2">
                        <span className="font-mono font-semibold text-slate-500 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {t.id}
                        </span>
                        <div className="font-medium text-slate-900 group-hover:text-[#ED3A56] transition-colors line-clamp-1">
                          {t.title}
                        </div>
                      </div>
                    </td>

                    {/* Pod */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {t.pod}
                      </span>
                    </td>

                    {/* Story Points */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <span className="font-mono font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                        {t.storyPoints}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img
                          src={t.assignee.avatar}
                          alt={t.assignee.name}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="text-slate-700 text-xs font-medium">
                          {t.assignee.name.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] border font-medium ${getStatusBadge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Hours Stale */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isVeryStale ? 'text-rose-600 font-bold' : 'text-slate-600'
                          }`}
                        >
                          {t.hoursStale}h
                        </span>
                        {isVeryStale && (
                          <span
                            title="Stale >48h — Queued for automated HITL Slack Nudge"
                            className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"
                          />
                        )}
                      </div>
                    </td>

                    {/* PRD Score */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-mono border ${getPrdScoreBadge(
                          t.prdScore
                        )}`}
                      >
                        {t.prdScore}/100
                      </span>
                    </td>

                    {/* AI Spillover Root Cause */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {t.spilloverRootCause.category}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono font-medium">
                            {t.spilloverRootCause.aiConfidence}% AI match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight">
                          {t.spilloverRootCause.summary}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filteredTickets.length}</strong> of{' '}
            {tickets.length} tickets across Pune Product Org
          </span>
          <span className="text-[11px] text-slate-400">
            Click any row to inspect ticket details &amp; root cause breakdown
          </span>
        </div>
      </div>

      {/* Ticket Detail Drawer/Modal */}
      {selectedTicketForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold bg-rose-50 text-[#ED3A56] px-2 py-0.5 rounded">
                    {selectedTicketForDetail.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedTicketForDetail.pod}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedTicketForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicketForDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assignee</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTicketForDetail.assignee.name} ({selectedTicketForDetail.assignee.role})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status &amp; Stale</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTicketForDetail.status} • {selectedTicketForDetail.hoursStale}h inactive
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Story Points</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedTicketForDetail.storyPoints} SP (Priority: {selectedTicketForDetail.priority})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">PRD Hygiene</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedTicketForDetail.prdScore} / 100 Readiness
                  </span>
                </div>
              </div>

              {/* AI Spillover Root Cause Detail */}
              <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ED3A56] uppercase text-[10px] tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claude 3.5 Sonnet Spillover Analysis</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Confidence: {selectedTicketForDetail.spilloverRootCause.aiConfidence}%
                  </span>
                </div>
                <div className="font-semibold text-slate-800">
                  Category: {selectedTicketForDetail.spilloverRootCause.category}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedTicketForDetail.spilloverRootCause.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Amber Ops AI Control Tower</span>
              <button
                onClick={() => setSelectedTicketForDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

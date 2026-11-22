import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Edit3,
  Send,
  Trash2,
  Sparkles,
  Bot,
  Hash,
  AlertTriangle,
  History,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SlackNudge, AuditFeedItem } from '../types';
import { EditNudgeModal } from './EditNudgeModal';

interface SlackHitlTabProps {
  nudges: SlackNudge[];
  auditFeed: AuditFeedItem[];
  onApproveNudge: (nudgeId: string) => void;
  onEditAndDispatchNudge: (nudgeId: string, message: string, targetChannel: string) => void;
  onDismissNudge: (nudgeId: string) => void;
  isDispatching: boolean;
}

export const SlackHitlTab: React.FC<SlackHitlTabProps> = ({
  nudges,
  auditFeed,
  onApproveNudge,
  onEditAndDispatchNudge,
  onDismissNudge,
  isDispatching,
}) => {
  const [editingNudge, setEditingNudge] = useState<SlackNudge | null>(null);
  const [filterView, setFilterView] = useState<'pending' | 'all'>('pending');

  const pendingNudges = nudges.filter((n) => n.status === 'Pending Review');
  const displayedNudges = filterView === 'pending' ? pendingNudges : nudges;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900">
              Slack Approval Queue (Human-In-The-Loop)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            n8n automated cron checks tickets inactive for &gt;48 hours or blocked by third-party APIs (Textract, Unite PMS). Review, edit, and dispatch Slack nudges directly to engineering channels with one click.
          </p>
        </div>

        {/* Pending Counter */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <Bot className="w-5 h-5 text-[#ED3A56]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Awaiting PM Approval</span>
            <span className="text-sm font-extrabold text-slate-900">
              {pendingNudges.length} Pending Nudges
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Nudges List (Left 65%) + Live Audit Feed (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Nudges Queue */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterView('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterView === 'pending'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pending Review ({pendingNudges.length})
              </button>
              <button
                onClick={() => setFilterView('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterView === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All History ({nudges.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Auto-refreshed via n8n cron
            </span>
          </div>

          {/* Nudge Cards */}
          {displayedNudges.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Queue is Clear!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All stale tickets have been reviewed or nudged. The n8n agent will draft new nudges during the next scheduled hourly scan.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedNudges.map((nudge) => {
                const isPending = nudge.status === 'Pending Review';
                const isSent = nudge.status.includes('Sent') || nudge.status.includes('Dispatched');

                return (
                  <div
                    key={nudge.id}
                    className={`bg-white rounded-xl border transition-all p-5 shadow-card space-y-4 ${
                      isPending ? 'border-slate-200 hover:border-slate-300' : 'border-slate-100 opacity-80'
                    }`}
                  >
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold bg-rose-50 text-[#ED3A56] px-2 py-0.5 rounded">
                          {nudge.ticketId}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{nudge.pod}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-rose-600 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{nudge.hoursStale}h Stale</span>
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : isSent
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {nudge.status}
                      </span>
                    </div>

                    {/* Ticket Title */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {nudge.ticketTitle}
                    </h3>

                    {/* AI Draft Reason */}
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#ED3A56] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Trigger Reason: </strong>
                        {nudge.aiDraftReason}
                      </div>
                    </div>

                    {/* Slack Preview Bubble */}
                    <div className="bg-[#1A1D21] text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-sans">
                        <div className="flex items-center space-x-2">
                          <img
                            src={nudge.assigneeAvatar}
                            alt={nudge.assigneeName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-slate-300 font-medium">To: @{nudge.assigneeName.toLowerCase().replace(' ', '.')}</span>
                        </div>
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Hash className="w-3 h-3 text-slate-500" />
                          <span>{nudge.targetChannel}</span>
                        </span>
                      </div>

                      <div className="whitespace-pre-wrap text-slate-200 text-[11px]">
                        {nudge.draftedMessage}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {nudge.dispatchedAt ? `Dispatched at ${nudge.dispatchedAt}` : 'Awaiting PM verification'}
                      </span>

                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onDismissNudge(nudge.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Dismiss Nudge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingNudge(nudge)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Message</span>
                          </button>

                          <button
                            onClick={() => onApproveNudge(nudge.id)}
                            disabled={isDispatching}
                            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#ED3A56] text-white hover:bg-[#D82945] transition-colors shadow-sm disabled:opacity-75"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Approve &amp; Send Nudge</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Delivered to Slack Channel</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Audit Feed & Compliance */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Live Audit Feed (HITL Log)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                Live Feed
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Every approved nudge and edited draft is cryptographically recorded for sprint governance and retro analysis.
            </p>

            {/* Audit List */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {auditFeed.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No actions logged yet in this session.
                </div>
              ) : (
                auditFeed.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">{item.actor}</span>
                      <span className="font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-800 font-medium text-[11px] leading-snug">
                      {item.action}
                    </p>
                    <p className="text-slate-500 text-[10px] line-clamp-2 leading-tight">
                      {item.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Nudge Modal */}
      <EditNudgeModal
        nudge={editingNudge}
        onClose={() => setEditingNudge(null)}
        onSaveAndDispatch={onEditAndDispatchNudge}
      />
    </div>
  );
};

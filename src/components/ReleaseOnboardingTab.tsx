import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Send,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { OnboardingTask, ReleaseNoteTicket } from '../types';
import { COMPLETED_RELEASE_TICKETS, SLACK_RELEASE_DIGEST_TEMPLATE } from '../data/mockReleaseNotes';
import { AI_QA_KNOWLEDGE_BASE, AiQaEntry } from '../data/onboardingData';

interface ReleaseOnboardingTabProps {
  onboardingTasks: OnboardingTask[];
  onToggleTask: (taskId: string) => void;
  onInspectPrd: (prdCode: string) => void;
}

export const ReleaseOnboardingTab: React.FC<ReleaseOnboardingTabProps> = ({
  onboardingTasks,
  onToggleTask,
  onInspectPrd,
}) => {
  const [audienceFilter, setAudienceFilter] = useState<'all' | 'customer' | 'internal'>('all');
  const [copiedRelease, setCopiedRelease] = useState(false);
  const [viewMarkdown, setViewMarkdown] = useState(false);

  // AI Q&A states
  const [qaQuery, setQaQuery] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<AiQaEntry | null>(AI_QA_KNOWLEDGE_BASE[0]);
  const [isSearchingQa, setIsSearchingQa] = useState(false);

  const completedCount = onboardingTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / onboardingTasks.length) * 100);

  const filteredTickets = COMPLETED_RELEASE_TICKETS.filter((t) => {
    if (audienceFilter === 'customer') return t.isCustomerFacing;
    if (audienceFilter === 'internal') return !t.isCustomerFacing;
    return true;
  });

  const handleCopySlackDigest = () => {
    navigator.clipboard.writeText(SLACK_RELEASE_DIGEST_TEMPLATE);
    setCopiedRelease(true);
    setTimeout(() => setCopiedRelease(false), 2000);
  };

  const handleQaSearch = (queryText: string) => {
    setQaQuery(queryText);
    if (!queryText.trim()) return;

    setIsSearchingQa(true);
    setTimeout(() => {
      const qLower = queryText.toLowerCase();
      // Match keywords or questions
      const found = AI_QA_KNOWLEDGE_BASE.find(
        (entry) =>
          entry.question.toLowerCase().includes(qLower) ||
          entry.keywords.some((kw) => qLower.includes(kw)) ||
          entry.answer.toLowerCase().includes(qLower)
      );

      if (found) {
        setActiveAnswer(found);
      } else {
        // Fallback dynamic answer from RAG
        setActiveAnswer({
          question: queryText,
          keywords: [],
          answer: `Based on current indexed Amber PRDs (PRD-101 through PRD-104), our platform coordinates booking workflows between student residents and PBSA providers (Unite Students, Scape, iQ) using event-driven microservices. For questions outside this index, please consult #pod-product-leads.`,
          citedPrd: 'Amber Product Org Central Spec Repository',
          section: '§General Architecture',
          confidence: 82,
        });
      }
      setIsSearchingQa(false);
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900">
              Release Notes Generator &amp; PM Onboarding Knowledge Ramp
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Auto-compiles completed sprint tickets into stakeholder digests for Sales, Ops, and Executive Slack, paired with an autonomous PRD citation search to ramp new APMs/PMs 3x faster.
          </p>
        </div>

        {/* Ramp Progress Pill */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <BookOpen className="w-5 h-5 text-[#ED3A56]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Onboarding Ramp</span>
            <span className="text-sm font-extrabold text-slate-900">
              {progressPercent}% Complete{' '}
              <span className="text-xs text-slate-400 font-normal">({completedCount}/{onboardingTasks.length} tasks)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Split Grid: Left 55% Release Notes, Right 45% PM Ramp & Q&A */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Auto-Generated Release Notes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
            {/* Header with Audience Filter & Copy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Sprint 2026-W47 Shipped
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Weekly Stakeholder Release Notes
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMarkdown(!viewMarkdown)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {viewMarkdown ? 'Rich View' : 'Raw Markdown'}
                </button>

                <button
                  onClick={handleCopySlackDigest}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ED3A56] text-white hover:bg-[#D82945] transition-colors shadow-sm"
                >
                  {copiedRelease ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy for Slack / Notion</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* View Mode Toggle: Raw Markdown vs Rich Card View */}
            {viewMarkdown ? (
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap border border-slate-800">
                {SLACK_RELEASE_DIGEST_TEMPLATE}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Audience Filter Pills */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-medium">Audience:</span>
                  {[
                    { id: 'all', label: 'All Updates' },
                    { id: 'customer', label: 'Customer-Facing Only' },
                    { id: 'internal', label: 'Internal Platform Ops' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setAudienceFilter(filter.id as any)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        audienceFilter === filter.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Shipped Tickets List */}
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[11px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                            {ticket.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded font-mono ${
                              ticket.category === 'Feature'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ticket.category === 'Improvement'
                                ? 'bg-blue-100 text-blue-800'
                                : ticket.category === 'Fix'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {ticket.category}
                          </span>
                          <span className="text-[11px] text-slate-500">{ticket.pod}</span>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {ticket.isCustomerFacing ? '🌐 Student Facing' : '⚙️ Internal Ops'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900">{ticket.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{ticket.summary}</p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Impact: {ticket.impactMetrics}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: PM Onboarding Ramp & AI Context Q&A */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Context Q&A Search Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3.5">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ED3A56]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  AI Context Q&amp;A • Indexed Amber PRDs
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ask anything about PBSA sync, student guarantor logic, or deposit escrow rules.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. How does PBSA inventory sync work?"
                value={qaQuery}
                onChange={(e) => setQaQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQaSearch(qaQuery)}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56] bg-slate-50/50"
              />
              <button
                onClick={() => handleQaSearch(qaQuery)}
                disabled={isSearchingQa}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#ED3A56] hover:bg-rose-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'How does PBSA inventory sync work?',
                'What is No-Visa No-Pay?',
                'How does multi-currency lock work?',
                'Why do tickets spillover?',
              ].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleQaSearch(pill)}
                  className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-left"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Active Answer Card with Citations */}
            {activeAnswer && (
              <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-xl text-xs space-y-2 mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Claude RAG Synthesis</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                    {activeAnswer.confidence}% Citation Match
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-normal">
                  {activeAnswer.answer}
                </p>

                {/* Source Citation Pill */}
                <div className="pt-2 border-t border-rose-100/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Source:</span>
                  <span className="inline-flex items-center space-x-1 text-[#ED3A56] font-semibold bg-white px-2 py-0.5 rounded border border-rose-200">
                    <FileText className="w-3 h-3" />
                    <span>{activeAnswer.citedPrd}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* New PM / APM Onboarding Ramp Tracker */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  New PM / APM Onboarding Ramp
                </h3>
                <p className="text-[11px] text-slate-500">Week 1–2 Mastery Checklist</p>
              </div>
              <span className="text-xs font-bold font-mono text-[#ED3A56] bg-rose-50 px-2 py-0.5 rounded-full">
                {progressPercent}%
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {onboardingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {task.description}
                    </p>
                    {task.docCitation && (
                      <span className="inline-block text-[10px] text-slate-400 mt-1 font-mono">
                        Ref: {task.docCitation}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

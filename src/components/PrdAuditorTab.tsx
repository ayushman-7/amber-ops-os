import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  Search,
} from 'lucide-react';
import { PrdAudit } from '../types';
import { PrdDetailModal } from './PrdDetailModal';

interface PrdAuditorTabProps {
  prds: PrdAudit[];
  onReindexPrd: (prdId: string) => void;
  reindexingIds: string[];
}

export const PrdAuditorTab: React.FC<PrdAuditorTabProps> = ({
  prds,
  onReindexPrd,
  reindexingIds,
}) => {
  const [selectedPrd, setSelectedPrd] = useState<PrdAudit | null>(null);
  const [filterHygiene, setFilterHygiene] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredPrds = prds.filter((p) => {
    const matchesHygiene =
      filterHygiene === 'all' ||
      p.hygieneStatus.toLowerCase().replace(' ', '-') === filterHygiene;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.pod.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    return matchesHygiene && matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-rose-50', text: 'text-[#ED3A56]', border: 'border-rose-200' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Context Hygiene Overview */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ED3A56] animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900">
              Amber AI Context Readiness &amp; PRD Hygiene Auditor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Autonomous audit scans product specifications for missing edge cases (e.g. UK student visa refusals, currency fluctuation buffers) and keeps semantic chunks synced in n8n Claude 3.5 RAG pipelines.
          </p>
        </div>

        {/* Global Hygiene Metric */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <Database className="w-5 h-5 text-slate-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Spec Hygiene</span>
            <span className="text-sm font-extrabold text-slate-900">
              66.2 / 100 <span className="text-xs text-amber-600 font-medium">(2 Specs Need Revision)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All PRDs', count: prds.length },
            { id: 'critical-gaps', label: 'Critical Gaps', count: prds.filter(p => p.hygieneStatus === 'Critical Gaps').length },
            { id: 'needs-attention', label: 'Needs Attention', count: prds.filter(p => p.hygieneStatus === 'Needs Attention').length },
            { id: 'high-hygiene', label: 'High Hygiene', count: prds.filter(p => p.hygieneStatus === 'High Hygiene').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterHygiene(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterHygiene === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterHygiene === tab.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PRD code, title, pod..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20"
          />
        </div>
      </div>

      {/* 4 Realistic Amber PRD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrds.map((prd) => {
          const colors = getScoreColor(prd.aiReadinessScore);
          const isReindexing = reindexingIds.includes(prd.id);

          return (
            <div
              key={prd.id}
              className="bg-white rounded-xl border border-slate-200 shadow-card hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#ED3A56] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {prd.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{prd.pod}</span>
                  </div>

                  {/* Readiness Score Gauge */}
                  <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono flex items-center space-x-1 ${colors.bg} ${colors.text} ${colors.border}`}>
                    <span>{prd.aiReadinessScore}/100</span>
                    <span className="text-[10px] font-normal opacity-80">Readiness</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#ED3A56] transition-colors leading-snug">
                  {prd.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {prd.summary}
                </p>
              </div>

              {/* Missing Edge Cases Preview */}
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Flagged Edge Cases ({prd.missingEdgeCases.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Claude RAG Audit</span>
                </div>

                <div className="space-y-1">
                  {prd.missingEdgeCases.slice(0, 2).map((ec) => (
                    <div key={ec.id} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        ec.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <span className="line-clamp-1">{ec.issue}</span>
                    </div>
                  ))}
                  {prd.missingEdgeCases.length > 2 && (
                    <span className="text-[10px] text-slate-400 block pl-3">
                      +{prd.missingEdgeCases.length - 2} more edge cases in spec
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: RAG Indexing & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${
                    prd.vectorStatus === 'Vector Synced' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <span>{prd.vectorStatus}</span>
                  <span className="text-slate-300">•</span>
                  <span>{prd.chunkCount} chunks</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onReindexPrd(prd.id)}
                    disabled={isReindexing}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Re-index PRD in vector database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-[#ED3A56]' : ''}`} />
                  </button>

                  <button
                    onClick={() => setSelectedPrd(prd)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center space-x-1 transition-colors"
                  >
                    <span>Inspect Spec</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Inspector for chosen PRD */}
      <PrdDetailModal
        prd={selectedPrd}
        onClose={() => setSelectedPrd(null)}
        onReindex={onReindexPrd}
        isReindexing={selectedPrd ? reindexingIds.includes(selectedPrd.id) : false}
      />
    </div>
  );
};

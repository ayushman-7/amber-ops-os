import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, RefreshCw, Layers, Copy, Check } from 'lucide-react';
import { PrdAudit } from '../types';

interface PrdDetailModalProps {
  prd: PrdAudit | null;
  onClose: () => void;
  onReindex: (prdId: string) => void;
  isReindexing: boolean;
}

export const PrdDetailModal: React.FC<PrdDetailModalProps> = ({
  prd,
  onClose,
  onReindex,
  isReindexing,
}) => {
  const [copied, setCopied] = useState(false);

  if (!prd) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(prd.fullMarkdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-modal border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-rose-50 text-[#ED3A56] px-2 py-0.5 rounded">
                {prd.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{prd.pod}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Author: {prd.author}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{prd.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-4 space-y-6 overflow-y-auto flex-1 pr-1">
          {/* Readiness Score & Vector Sync Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Context Score</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className={`text-2xl font-black ${
                  prd.aiReadinessScore >= 85 ? 'text-emerald-700' : prd.aiReadinessScore >= 60 ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {prd.aiReadinessScore}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 100</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vector RAG Status</span>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${prd.vectorStatus === 'Vector Synced' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs font-semibold text-slate-800">{prd.vectorStatus}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{prd.chunkCount} semantic chunks indexed</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Claude Knowledge Sync</span>
                <span className="text-xs text-slate-600 font-medium block mt-1">Updated {prd.lastUpdated}</span>
              </div>
              <button
                onClick={() => onReindex(prd.id)}
                disabled={isReindexing}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                title="Re-chunk and update embeddings in n8n RAG pipeline"
              >
                <RefreshCw className={`w-4 h-4 ${isReindexing ? 'animate-spin text-[#ED3A56]' : 'text-slate-500'}`} />
              </button>
            </div>
          </div>

          {/* Missing Edge Cases Flagged by AI */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ED3A56]" />
                <span>Edge Cases Flagged by Claude Auditor ({prd.missingEdgeCases.length})</span>
              </h4>
            </div>

            <div className="space-y-2">
              {prd.missingEdgeCases.map((ec) => (
                <div
                  key={ec.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    ec.severity === 'Critical'
                      ? 'bg-rose-50/60 border-rose-200'
                      : ec.severity === 'Warning'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-blue-50/60 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded font-mono ${
                        ec.severity === 'Critical'
                          ? 'bg-rose-200/80 text-rose-800'
                          : ec.severity === 'Warning'
                          ? 'bg-amber-200/80 text-amber-900'
                          : 'bg-blue-200/80 text-blue-900'
                      }`}
                    >
                      {ec.severity}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{ec.issue}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong className="text-slate-800">AI Recommendation:</strong> {ec.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Full Markdown Document Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Specification Content Preview
              </h4>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1 px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied Spec</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap border border-slate-800">
              {prd.fullMarkdownContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
          <span className="text-xs text-slate-400">Indexed in Amber Vector Store • Qdrant / Pinecone</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};

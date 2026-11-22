import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Sparkles, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { AuditStepTrace, SIMULATED_AUDIT_STEPS } from '../utils/webhookClient';

interface SprintAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  currentStepIndex: number;
  digestOutput: string | null;
  onGoToHitlTab: () => void;
}

export const SprintAuditModal: React.FC<SprintAuditModalProps> = ({
  isOpen,
  onClose,
  isRunning,
  currentStepIndex,
  digestOutput,
  onGoToHitlTab,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!digestOutput) return;
    navigator.clipboard.writeText(digestOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-modal border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#ED3A56] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Sprint Audit • n8n Claude Agent
              </h3>
              <p className="text-xs text-slate-500">
                {isRunning
                  ? 'Autonomous agent trace in execution...'
                  : 'Audit complete • Executive Slack digest compiled'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-6">
          {/* Step-by-step Trace Animation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Agent Execution Pipeline Trace
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-500">
                {isRunning ? `Step ${currentStepIndex + 1} of 4` : '100% Completed'}
              </span>
            </div>

            <div className="space-y-2.5">
              {SIMULATED_AUDIT_STEPS.map((step, idx) => {
                const isStepCompleted = currentStepIndex > idx || !isRunning;
                const isStepActive = isRunning && currentStepIndex === idx;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3 text-xs p-2.5 rounded-lg border transition-all duration-200 ${
                      isStepActive
                        ? 'bg-rose-50/80 border-rose-200 text-slate-900 shadow-xs'
                        : isStepCompleted
                        ? 'bg-white border-slate-200 text-slate-700'
                        : 'bg-slate-100/50 border-slate-200/60 text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isStepCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isStepActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#ED3A56] border-t-transparent animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{step.label}</span>
                        {isStepCompleted && (
                          <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.2 rounded">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Digest Output (Slack Style) */}
          {digestOutput && !isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Executive Slack Digest Preview</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                    #product-leadership-digest
                  </span>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy to Slack</span>
                    </>
                  )}
                </button>
              </div>

              {/* Slack Card Container */}
              <div className="bg-[#1A1D21] text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto shadow-inner">
                <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800">
                  <div className="w-5 h-5 rounded bg-[#ED3A56] text-white flex items-center justify-center font-bold text-[10px]">
                    a
                  </div>
                  <span className="font-sans font-bold text-white text-xs">amber-ops-bot</span>
                  <span className="bg-slate-700 text-slate-300 font-sans text-[10px] px-1 py-0.2 rounded">
                    APP
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Today at 10:45 AM</span>
                </div>
                <div className="whitespace-pre-wrap text-slate-200 space-y-1">
                  {digestOutput}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {isRunning ? 'Auditing in progress...' : '4 automated nudges pushed to HITL queue'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {!isRunning && (
              <button
                onClick={() => {
                  onClose();
                  onGoToHitlTab();
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#ED3A56] text-white hover:bg-[#D82945] transition-colors shadow-sm"
              >
                <span>Review Pending Slack Nudges (4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

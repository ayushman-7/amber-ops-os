import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Radio, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { WebhookConfig } from '../types';
import { saveWebhookConfig } from '../utils/webhookClient';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WebhookConfig;
  onSave: (config: WebhookConfig) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [secretKey, setSecretKey] = useState(config.secretKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (!url.trim()) {
      // Test simulator
      await new Promise((r) => setTimeout(r, 600));
      setTesting(false);
      setTestResult({
        success: true,
        message: 'Built-in n8n Claude Simulator is active & responsive! (Mock agent ready)',
        latencyMs: 14,
      });
      return;
    }

    try {
      const start = Date.now();
      const res = await fetch(url.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secretKey ? { Authorization: `Bearer ${secretKey}` } : {}),
        },
        body: JSON.stringify({
          event: 'amber.ops.ping_test',
          source: 'Amber Product Ops Control Tower',
          timestamp: new Date().toISOString(),
        }),
      });

      const latency = Date.now() - start;
      if (res.ok) {
        setTestResult({
          success: true,
          message: `Webhook responded with HTTP ${res.status} OK!`,
          latencyMs: latency,
        });
      } else {
        setTestResult({
          success: false,
          message: `Webhook responded with HTTP ${res.status}. Falling back to simulator.`,
          latencyMs: latency,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network error reaching URL: ${err.message || 'CORS / unreachable'}. The simulator will handle requests gracefully.`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const isCustom = Boolean(url.trim());
    const updated: WebhookConfig = {
      url: url.trim(),
      secretKey: secretKey.trim(),
      environment: isCustom ? 'production' : 'simulator',
      lastTriggered: new Date().toISOString(),
      lastStatus: testResult?.success ? 'success' : 'idle',
    };
    saveWebhookConfig(updated);
    onSave(updated);
    onClose();
  };

  const handleUseSimulator = () => {
    setUrl('');
    setSecretKey('');
    const updated: WebhookConfig = {
      url: '',
      environment: 'simulator',
      lastStatus: 'idle',
    };
    saveWebhookConfig(updated);
    onSave(updated);
    setTestResult({
      success: true,
      message: 'Reset to Built-in n8n Simulator. Ready for 1-click live testing!',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#ED3A56] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">n8n Workflow Webhook Settings</h3>
              <p className="text-xs text-slate-500">Connect your live n8n AI Agent or use the built-in simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 py-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#ED3A56] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Zero Setup Required: </span>
              If left blank, Amber Product Ops OS defaults to an interactive built-in simulator with 1.5s animated step-by-step agent traces and authentic Slack digest responses so any visitor can test it live!
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Production n8n Webhook URL (POST)
            </label>
            <input
              type="url"
              placeholder="https://n8n.your-domain.com/webhook/amber-ops-audit"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56] transition-all font-mono text-xs"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Receives events: <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">amber.ops.audit_triggered</code> and <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">amber.ops.nudge_dispatched</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Bearer Token / Secret Key (Optional)
            </label>
            <input
              type="password"
              placeholder="e.g. amber_ops_live_sk_849204..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56] transition-all font-mono text-xs"
            />
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{testResult.message}</p>
                {testResult.latencyMs && (
                  <p className="text-[10px] mt-0.5 opacity-80">Response latency: {testResult.latencyMs}ms</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleUseSimulator}
            className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
          >
            Reset to Simulator
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={testing}
              onClick={handleTestConnection}
              className="px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Test Ping</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#ED3A56] text-white hover:bg-[#D82945] transition-colors shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

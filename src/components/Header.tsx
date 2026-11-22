import React from 'react';
import { Radio, MessageSquare } from 'lucide-react';
import { WebhookConfig } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingNudgesCount: number;
  slackMessageCount: number;
  webhookConfig: WebhookConfig;
  onOpenWebhookModal: () => void;
  onOpenSlackDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingNudgesCount,
  slackMessageCount,
  webhookConfig,
  onOpenWebhookModal,
  onOpenSlackDrawer,
}) => {
  const tabs = [
    { id: 'sprint', label: 'Sprint Health & Metrics' },
    { id: 'prd-auditor', label: 'AI Context & PRD Auditor' },
    {
      id: 'slack-hitl',
      label: 'Slack Approval Queue (HITL)',
      badge: pendingNudgesCount > 0 ? pendingNudgesCount : undefined,
    },
    { id: 'release-onboarding', label: 'Release Notes & Onboarding' },
  ];

  const isRealWebhook = Boolean(webhookConfig.url && webhookConfig.url.trim().startsWith('http'));
  const isRealSlack = Boolean(webhookConfig.slackWebhookUrl && webhookConfig.slackWebhookUrl.trim().startsWith('http'));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
      {/* Top Bar: Brand, Org Info & Webhook Settings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#ED3A56] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              a
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">amber</span>
              <span className="text-slate-400 font-medium">//</span>
              <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">
                Product & AI Operations OS
              </span>
            </div>
          </div>

          {/* Org & Live Connection Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Pune Product Org</span>
              <span className="text-slate-300">•</span>
              <span>3 Active Pods</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <span>n8n Agent Connected</span>
              </span>
            </div>

            {/* Live Slack Drawer Button */}
            <button
              onClick={onOpenSlackDrawer}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              title="Open Live Slack Workspace Feed where approved nudges and digests land"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#ED3A56]" />
              <span className="hidden sm:inline">Live Slack Feed</span>
              {slackMessageCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#ED3A56] text-white font-bold text-[10px]">
                  {slackMessageCount}
                </span>
              )}
            </button>

            {/* Discreet Webhook Settings Modal Button */}
            <button
              onClick={onOpenWebhookModal}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                isRealWebhook || isRealSlack
                  ? 'bg-rose-50 border-rose-200 text-[#ED3A56] hover:bg-rose-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Configure custom n8n / Slack Webhook URL or run built-in simulator"
            >
              <Radio className={`w-3.5 h-3.5 ${isRealWebhook || isRealSlack ? 'text-[#ED3A56]' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isRealWebhook || isRealSlack ? 'Live Webhooks' : 'Webhook Settings'}</span>
              <span className="sm:hidden">Webhooks</span>
              {isRealWebhook || isRealSlack ? (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ED3A56]"></span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Sim</span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-rose-50 text-[#ED3A56] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#ED3A56] text-white'
                        : 'bg-rose-100 text-[#ED3A56]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

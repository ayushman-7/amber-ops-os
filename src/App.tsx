import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebhookModal } from './components/WebhookModal';
import { SprintHealthTab } from './components/SprintHealthTab';
import { PrdAuditorTab } from './components/PrdAuditorTab';
import { SlackHitlTab } from './components/SlackHitlTab';
import { ReleaseOnboardingTab } from './components/ReleaseOnboardingTab';
import { SprintAuditModal } from './components/SprintAuditModal';

import { SPRINT_TICKETS } from './data/sprintTickets';
import { PRD_AUDITS } from './data/prdAudits';
import { INITIAL_SLACK_NUDGES } from './data/slackNudges';
import { INITIAL_ONBOARDING_TASKS } from './data/onboardingData';
import {
  Pod,
  SprintTicket,
  PrdAudit,
  SlackNudge,
  AuditFeedItem,
  OnboardingTask,
  WebhookConfig,
} from './types';
import {
  getWebhookConfig,
  saveWebhookConfig,
  executeSprintAuditWebhook,
  dispatchNudgeWebhook,
} from './utils/webhookClient';

const INITIAL_AUDIT_FEED: AuditFeedItem[] = [
  {
    id: 'feed-1',
    timestamp: '10:14 AM',
    actor: 'n8n Scheduled Cron',
    action: 'Hourly Stale Ticket Scan Completed',
    details: 'Flagged AMB-1082 and AMB-1098 with >48h inactivity. Drafted HITL approval cards.',
    targetId: 'AMB-1082',
    type: 'audit_run',
  },
  {
    id: 'feed-2',
    timestamp: 'Yesterday, 4:32 PM',
    actor: 'Pooja Deshmukh (Lead PM)',
    action: 'Approved & Dispatched Nudge for AMB-1129',
    details: 'Dispatched to #pod-supply-partners via n8n Slack webhook.',
    targetId: 'AMB-1129',
    type: 'nudge_approved',
  },
  {
    id: 'feed-3',
    timestamp: 'Yesterday, 2:15 PM',
    actor: 'Claude 3.5 Sonnet Context Sync',
    action: 'PRD-103 Vector Re-indexing',
    details: 'Embedded 32 semantic chunks for Wise Platform & Escrow refund rules.',
    targetId: 'PRD-103',
    type: 'prd_indexed',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<string>('sprint');
  const [selectedPod, setSelectedPod] = useState<Pod>('All Pods');
  const [tickets, setTickets] = useState<SprintTicket[]>(SPRINT_TICKETS);
  const [prds, setPrds] = useState<PrdAudit[]>(PRD_AUDITS);
  const [nudges, setNudges] = useState<SlackNudge[]>(INITIAL_SLACK_NUDGES);
  const [auditFeed, setAuditFeed] = useState<AuditFeedItem[]>(INITIAL_AUDIT_FEED);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(INITIAL_ONBOARDING_TASKS);

  // Webhook settings modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(getWebhookConfig());

  // Sprint Audit execution modal & progress
  const [isSprintAuditModalOpen, setIsSprintAuditModalOpen] = useState(false);
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const [auditStepIndex, setAuditStepIndex] = useState(0);
  const [auditDigestOutput, setAuditDigestOutput] = useState<string | null>(null);

  // PRD re-indexing tracker
  const [reindexingIds, setReindexingIds] = useState<string[]>([]);

  const pendingNudgesCount = nudges.filter((n) => n.status === 'Pending Review').length;

  const handleRunAudit = async () => {
    setIsSprintAuditModalOpen(true);
    setIsAuditRunning(true);
    setAuditStepIndex(0);
    setAuditDigestOutput(null);

    const result = await executeSprintAuditWebhook((stepIdx) => {
      setAuditStepIndex(stepIdx);
    });

    setIsAuditRunning(false);
    setAuditDigestOutput(result.digestText);

    // Append to live audit feed
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditFeed((prev) => [
      {
        id: `feed-${Date.now()}`,
        timestamp: nowStr,
        actor: 'PM Ops Orchestrator',
        action: result.isRealWebhook
          ? 'Weekly Audit Dispatched via Production n8n Webhook'
          : 'Weekly Sprint Audit Executed (n8n Claude Simulator)',
        details: 'Evaluated 15 tickets, computed 11.4% spillover rate, compiled Executive Slack Digest.',
        targetId: 'ALL-PODS',
        type: 'audit_run',
      },
      ...prev,
    ]);
  };

  const handleApproveNudge = async (nudgeId: string) => {
    const targetNudge = nudges.find((n) => n.id === nudgeId);
    if (!targetNudge) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update nudge state
    setNudges((prev) =>
      prev.map((n) =>
        n.id === nudgeId
          ? {
              ...n,
              status: 'Approved & Sent',
              dispatchedAt: nowStr,
            }
          : n
      )
    );

    // Call webhook client
    await dispatchNudgeWebhook(
      targetNudge.id,
      targetNudge.ticketId,
      targetNudge.targetChannel,
      targetNudge.draftedMessage
    );

    // Log to audit feed
    setAuditFeed((prev) => [
      {
        id: `feed-${Date.now()}`,
        timestamp: nowStr,
        actor: 'Product Manager (HITL)',
        action: `Approved & Dispatched Slack Nudge for ${targetNudge.ticketId}`,
        details: `Sent to ${targetNudge.targetChannel} for ${targetNudge.assigneeName}. Inactive ${targetNudge.hoursStale}h.`,
        targetId: targetNudge.ticketId,
        type: 'nudge_approved',
      },
      ...prev,
    ]);
  };

  const handleEditAndDispatchNudge = async (
    nudgeId: string,
    updatedMessage: string,
    targetChannel: string
  ) => {
    const targetNudge = nudges.find((n) => n.id === nudgeId);
    if (!targetNudge) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setNudges((prev) =>
      prev.map((n) =>
        n.id === nudgeId
          ? {
              ...n,
              draftedMessage: updatedMessage,
              targetChannel,
              status: 'Edited & Dispatched',
              dispatchedAt: nowStr,
            }
          : n
      )
    );

    await dispatchNudgeWebhook(targetNudge.id, targetNudge.ticketId, targetChannel, updatedMessage);

    setAuditFeed((prev) => [
      {
        id: `feed-${Date.now()}`,
        timestamp: nowStr,
        actor: 'Product Manager (HITL)',
        action: `Edited & Dispatched Slack Nudge for ${targetNudge.ticketId}`,
        details: `Custom message routed to ${targetChannel}.`,
        targetId: targetNudge.ticketId,
        type: 'nudge_edited',
      },
      ...prev,
    ]);
  };

  const handleDismissNudge = (nudgeId: string) => {
    const targetNudge = nudges.find((n) => n.id === nudgeId);
    if (!targetNudge) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setNudges((prev) =>
      prev.map((n) => (n.id === nudgeId ? { ...n, status: 'Dismissed' } : n))
    );

    setAuditFeed((prev) => [
      {
        id: `feed-${Date.now()}`,
        timestamp: nowStr,
        actor: 'Product Manager (HITL)',
        action: `Dismissed automated nudge for ${targetNudge.ticketId}`,
        details: `Ticket marked as known exception; alert suppressed.`,
        targetId: targetNudge.ticketId,
        type: 'nudge_dismissed',
      },
      ...prev,
    ]);
  };

  const handleReindexPrd = (prdId: string) => {
    setReindexingIds((prev) => [...prev, prdId]);

    setTimeout(() => {
      setPrds((prev) =>
        prev.map((p) =>
          p.id === prdId
            ? {
                ...p,
                vectorStatus: 'Vector Synced',
                chunkCount: p.chunkCount + 4,
                aiReadinessScore: Math.min(100, p.aiReadinessScore + 6),
                lastUpdated: 'Just now',
              }
            : p
        )
      );

      const target = prds.find((p) => p.id === prdId);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setAuditFeed((prev) => [
        {
          id: `feed-${Date.now()}`,
          timestamp: nowStr,
          actor: 'Claude / n8n Embedder',
          action: `Re-indexed ${target?.code || prdId} in Qdrant Vector Store`,
          details: 'Updated chunk metadata and refreshed embeddings for Q&A bot.',
          targetId: target?.code || prdId,
          type: 'prd_indexed',
        },
        ...prev,
      ]);

      setReindexingIds((prev) => prev.filter((id) => id !== prdId));
    }, 1200);
  };

  const handleToggleOnboardingTask = (taskId: string) => {
    setOnboardingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Executive Linear/Stripe Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingNudgesCount={pendingNudgesCount}
        webhookConfig={webhookConfig}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sprint' && (
          <SprintHealthTab
            tickets={tickets}
            selectedPod={selectedPod}
            setSelectedPod={setSelectedPod}
            onRunAudit={handleRunAudit}
            isAuditRunning={isAuditRunning}
            onInspectPrd={(prdCode) => {
              setActiveTab('prd-auditor');
            }}
          />
        )}

        {activeTab === 'prd-auditor' && (
          <PrdAuditorTab
            prds={prds}
            onReindexPrd={handleReindexPrd}
            reindexingIds={reindexingIds}
          />
        )}

        {activeTab === 'slack-hitl' && (
          <SlackHitlTab
            nudges={nudges}
            auditFeed={auditFeed}
            onApproveNudge={handleApproveNudge}
            onEditAndDispatchNudge={handleEditAndDispatchNudge}
            onDismissNudge={handleDismissNudge}
            isDispatching={false}
          />
        )}

        {activeTab === 'release-onboarding' && (
          <ReleaseOnboardingTab
            onboardingTasks={onboardingTasks}
            onToggleTask={handleToggleOnboardingTask}
            onInspectPrd={(prdCode) => {
              setActiveTab('prd-auditor');
            }}
          />
        )}
      </main>

      {/* Webhook Configuration Modal */}
      <WebhookModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        config={webhookConfig}
        onSave={(newCfg) => setWebhookConfig(newCfg)}
      />

      {/* Sprint Audit Modal (with Animated Agent Trace & Slack Digest) */}
      <SprintAuditModal
        isOpen={isSprintAuditModalOpen}
        onClose={() => setIsSprintAuditModalOpen(false)}
        isRunning={isAuditRunning}
        currentStepIndex={auditStepIndex}
        digestOutput={auditDigestOutput}
        onGoToHitlTab={() => setActiveTab('slack-hitl')}
      />

      {/* Executive Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#ED3A56]" />
            <span className="font-semibold text-slate-700">Amber Product Ops OS</span>
            <span>— Control Tower for Student Accommodation Marketplaces</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by n8n Workflows + Claude 3.5 Sonnet RAG Context Engine • Pune Org
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

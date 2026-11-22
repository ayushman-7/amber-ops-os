import { WebhookConfig } from '../types';

const STORAGE_KEY = 'amber_ops_n8n_webhook_config';

const DEFAULT_CONFIG: WebhookConfig = {
  url: '',
  environment: 'simulator',
  lastStatus: 'idle'
};

export const getWebhookConfig = (): WebhookConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading webhook config:', e);
  }
  return DEFAULT_CONFIG;
};

export const saveWebhookConfig = (config: WebhookConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving webhook config:', e);
  }
};

export interface AuditStepTrace {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed';
  durationMs: number;
}

export const SIMULATED_AUDIT_STEPS: AuditStepTrace[] = [
  {
    id: 'step-1',
    label: 'Querying Linear / Jira Sprint Backlog',
    detail: 'Ingesting 15 active tickets across Pune Product Pods (Discovery, Booking, PBSA Sync)...',
    status: 'pending',
    durationMs: 400
  },
  {
    id: 'step-2',
    label: 'Analyzing Stale Inactivity & Blocker Logs',
    detail: 'Evaluating AWS Textract timeout errors, Unite Students 429 surges, and RTBA OAuth tokens...',
    status: 'pending',
    durationMs: 500
  },
  {
    id: 'step-3',
    label: 'Claude 3.5 Sonnet Spillover Root Cause Inference',
    detail: 'Matching open PRDs against current branch diffs; classifying root causes into 6 categories...',
    status: 'pending',
    durationMs: 500
  },
  {
    id: 'step-4',
    label: 'Generating Executive Slack Summary & HITL Nudges',
    detail: 'Formulating 4 HITL approval cards for #pod-guarantors, #pod-pb-sync-eng, and #pod-booking-ops...',
    status: 'pending',
    durationMs: 300
  }
];

export async function executeSprintAuditWebhook(
  onProgress?: (stepIndex: number) => void
): Promise<{ success: boolean; isRealWebhook: boolean; digestText: string }> {
  const config = getWebhookConfig();

  // If user configured a real production webhook URL, try posting to it
  if (config.url && config.url.trim().startsWith('http')) {
    try {
      if (onProgress) onProgress(0);
      const res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.secretKey ? { 'Authorization': `Bearer ${config.secretKey}` } : {})
        },
        body: JSON.stringify({
          event: 'amber.ops.audit_triggered',
          org: 'Pune Product Org',
          timestamp: new Date().toISOString(),
          source: 'Amber Product Ops OS Control Tower'
        })
      });

      if (onProgress) onProgress(3);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        return {
          success: true,
          isRealWebhook: true,
          digestText: data?.digest || 'n8n Workflow dispatched successfully. Live response logged.'
        };
      }
    } catch (err) {
      console.warn('Real webhook failed, falling back to simulator:', err);
    }
  }

  // Fallback interactive built-in simulation with progressive delays
  for (let i = 0; i < SIMULATED_AUDIT_STEPS.length; i++) {
    if (onProgress) onProgress(i);
    await new Promise(r => setTimeout(r, SIMULATED_AUDIT_STEPS[i].durationMs));
  }

  return {
    success: true,
    isRealWebhook: false,
    digestText: `*AMBER PRODUCT ORG — WEEKLY SPRINT AUDIT DIGEST* ⚡
*Pune Engineering & Product Hub • Sprint 2026-W47*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Sprint Health Overview:*
• Spillover Rate: *11.4%* (Target: <12%) — 🟢 Healthy (-6.2% vs W46)
• Idea-to-Release Velocity: *6.4 days* (Target: 7.0d) — ⚡ Fast
• PM Admin Time Saved: *4.2 hrs/PM* via n8n automated triage

⚠️ *Critical Spillovers & Root Causes:*
1. *AMB-1082 (UK Guarantor OCR):* Blocked 54h on AWS Textract multi-page EU bank statements.
2. *AMB-1089 (Unite Students v2 API):* Throttled at 30 req/min during peak booking simulations.
3. *AMB-1098 (Visa Refusal Refund):* Blocked 62h pending Home Office e-Visa refusal validation spec.

🔔 *HITL Action Required:*
• 4 Slack nudges queued in approval tab awaiting PM authorization.

_Generated automatically by Amber Ops OS via n8n Claude Context Agent_`
  };
}

export async function dispatchNudgeWebhook(
  nudgeId: string,
  ticketId: string,
  targetChannel: string,
  message: string
): Promise<{ success: boolean; isRealWebhook: boolean }> {
  const config = getWebhookConfig();

  if (config.url && config.url.trim().startsWith('http')) {
    try {
      const res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.secretKey ? { 'Authorization': `Bearer ${config.secretKey}` } : {})
        },
        body: JSON.stringify({
          event: 'amber.ops.nudge_dispatched',
          nudgeId,
          ticketId,
          targetChannel,
          message,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        return { success: true, isRealWebhook: true };
      }
    } catch (e) {
      console.warn('Real webhook dispatch failed, using simulator:', e);
    }
  }

  // Simulator delay
  await new Promise(r => setTimeout(r, 600));
  return { success: true, isRealWebhook: false };
}

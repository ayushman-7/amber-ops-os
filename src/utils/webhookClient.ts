import { WebhookConfig, DispatchedSlackMessage } from '../types';

const STORAGE_KEY = 'amber_ops_n8n_webhook_config';
const SLACK_MESSAGES_KEY = 'amber_ops_slack_inbox_messages';

const DEFAULT_CONFIG: WebhookConfig = {
  url: '',
  slackWebhookUrl: '',
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

export const INITIAL_SLACK_INBOX: DispatchedSlackMessage[] = [
  {
    id: 'slack-msg-init-1',
    channel: '#pod-guarantors-alerts',
    sender: 'amber-ops-bot',
    senderRole: 'n8n Automated Agent',
    senderBadge: 'APP',
    text: `⚠️ *AMB-1082 Alert:* UK Guarantor OCR engine experiencing latency on non-standard EU multi-page bank statements (54h stale). Please confirm fallback queue routing.`,
    timestamp: '10:14 AM',
    ticketId: 'AMB-1082'
  },
  {
    id: 'slack-msg-init-2',
    channel: '#product-leadership-digest',
    sender: 'amber-ops-bot',
    senderRole: 'Weekly Sprint Digest',
    senderBadge: 'APP',
    text: `🚀 *Weekly Sprint 2026-W47 Health:* Spillover rate at *11.4%* (-6.2% vs last sprint). PM admin savings: *4.2 hrs/PM*. 4 HITL items awaiting review.`,
    timestamp: 'Yesterday, 6:00 PM',
    ticketId: 'ALL-PODS'
  }
];

export const getStoredSlackMessages = (): DispatchedSlackMessage[] => {
  try {
    const raw = localStorage.getItem(SLACK_MESSAGES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading slack messages:', e);
  }
  return INITIAL_SLACK_INBOX;
};

export const storeSlackMessage = (message: DispatchedSlackMessage): void => {
  try {
    const current = getStoredSlackMessages();
    const updated = [message, ...current];
    localStorage.setItem(SLACK_MESSAGES_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Error storing slack message:', e);
  }
};

export const clearStoredSlackMessages = (): void => {
  try {
    localStorage.setItem(SLACK_MESSAGES_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing slack messages:', e);
  }
};

/**
 * Authentic Slack notification chime synthesized using Web Audio API
 */
export const playSlackChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // First Ping (B5, 987.77 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second Ping (E6, 1318.51 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  } catch (e) {
    // Graceful fallback if audio is autoplay-blocked
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
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
        const digest = data?.digest || 'n8n Workflow dispatched successfully. Live response logged.';
        
        // Also post to real Slack webhook if provided
        await forwardToRealSlack(config.slackWebhookUrl, digest, '#product-leadership-digest');

        return {
          success: true,
          isRealWebhook: true,
          digestText: digest
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

  const generatedDigest = `*AMBER PRODUCT ORG — WEEKLY SPRINT AUDIT DIGEST* ⚡
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

_Generated automatically by Amber Ops OS via n8n Claude Context Agent_`;

  // Forward to real Slack if configured
  if (config.slackWebhookUrl) {
    await forwardToRealSlack(config.slackWebhookUrl, generatedDigest, '#product-leadership-digest');
  }

  return {
    success: true,
    isRealWebhook: false,
    digestText: generatedDigest
  };
}

export async function dispatchNudgeWebhook(
  nudgeId: string,
  ticketId: string,
  targetChannel: string,
  message: string
): Promise<{ success: boolean; isRealWebhook: boolean }> {
  const config = getWebhookConfig();
  let isRealSent = false;

  // 1. Post to real Slack Incoming Webhook if configured
  if (config.slackWebhookUrl && config.slackWebhookUrl.trim().startsWith('http')) {
    const slackOk = await forwardToRealSlack(config.slackWebhookUrl, message, targetChannel);
    if (slackOk) isRealSent = true;
  }

  // 2. Post to n8n Webhook if configured
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
        isRealSent = true;
      }
    } catch (e) {
      console.warn('Real n8n webhook dispatch failed, using simulator:', e);
    }
  }

  if (!isRealSent) {
    // Simulator delay
    await new Promise(r => setTimeout(r, 450));
  }

  // Play audio chime
  playSlackChime();

  return { success: true, isRealWebhook: isRealSent };
}

/**
 * Sends a message payload to an incoming Slack Webhook (or Discord / webhook.site)
 */
async function forwardToRealSlack(webhookUrl: string | undefined, text: string, channel?: string): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) return false;

  try {
    const payload = {
      text,
      username: 'Amber Product Ops Bot',
      icon_emoji: ':robot_face:',
      channel: channel || undefined
    };

    // Attempt direct fetch
    await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Enables browser dispatch to cross-origin Slack webhooks without CORS failure
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.warn('Error forwarding to real Slack webhook:', err);
    return false;
  }
}

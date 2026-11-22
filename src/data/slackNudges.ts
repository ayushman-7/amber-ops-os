import { SlackNudge } from '../types';

export const INITIAL_SLACK_NUDGES: SlackNudge[] = [
  {
    id: 'nudge-1',
    ticketId: 'AMB-1082',
    ticketTitle: 'UK Guarantor Document OCR & Income Multiplier Engine',
    pod: 'Booking & Guarantors',
    assigneeName: 'Pooja Deshmukh',
    assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    targetChannel: '#pod-guarantors-alerts',
    hoursStale: 54,
    status: 'Pending Review',
    aiDraftReason: 'Blocked > 48h due to AWS Textract multi-page OCR failures on international Spanish bank statements.',
    draftedMessage: `Hey @pooja! 👋 Automated Amber Ops alert: *AMB-1082* has been blocked for 54 hours.
*Root Cause:* AWS Textract failure on non-standard EU PDF bank statements.
*Proposed Action:* Should we switch the fallback queue to the manual compliance ops team or route through the Claude 3.5 Sonnet multimodal parser branch (#pr-842)?
Let us know in this thread so we can keep the sprint spillover within our 12% target! 🚀`
  },
  {
    id: 'nudge-2',
    ticketId: 'AMB-1098',
    ticketTitle: 'Student Visa Refusal "No-Visa No-Pay" Refund Automations',
    pod: 'Booking & Guarantors',
    assigneeName: 'Rohan Mehta',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    targetChannel: '#pod-booking-ops',
    hoursStale: 62,
    status: 'Pending Review',
    aiDraftReason: 'Stale > 48h. Missing legal signoff on UK Home Office electronic visa refusal notification parsing.',
    draftedMessage: `Hi @rohan! ⚠️ Amber Ops bot check: *AMB-1098* (No-Visa No-Pay refund automation) is idle at 62 hours.
*Blocker:* UK e-Visa PDF refusal letter format needs legal verification rules signoff.
*Suggested Next Step:* @aishwarya.legal mentioned approving the CAS withdrawal disclaimer in PRD-101. Can you ping her in #legal-product-reviews today?`
  },
  {
    id: 'nudge-3',
    ticketId: 'AMB-1089',
    ticketTitle: 'PBSA Live Room Availability Sync (Unite Students v2 API)',
    pod: 'Supply & PBSA Sync',
    assigneeName: 'Aditya Kulkarni',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    targetChannel: '#pod-pb-sync-eng',
    hoursStale: 49,
    status: 'Pending Review',
    aiDraftReason: 'In Progress with zero git commits or status updates in 49h. Rate limiting issue identified.',
    draftedMessage: `Hey @aditya! 📡 Notice from Amber Product Ops OS: *AMB-1089* (Unite Students v2 inventory sync) has had no updates for 49 hours.
*Detected:* Unite Students API is throwing 429 rate limits at 30 req/min during peak booking simulations.
*Proposed Fix:* Shall we deploy the Redis backoff bucket limiter from \`lib/rate-limit.ts\`? Let's unblock before the Friday clearing surge.`
  },
  {
    id: 'nudge-4',
    ticketId: 'AMB-1129',
    ticketTitle: 'Scape Australia Automated Bond Lodgement API Integration',
    pod: 'Supply & PBSA Sync',
    assigneeName: 'Siddharth Joshi',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    targetChannel: '#pod-supply-partners',
    hoursStale: 58,
    status: 'Pending Review',
    aiDraftReason: 'Blocked > 48h on Victorian RTBA government OAuth token rotation specifications.',
    draftedMessage: `Hi @siddharth! 🇦🇺 Ops Bot check on *AMB-1129* (Scape Australia Bond Lodgement): Blocked for 58 hours.
*Context:* RTBA Sandbox credentials refreshed by Melbourne partnerships team.
*Action:* Could you verify if the new client_secret resolves the 401 token refresh loop so we can move this to 'In Review'?`
  }
];

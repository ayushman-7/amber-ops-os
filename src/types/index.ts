export type Pod = 'All Pods' | 'Student Discovery' | 'Booking & Guarantors' | 'Supply & PBSA Sync';

export type TicketStatus = 'In Progress' | 'Blocked' | 'In Review' | 'Done' | 'Stale';

export type SpilloverCause =
  | 'Missing API Specs'
  | 'Legal/Compliance Review'
  | 'Unclear Acceptance Criteria'
  | 'Partner Webhook Latency'
  | 'Edge Case: Visa Rules'
  | 'Third-Party OCR Downtime';

export interface TicketAssignee {
  name: string;
  avatar: string;
  role: string;
}

export interface SprintTicket {
  id: string;
  title: string;
  pod: Exclude<Pod, 'All Pods'>;
  storyPoints: number;
  status: TicketStatus;
  hoursStale: number;
  prdScore: number;
  assignee: TicketAssignee;
  priority: 'P0' | 'P1' | 'P2';
  spilloverRootCause: {
    category: SpilloverCause;
    summary: string;
    aiConfidence: number;
  };
}

export interface PrdMissingEdgeCase {
  id: string;
  severity: 'Critical' | 'Warning' | 'Suggestion';
  issue: string;
  recommendation: string;
  resolved?: boolean;
}

export interface PrdAudit {
  id: string;
  code: string;
  title: string;
  pod: Exclude<Pod, 'All Pods'>;
  author: string;
  lastUpdated: string;
  aiReadinessScore: number;
  hygieneStatus: 'High Hygiene' | 'Needs Attention' | 'Critical Gaps';
  vectorStatus: 'Vector Synced' | 'Outdated' | 'Syncing';
  chunkCount: number;
  summary: string;
  missingEdgeCases: PrdMissingEdgeCase[];
  fullMarkdownContent: string;
}

export interface SlackNudge {
  id: string;
  ticketId: string;
  ticketTitle: string;
  pod: Exclude<Pod, 'All Pods'>;
  assigneeName: string;
  assigneeAvatar: string;
  targetChannel: string;
  hoursStale: number;
  status: 'Pending Review' | 'Approved & Sent' | 'Edited & Dispatched' | 'Dismissed';
  aiDraftReason: string;
  draftedMessage: string;
  dispatchedAt?: string;
}

export interface AuditFeedItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  targetId: string;
  type: 'nudge_approved' | 'nudge_edited' | 'nudge_dismissed' | 'audit_run' | 'prd_indexed' | 'webhook_configured';
}

export interface OnboardingTask {
  id: string;
  week: 'Week 1: Foundations & Architecture' | 'Week 2: Operations & Deep Dive';
  title: string;
  description: string;
  completed: boolean;
  docCitation?: string;
  category: 'System Setup' | 'Shadowing' | 'PRD Audit' | 'Domain Knowledge';
}

export interface ReleaseNoteTicket {
  id: string;
  title: string;
  category: 'Feature' | 'Improvement' | 'Fix' | 'Infrastructure';
  summary: string;
  pod: Exclude<Pod, 'All Pods'>;
  impactMetrics: string;
  isCustomerFacing: boolean;
}

export interface WebhookConfig {
  url: string;
  slackWebhookUrl?: string;
  secretKey?: string;
  environment: 'production' | 'staging' | 'simulator';
  lastTriggered?: string;
  lastStatus?: 'success' | 'failed' | 'idle';
}

export interface DispatchedSlackMessage {
  id: string;
  channel: string;
  sender: string;
  senderRole?: string;
  senderAvatar?: string;
  senderBadge?: string;
  text: string;
  timestamp: string;
  ticketId?: string;
  isRealWebhookSent?: boolean;
}

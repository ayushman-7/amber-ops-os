import { ReleaseNoteTicket } from '../types';

export const COMPLETED_RELEASE_TICKETS: ReleaseNoteTicket[] = [
  {
    id: 'AMB-1094',
    title: 'Multi-Currency Rent Calculator with 48h FX Hedge',
    category: 'Feature',
    summary: 'Enables international students from India, China, and EU to view and lock rental rates in home currencies with transparent breakdown of holding deposit and damage bond.',
    pod: 'Student Discovery',
    impactMetrics: '+14.2% checkout conversion on multi-currency sessions; £0 FX variance loss',
    isCustomerFacing: true
  },
  {
    id: 'AMB-1122',
    title: 'Flexible Lease Filter Toggle (44-Week vs 51-Week Tenancies)',
    category: 'Improvement',
    summary: 'New search filter separating short-term academic year leases (44 weeks) from full calendar year contracts (51 weeks) to avoid checkout term mismatches.',
    pod: 'Student Discovery',
    impactMetrics: '-22% drop-off at Tenancy Selection screen; 3,400+ filter uses/day',
    isCustomerFacing: true
  },
  {
    id: 'AMB-1133',
    title: 'University Partner White-Label Portal Custom Theme Engine',
    category: 'Feature',
    summary: 'Dynamic CSS variables engine allowing university accommodation offices (e.g. King’s College London, Manchester Univ) to co-brand Amber inventory widgets.',
    pod: 'Student Discovery',
    impactMetrics: '4 new Russell Group university partners launched this sprint',
    isCustomerFacing: true
  },
  {
    id: 'AMB-1140',
    title: 'Real-time WebSocket Push for Flash Inventory Clearance',
    category: 'Infrastructure',
    summary: 'Redis Cluster Pub/Sub channel streaming room release events directly to active browsing sessions in under 450ms.',
    pod: 'Supply & PBSA Sync',
    impactMetrics: 'P99 inventory sync latency dropped from 4.2s to 380ms',
    isCustomerFacing: false
  },
  {
    id: 'AMB-1125',
    title: 'Automated Scottish Matriculation & Council Tax Validation',
    category: 'Fix',
    summary: 'Refactored regex parser to support Scottish university matriculation numbers alongside standard UK Student Route visa IDs for council tax exemption.',
    pod: 'Booking & Guarantors',
    impactMetrics: 'Eliminated 48 manual support tickets/week for Edinburgh & Glasgow bookings',
    isCustomerFacing: false
  }
];

export const SLACK_RELEASE_DIGEST_TEMPLATE = `🚀 *AMBER PRODUCT ORG — WEEKLY STAKEHOLDER RELEASE DIGEST*
*Sprint 2026-W47 • 3 Active Pods Shipped • Pune Product Org*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *CUSTOMER-FACING HIGHLIGHTS*
• *Multi-Currency Rent Calculator (AMB-1094):* International students can now lock GBP/EUR/AUD prices in INR, RMB, or EUR for 48 hours (+14.2% checkout conversion).
• *Lease Duration Toggle (AMB-1122):* Students can now filter between 44-week and 51-week tenancies cleanly without room surprises.
• *University Co-Branded Portals (AMB-1133):* White-label widgets rolled out across 4 UK university accommodation offices.

⚙️ *OPERATIONAL & PLATFORM RELIABILITY*
• *Sub-second Inventory Push (AMB-1140):* Redis pub/sub reduced room status latency to 380ms for Unite & iQ properties.
• *Scottish Council Tax Parsing (AMB-1125):* Automated matriculation check saved ~48 manual Ops tickets this week.

📊 *SPRINT OPERATIONAL METRICS*
• Spillover Rate: *11.4%* (Target: <12%) 🟢
• Idea-to-Release Cycle: *6.4 days* (Down from 8.2d) ⚡
• PM Admin Hours Saved by n8n Bot: *4.2 hrs/PM* 🤖
• Slacking Stale Approvals: *4 HITL items in queue*

_Generated automatically via Amber Product & AI Ops OS (n8n + Claude Context Engine)_`;

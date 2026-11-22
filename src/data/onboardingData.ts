import { OnboardingTask } from '../types';

export const INITIAL_ONBOARDING_TASKS: OnboardingTask[] = [
  // Week 1
  {
    id: 'onb-1',
    week: 'Week 1: Foundations & Architecture',
    title: 'Review Amber Supply Architecture & PMS Integrations',
    description: 'Understand how Unite Students, StarRez, and TCAS feed inventory into Amber discovery catalogs.',
    completed: true,
    docCitation: 'PRD-102 §2.1 (Inventory Sync Specs)',
    category: 'System Setup'
  },
  {
    id: 'onb-2',
    week: 'Week 1: Foundations & Architecture',
    title: 'Shadow 3 Student Booking & Guarantor Escalation Calls',
    description: 'Listen to calls handling international student visa refusals and lack of UK cosigners.',
    completed: true,
    docCitation: 'PRD-101 §1.3 (Guarantor Problem Statement)',
    category: 'Shadowing'
  },
  {
    id: 'onb-3',
    week: 'Week 1: Foundations & Architecture',
    title: 'Connect n8n Agent Webhook to Local Development Sandbox',
    description: 'Configure your n8n workflow triggers and verify Claude 3.5 Sonnet context RAG indexing.',
    completed: false,
    docCitation: 'DevOps Ops Manual §4.2',
    category: 'System Setup'
  },
  {
    id: 'onb-4',
    week: 'Week 1: Foundations & Architecture',
    title: 'Audit First PRD against AI Hygiene Checklist',
    description: 'Run the AI Context Auditor on a drafted spec to verify edge cases for dual-occupancy and FX hedging.',
    completed: false,
    docCitation: 'Product Ops SOP §7.1',
    category: 'PRD Audit'
  },
  // Week 2
  {
    id: 'onb-5',
    week: 'Week 2: Operations & Deep Dive',
    title: 'Run Weekly Sprint Spillover Audit for Assigned Pod',
    description: 'Trigger the n8n audit agent, analyze root causes (specs vs partner API delay), and review HITL Slack nudges.',
    completed: false,
    docCitation: 'Sprint Ops Guidebook',
    category: 'Domain Knowledge'
  },
  {
    id: 'onb-6',
    week: 'Week 2: Operations & Deep Dive',
    title: 'Deep Dive into UK Tenancy Agreements & Student Visa Rules',
    description: 'Study CAS letters, 44-week vs 51-week tenancy contracts, and council tax exemption processes.',
    completed: false,
    docCitation: 'PRD-101 §4.5 (Visa No-Pay Clauses)',
    category: 'Domain Knowledge'
  },
  {
    id: 'onb-7',
    week: 'Week 2: Operations & Deep Dive',
    title: 'Author and Ship Weekly Stakeholder Release Digest',
    description: 'Curate completed tickets into audience-specific release notes for Ops, Sales, and Leadership.',
    completed: false,
    docCitation: 'Release Notes Workflow v2.4',
    category: 'Domain Knowledge'
  }
];

export interface AiQaEntry {
  question: string;
  keywords: string[];
  answer: string;
  citedPrd: string;
  section: string;
  confidence: number;
}

export const AI_QA_KNOWLEDGE_BASE: AiQaEntry[] = [
  {
    question: 'How does PBSA inventory sync work?',
    keywords: ['pbsa', 'inventory', 'sync', 'unite', 'starrez', 'rooms', 'availability'],
    answer: 'Amber integrates with PBSA PMS engines (Unite Students v2 API, StarRez, Kinetic, and TCAS) via a hybrid push/pull pipeline. Webhook pushes update room status in <1.8s. During peak clearing season, a Redis distributed lock (SETNX 5-minute hold) prevents dual-booking collisions across simultaneous student checkouts.',
    citedPrd: 'PRD-102: Unite Students API Inventory Sync',
    section: '§3.1 & §4.2 (Two-Way Sync Architecture)',
    confidence: 96
  },
  {
    question: 'What is the "No-Visa No-Pay" student refund policy?',
    keywords: ['visa', 'refund', 'no-visa', 'cancellation', 'home office', 'rejection'],
    answer: 'Under Amber\'s "No-Visa No-Pay" policy, international students whose UK Student Route visa is refused by the Home Office receive a 100% refund of booking deposits within 5 business days. Required verification: official CAS withdrawal confirmation and Home Office refusal notice with matching passport ID.',
    citedPrd: 'PRD-101: UK Student Guarantor Flow',
    section: '§5.2 (Visa Refusal Exception Terms)',
    confidence: 98
  },
  {
    question: 'How does the multi-currency rent calculator work?',
    keywords: ['currency', 'fx', 'hedge', 'exchange', 'rent', 'inr', 'gbp', 'calculator'],
    answer: 'The rent engine locks GBP/EUR/AUD prices for 48 hours at checkout via Stripe Treasury and Wise Platform API. It supports 34 local payment rails (including UPI for Indian students and Alipay/WeChat for Chinese students), eliminating predatory 4-6% international wire transfer fees.',
    citedPrd: 'PRD-103: Multi-Currency Student Escrow',
    section: '§2.1 (48-Hour Rate Locking & Rails)',
    confidence: 94
  },
  {
    question: 'Why do tickets get flagged for spillover in Amber sprints?',
    keywords: ['spillover', 'root cause', 'stale', 'flagged', 'delay', 'audit'],
    answer: 'AI sprint analysis shows 4 primary spillover root causes at Amber: (1) Partner Webhook Latency (e.g. Unite 429 throttling), (2) Missing API Specs in early PRD phase, (3) Legal/Compliance review delays for cross-border tenancy laws, and (4) Third-party OCR service timeouts on foreign bank statements.',
    citedPrd: 'Amber Product Ops Metric Guidelines',
    section: '§1.4 (Spillover Classification Taxonomy)',
    confidence: 91
  },
  {
    question: 'How does AI Roommate Matching evaluate compatibility?',
    keywords: ['roommate', 'matching', 'lifestyle', 'compatibility', 'diet', 'sleep'],
    answer: 'Amber matches students sharing 4–8 bed cluster apartments using OpenAI text-embedding-3-small vectors computed over sleep rhythm, study discipline, cleanliness preferences, and dietary restrictions (Halal/Vegan), subject to hard filters like single-gender flat mandates.',
    citedPrd: 'PRD-104: AI Roommate Matching',
    section: '§3.2 (Embedding Distance & Constraints)',
    confidence: 89
  }
];

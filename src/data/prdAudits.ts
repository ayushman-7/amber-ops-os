import { PrdAudit } from '../types';

export const PRD_AUDITS: PrdAudit[] = [
  {
    id: 'prd-101',
    code: 'PRD-101',
    title: 'UK Student Guarantor Verification & Rent Guarantee Flow',
    pod: 'Booking & Guarantors',
    author: 'Pooja Deshmukh (Lead PM)',
    lastUpdated: 'Nov 17, 2026',
    aiReadinessScore: 58,
    hygieneStatus: 'Critical Gaps',
    vectorStatus: 'Outdated',
    chunkCount: 16,
    summary: 'Automates landlord & PBSA rent guarantor verification for international students studying in London, Manchester, and Birmingham without UK-resident family guarantors.',
    missingEdgeCases: [
      {
        id: 'ec-101-1',
        severity: 'Critical',
        issue: 'Missing refund logic for UK student visa rejections (CAS withdrawal under Home Office SMS rules)',
        recommendation: 'Specify exact 5-day SLA, required rejection letter watermark checks, and zero-cancellation fee guarantee pass-through to PBSA partner accounts.'
      },
      {
        id: 'ec-101-2',
        severity: 'Critical',
        issue: 'Lacks fallback when Open Banking consent fails for non-UK foreign banks (e.g., ICICI, HDFC, Bank of China)',
        recommendation: 'Define fallback to manual document OCR review queue with human-in-the-loop SLA under 4 hours.'
      },
      {
        id: 'ec-101-3',
        severity: 'Warning',
        issue: 'No definition for joint guarantor scenarios when student and guarantor co-sign multi-occupancy tenancies',
        recommendation: 'Add schema and electronic signature sequence order (DocuSign/HelloSign webhook handling).'
      }
    ],
    fullMarkdownContent: `# PRD-101: UK Student Guarantor Verification & Rent Guarantee Flow

## 1. Problem Statement
Over 72% of international students moving to the UK cannot provide a UK-based working guarantor earning 3x the annual rent. Consequently, PBSA providers and private landlords demand 100% upfront annual rent payment (£12,000–£24,000), causing massive drop-offs in Amber's booking conversion funnel.

## 2. Target Persona
- **International Undergrad/Postgrad:** Needs to book in London, Birmingham, Sheffield, or Glasgow without a UK citizen co-signer.
- **PBSA Onboarding Partner (e.g., Unite Students, Scape):** Requires vetted creditworthiness or third-party guarantee backing (Housing Hand, YourGuarantor).

## 3. High-Level User Journey
1. Student selects room & chooses "Pay in Installments (Guarantor Required)".
2. Amber prompts for Guarantor type: (A) UK Resident Relative, (B) Amber Institutional Guarantee Partner.
3. If (A), co-signer completes KYC & Open Banking income verification.
4. If (B), Amber calculates 6.5% guarantee fee, charges monthly installment escrow, and issues verified voucher certificate to PBSA PMS.

## 4. Technical Architecture
- **Service:** \`amber-guarantor-service\` (Go / PostgreSQL / Redis)
- **External APIs:** Plaid / TrueLayer UK Open Banking, AWS Textract (Bank Statements), DocuSign Embedded Signing SDK.
- **Events:** Emits \`guarantor.verification.approved\` and \`guarantor.verification.failed\` to Kafka.

## 5. Outstanding Gaps (Flagged by AI Auditor)
- *CRITICAL:* Missing formal refund & indemnity transfer terms if student's UK Student Route visa is refused post-deposit.
- *CRITICAL:* Unhandled currency conversion variance for non-GBP bank statement reserves.
- *WARNING:* Open Banking token expiration (>90 days) during delayed tenancy start dates.`
  },
  {
    id: 'prd-102',
    code: 'PRD-102',
    title: 'Unite Students & iQ Real-Time Inventory & Price Sync Engine',
    pod: 'Supply & PBSA Sync',
    author: 'Aditya Kulkarni (Staff PM)',
    lastUpdated: 'Nov 18, 2026',
    aiReadinessScore: 72,
    hygieneStatus: 'Needs Attention',
    vectorStatus: 'Vector Synced',
    chunkCount: 24,
    summary: 'Two-way integration engine between Amber supply catalog and PMS systems (StarRez, Kinetic Solutions, TCAS) for instant room availability, floor plans, and dynamic tenancy pricing.',
    missingEdgeCases: [
      {
        id: 'ec-102-1',
        severity: 'Critical',
        issue: 'Lacks exponential backoff and dead-letter queue behavior on Unite Students API 429 / 503 error storms',
        recommendation: 'Configure circuit breaker at 15 consecutive errors with Redis cached inventory fallback (max TTL: 120s).'
      },
      {
        id: 'ec-102-2',
        severity: 'Warning',
        issue: 'Floor and flat level room attributes not normalized across different PMS nomenclature (Cluster Ensuite vs Classic Studio)',
        recommendation: 'Provide canonical room categorization ontology mapping in §4.4 with fallback unmapped tag.'
      }
    ],
    fullMarkdownContent: `# PRD-102: Unite Students & iQ Real-Time Inventory & Price Sync Engine

## 1. Executive Summary
During clearing season (July–September), student room availability shifts every 90 seconds. Stale listings lead to failed bookings, customer support overload, and negative trust. This system syncs room-level status in sub-second latency.

## 2. Supported Integrations
- **Unite Students Direct API:** REST / Webhook Push
- **StarRez PMS:** SOAP / REST Connect
- **Kinetic Solutions (Kx):** Daily batch + differential delta streaming
- **TCAS Online:** Webhooks for contract status updates

## 3. SLA & Performance Requirements
- Latency from PMS inventory change to Amber web search reflection: < 1.8 seconds.
- Concurrent sync capacity: 120,000 beds across 1,800 properties in UK & Australia.
- Error rate budget: < 0.05% dropped reservation webhooks.

## 4. Edge Cases Identified by Claude PRD Auditor
- Flash sold-out collision: Two students click "Hold Room" at the exact same millisecond. PRD must specify 5-minute atomic distributed Redis lock (\`SETNX room:hold:1082\`).`
  },
  {
    id: 'prd-103',
    code: 'PRD-103',
    title: 'Multi-Currency Student Escrow & Instant Refund Engine',
    pod: 'Booking & Guarantors',
    author: 'Rohan Mehta (Senior PM)',
    lastUpdated: 'Nov 19, 2026',
    aiReadinessScore: 92,
    hygieneStatus: 'High Hygiene',
    vectorStatus: 'Vector Synced',
    chunkCount: 32,
    summary: 'Global payment gateway routing supporting 34 local payment methods (UPI, Alipay, WeChat Pay, SOFORT, iDEAL) with guaranteed FX rate locking for 48 hours and instant automated refunds.',
    missingEdgeCases: [
      {
        id: 'ec-103-1',
        severity: 'Suggestion',
        issue: 'Consider hedging fee buffer disclosure on extreme weekend currency volatility spikes for emerging currencies (e.g., NGN, TRY)',
        recommendation: 'Display dynamic FX spread indicator when market volatility index exceeds 3.5% threshold.'
      }
    ],
    fullMarkdownContent: `# PRD-103: Multi-Currency Student Escrow & Instant Refund Engine

## 1. Objective
Enable international students to pay holding deposits, security bonds, and tenancy rent in their home domestic currency without absorbing predatory 4–6% bank cross-border wire transfer fees.

## 2. Core Capabilities
- **48-Hour FX Rate Lock:** Locks GBP/EUR/AUD price at checkout using Stripe Treasury + Wise Platform API.
- **Local Rail Routing:** UPI for Indian students (40% volume), Alipay/WeChat for Chinese students (28% volume).
- **Automated Refund Pipeline:** Triggered immediately when visa rejection or landlord decline occurs, crediting back to original rail within 4 hours instead of conventional 14 business days.

## 3. Compliance & Security
- PCI-DSS Level 1 Compliant tokenization.
- Escrow trust accounts ring-fenced under UK FCA client money regulations (CASS 7).
- Anti-Money Laundering (AML) checks triggered on transactions exceeding £10,000 threshold.`
  },
  {
    id: 'prd-104',
    code: 'PRD-104',
    title: 'Amber AI Roommate Compatibility & Lifestyle Matching',
    pod: 'Student Discovery',
    author: 'Neha Chawla (Product Lead)',
    lastUpdated: 'Nov 12, 2026',
    aiReadinessScore: 43,
    hygieneStatus: 'Critical Gaps',
    vectorStatus: 'Outdated',
    chunkCount: 9,
    summary: 'Predictive vector embedding algorithm matching flatmates sharing 4–8 bed cluster apartments based on sleep schedules, study discipline, cleanliness habits, dietary needs, and course schedule.',
    missingEdgeCases: [
      {
        id: 'ec-104-1',
        severity: 'Critical',
        issue: 'No GDPR compliance framework for processing special category demographic and lifestyle data of teenage students (ages 17-18)',
        recommendation: 'Require explicit parental consent workflow for 17-year-olds and anonymized vector embeddings without storing raw response text in plaintext.'
      },
      {
        id: 'ec-104-2',
        severity: 'Critical',
        issue: 'Missing conflict mediation workflow and room transfer protocol if AI-matched roommates request mid-lease separation',
        recommendation: 'Define automated dispute ticketing in Zendesk and tie into PBSA partner contract room-swap inventory pool.'
      },
      {
        id: 'ec-104-3',
        severity: 'Warning',
        issue: 'Cold-start dilemma when student chooses not to fill voluntary lifestyle questionnaire',
        recommendation: 'Provide coarse-grain defaults based solely on university course faculty and campus location.'
      }
    ],
    fullMarkdownContent: `# PRD-104: Amber AI Roommate Compatibility & Lifestyle Matching

## 1. Context & Business Hypothesis
Flatmate conflict accounts for 44% of student lease cancellation requests and 60% of negative reviews. By introducing smart roommate matching before lease execution, Amber increases satisfaction NPS by 18 points and drives high referral loops.

## 2. Questionnaire Attributes
- Sleep rhythm (Early bird vs Night owl)
- Cleanliness preference (Daily tidy vs Weekend deep clean)
- Dietary requirements (Vegetarian/Halal/Vegan/Allergens)
- Noise tolerance (Study sanctuary vs Social hosting)

## 3. Matching Algorithm
- OpenAI \`text-embedding-3-small\` cosine similarity distance combined with hard constraints filter (e.g., single-gender flat requirement).
- Top 3 matches displayed in Amber student dashboard with compatibility score (e.g. "94% Match").

## 4. Deficiencies Flagged in AI Ops Audit
- High risk under UK/EU GDPR Article 9 regarding lifestyle profiling.
- Missing explicit fallback logic when cluster apartment is partially filled by non-Amber bookings directly from university housing offices.`
  }
];

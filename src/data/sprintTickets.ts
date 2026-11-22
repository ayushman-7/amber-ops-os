import { SprintTicket } from '../types';

export const SPRINT_TICKETS: SprintTicket[] = [
  {
    id: 'AMB-1082',
    title: 'UK Guarantor Document OCR & Income Multiplier Engine',
    pod: 'Booking & Guarantors',
    storyPoints: 8,
    status: 'Blocked',
    hoursStale: 54,
    prdScore: 68,
    priority: 'P0',
    assignee: {
      name: 'Pooja Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Backend Engineer'
    },
    spilloverRootCause: {
      category: 'Third-Party OCR Downtime',
      summary: 'AWS Textract timeout on multi-page Spanish bank statements submitted by EU applicants.',
      aiConfidence: 94
    }
  },
  {
    id: 'AMB-1089',
    title: 'PBSA Live Room Availability Sync (Unite Students v2 API)',
    pod: 'Supply & PBSA Sync',
    storyPoints: 13,
    status: 'In Progress',
    hoursStale: 49,
    prdScore: 58,
    priority: 'P0',
    assignee: {
      name: 'Aditya Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Staff Platform Engineer'
    },
    spilloverRootCause: {
      category: 'Partner Webhook Latency',
      summary: 'Unite Students inventory endpoint throttling at 30 req/min during peak booking surge.',
      aiConfidence: 91
    }
  },
  {
    id: 'AMB-1094',
    title: 'Multi-Currency Rent Calculator (GBP/EUR/AUD/INR FX Hedge)',
    pod: 'Student Discovery',
    storyPoints: 5,
    status: 'Done',
    hoursStale: 4,
    prdScore: 92,
    priority: 'P1',
    assignee: {
      name: 'Tanvi Shinde',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      role: 'Product Designer / Frontend'
    },
    spilloverRootCause: {
      category: 'Missing API Specs',
      summary: 'Initial scope lacked ECB weekend rate fallback; resolved with daily rate freeze buffer.',
      aiConfidence: 87
    }
  },
  {
    id: 'AMB-1098',
    title: 'Student Visa Refusal "No-Visa No-Pay" Refund Automations',
    pod: 'Booking & Guarantors',
    storyPoints: 8,
    status: 'Stale',
    hoursStale: 62,
    prdScore: 61,
    priority: 'P0',
    assignee: {
      name: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Full Stack Engineer'
    },
    spilloverRootCause: {
      category: 'Edge Case: Visa Rules',
      summary: 'Dispute handling logic missing for UK Home Office e-Visa refusal PDF verification.',
      aiConfidence: 96
    }
  },
  {
    id: 'AMB-1102',
    title: 'Campus Proximity & Commute Transit Duration Matrix',
    pod: 'Student Discovery',
    storyPoints: 5,
    status: 'In Progress',
    hoursStale: 18,
    prdScore: 89,
    priority: 'P1',
    assignee: {
      name: 'Kavita Nair',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Frontend Engineer'
    },
    spilloverRootCause: {
      category: 'Unclear Acceptance Criteria',
      summary: 'Commute times needed walking vs TfL tube options for King\'s College campuses.',
      aiConfidence: 79
    }
  },
  {
    id: 'AMB-1105',
    title: 'iQ Student Accommodation Webhook Retries & Dead Letter Queue',
    pod: 'Supply & PBSA Sync',
    storyPoints: 5,
    status: 'Blocked',
    hoursStale: 51,
    prdScore: 74,
    priority: 'P1',
    assignee: {
      name: 'Siddharth Joshi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      role: 'Backend DevOps'
    },
    spilloverRootCause: {
      category: 'Partner Webhook Latency',
      summary: 'iQ partner webhook sends duplicate tenancy IDs during room release spikes.',
      aiConfidence: 88
    }
  },
  {
    id: 'AMB-1110',
    title: 'Dual Occupancy Studio Price Delta Rules Engine',
    pod: 'Booking & Guarantors',
    storyPoints: 5,
    status: 'In Review',
    hoursStale: 26,
    prdScore: 84,
    priority: 'P2',
    assignee: {
      name: 'Vikram Patwardhan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Frontend'
    },
    spilloverRootCause: {
      category: 'Unclear Acceptance Criteria',
      summary: 'PBSA partner contract clauses differ on extra £30/week utility surcharge vs flat rate.',
      aiConfidence: 82
    }
  },
  {
    id: 'AMB-1114',
    title: 'AI Smart Roommate Compatibility Matching Questionnaire',
    pod: 'Student Discovery',
    storyPoints: 8,
    status: 'In Progress',
    hoursStale: 14,
    prdScore: 91,
    priority: 'P2',
    assignee: {
      name: 'Neha Chawla',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      role: 'AI / ML Engineer'
    },
    spilloverRootCause: {
      category: 'Legal/Compliance Review',
      summary: 'Pending compliance sign-off on dietary/lifestyle preference indexing under UK GDPR.',
      aiConfidence: 86
    }
  },
  {
    id: 'AMB-1118',
    title: 'TCAS PMS StarRez Two-Way Reservation State Sync',
    pod: 'Supply & PBSA Sync',
    storyPoints: 13,
    status: 'In Progress',
    hoursStale: 33,
    prdScore: 65,
    priority: 'P0',
    assignee: {
      name: 'Aditya Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Staff Platform Engineer'
    },
    spilloverRootCause: {
      category: 'Missing API Specs',
      summary: 'StarRez SOAP v12 envelope payload schema deprecated without backward compatibility note.',
      aiConfidence: 93
    }
  },
  {
    id: 'AMB-1122',
    title: 'Early Bird 51-Week vs 44-Week Lease Filter Toggle',
    pod: 'Student Discovery',
    storyPoints: 3,
    status: 'Done',
    hoursStale: 6,
    prdScore: 95,
    priority: 'P2',
    assignee: {
      name: 'Tanvi Shinde',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      role: 'Frontend Engineer'
    },
    spilloverRootCause: {
      category: 'Unclear Acceptance Criteria',
      summary: 'Edge cases on 40-week foundation year contracts resolved with custom tenancy bounds.',
      aiConfidence: 75
    }
  },
  {
    id: 'AMB-1125',
    title: 'Council Tax Exemption Document Upload & Validation',
    pod: 'Booking & Guarantors',
    storyPoints: 5,
    status: 'In Review',
    hoursStale: 19,
    prdScore: 88,
    priority: 'P1',
    assignee: {
      name: 'Pooja Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Backend Engineer'
    },
    spilloverRootCause: {
      category: 'Missing API Specs',
      summary: 'Validation rule needed distinction between Scottish matriculation numbers and UK student ID.',
      aiConfidence: 84
    }
  },
  {
    id: 'AMB-1129',
    title: 'Scape Australia Automated Bond Lodgement API Integration',
    pod: 'Supply & PBSA Sync',
    storyPoints: 8,
    status: 'Blocked',
    hoursStale: 58,
    prdScore: 52,
    priority: 'P0',
    assignee: {
      name: 'Siddharth Joshi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      role: 'Backend DevOps'
    },
    spilloverRootCause: {
      category: 'Legal/Compliance Review',
      summary: 'Victorian RTBA (Residential Tenancies Bond Authority) OAuth2 token renewal requirements.',
      aiConfidence: 97
    }
  },
  {
    id: 'AMB-1133',
    title: 'University Partner White-Label Portal Custom Theme Engine',
    pod: 'Student Discovery',
    storyPoints: 5,
    status: 'Done',
    hoursStale: 2,
    prdScore: 94,
    priority: 'P2',
    assignee: {
      name: 'Kavita Nair',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Frontend Engineer'
    },
    spilloverRootCause: {
      category: 'Unclear Acceptance Criteria',
      summary: 'Subdomain routing and co-branded logo aspect ratios clarified in sprint mid-check.',
      aiConfidence: 78
    }
  },
  {
    id: 'AMB-1137',
    title: 'Stripe Escrow Split Payouts for PBSA Management Fees',
    pod: 'Booking & Guarantors',
    storyPoints: 8,
    status: 'In Progress',
    hoursStale: 22,
    prdScore: 86,
    priority: 'P1',
    assignee: {
      name: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Full Stack Engineer'
    },
    spilloverRootCause: {
      category: 'Legal/Compliance Review',
      summary: 'Irish Central Bank VAT split for Dublin PBSAs required custom transfer grouping.',
      aiConfidence: 89
    }
  },
  {
    id: 'AMB-1140',
    title: 'Real-time WebSocket Push for Flash Inventory Clearance',
    pod: 'Supply & PBSA Sync',
    storyPoints: 5,
    status: 'Done',
    hoursStale: 8,
    prdScore: 90,
    priority: 'P1',
    assignee: {
      name: 'Aditya Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Staff Platform Engineer'
    },
    spilloverRootCause: {
      category: 'Partner Webhook Latency',
      summary: 'Initial connection storms mitigated by introducing Redis cluster pub/sub channels.',
      aiConfidence: 85
    }
  }
];

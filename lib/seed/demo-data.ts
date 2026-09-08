import {
  UserProfile,
  Workspace,
  Channel,
  Message,
  Project,
  Task,
  Meeting,
  KnowledgePage,
  GitHubPullRequest,
  GitHubCommit,
  NotificationItem,
  AIDailyBriefing,
  Sprint,
} from '@/types/workspace.types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  alex: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'alex@backlet.dev',
    fullName: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    roleTitle: 'Lead Architect',
    status: 'online',
    bio: 'Distributed systems, Next.js, and real-time collaboration engines.',
    githubUsername: 'arivera-dev',
  },
  maya: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'maya@backlet.dev',
    fullName: 'Maya Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    roleTitle: 'Full-stack Engineer',
    status: 'busy',
    bio: 'Crafting fluid UI, Tiptap editors, and accessible component architectures.',
    githubUsername: 'mayachen-tech',
  },
  jordan: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'jordan@backlet.dev',
    fullName: 'Jordan Taylor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    roleTitle: 'Head of Product',
    status: 'away',
    bio: 'Bridging engineering velocity and customer workflows.',
    githubUsername: 'jtaylor-product',
  },
  sam: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'sam@backlet.dev',
    fullName: 'Sam Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    roleTitle: 'Staff DevOps Engineer',
    status: 'online',
    bio: 'Kubernetes clusters, multi-region database latency, and CI/CD pipelines.',
    githubUsername: 'swilson-ops',
  },
};

export const DEMO_WORKSPACE: Workspace = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Backlet Labs',
  slug: 'backlet-labs',
  plan: 'pro',
  ownerId: DEMO_PROFILES.alex.id,
  role: 'owner',
  createdAt: '2026-01-15T09:00:00Z',
};

export const DEMO_CHANNELS: Channel[] = [
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'general',
    description: 'Company-wide announcements, milestones, and high-level updates.',
    isPrivate: false,
    memberCount: 18,
    unreadCount: 0,
    createdBy: DEMO_PROFILES.alex.id,
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'engineering',
    description: 'Architecture discussions, pull requests, tech debt, and deployments.',
    isPrivate: false,
    memberCount: 12,
    unreadCount: 3,
    createdBy: DEMO_PROFILES.alex.id,
    createdAt: '2026-01-15T09:10:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'product',
    description: 'Roadmaps, user feedback synthesis, RFC specs, and sprint planning.',
    isPrivate: false,
    memberCount: 9,
    unreadCount: 1,
    createdBy: DEMO_PROFILES.jordan.id,
    createdAt: '2026-01-15T09:20:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'design',
    description: 'Design system components, Figma files, and UI polish discussions.',
    isPrivate: false,
    memberCount: 6,
    unreadCount: 0,
    createdBy: DEMO_PROFILES.maya.id,
    createdAt: '2026-01-15T09:30:00Z',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'Backlet Web',
    key: 'BW',
    description: 'Core Next.js workspace platform, Realtime sync engine, and state machine.',
    lead: DEMO_PROFILES.alex,
    status: 'active',
    color: '#6366f1',
    targetDate: '2026-10-15',
    progressPercent: 78,
    tasksCount: { total: 24, completed: 18, inProgress: 4, blocked: 2 },
    githubRepoUrl: 'https://github.com/backlet/backlet-web',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccc0002',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'AI Assistant & Copilot',
    key: 'AI',
    description: 'Meeting intelligence pipeline, semantic doc retrieval, and proactive briefs.',
    lead: DEMO_PROFILES.maya,
    status: 'active',
    color: '#10b981',
    targetDate: '2026-11-01',
    progressPercent: 62,
    tasksCount: { total: 16, completed: 10, inProgress: 5, blocked: 1 },
    githubRepoUrl: 'https://github.com/backlet/backlet-ai',
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccc0003',
    workspaceId: DEMO_WORKSPACE.id,
    name: 'Mobile App',
    key: 'MOB',
    description: 'React Native companion app for on-the-go notifications and audio huddles.',
    lead: DEMO_PROFILES.jordan,
    status: 'planned',
    color: '#f59e0b',
    targetDate: '2026-12-20',
    progressPercent: 20,
    tasksCount: { total: 10, completed: 2, inProgress: 2, blocked: 0 },
    githubRepoUrl: 'https://github.com/backlet/backlet-mobile',
    createdAt: '2026-03-01T00:00:00Z',
  },
];

export const DEMO_SPRINT: Sprint = {
  id: 'sprint-14',
  workspaceId: DEMO_WORKSPACE.id,
  projectId: DEMO_PROJECTS[0].id,
  name: 'Sprint 14: Realtime Engine & Copilot',
  goal: 'Ship OAuth PKCE authentication, live meeting room video canvas, and AI summary extraction.',
  startDate: '2026-09-01',
  endDate: '2026-09-15',
  status: 'active',
};

export const DEMO_TASKS: Task[] = [
  {
    id: 'task-101',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    projectName: 'Backlet Web',
    projectKey: 'BW',
    sprintId: 'sprint-14',
    taskNumber: 142,
    title: 'Implement OAuth 2.0 PKCE flow with Supabase Auth & Google',
    description: 'Support seamless sign-in with Google OAuth and session persistence across SSR routes with automatic token refresh.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: DEMO_PROFILES.alex,
    creator: DEMO_PROFILES.jordan,
    labels: ['auth', 'security', 'backend'],
    dueDate: '2026-09-10',
    subtasks: [
      { id: 'st-1', title: 'Add Supabase Auth SSR middleware cookie handler', completed: true },
      { id: 'st-2', title: 'Verify Google OAuth callback URL handling', completed: true },
      { id: 'st-3', title: 'Test multi-tenant RLS session token validation', completed: false },
    ],
    commentsCount: 4,
    githubPrNumber: 142,
    githubPrUrl: 'https://github.com/backlet/backlet-web/pull/142',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-08T09:30:00Z',
  },
  {
    id: 'task-102',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[1].id,
    projectName: 'AI Assistant',
    projectKey: 'AI',
    sprintId: 'sprint-14',
    taskNumber: 88,
    title: 'Extract action items & decisions automatically from meeting transcripts',
    description: 'Build server-side LLM extraction that parses meeting audio notes into key decisions and direct 1-click convertible Linear tasks.',
    status: 'in_review',
    priority: 'high',
    assignee: DEMO_PROFILES.maya,
    creator: DEMO_PROFILES.alex,
    labels: ['ai', 'meetings', 'nlp'],
    dueDate: '2026-09-11',
    subtasks: [
      { id: 'st-4', title: 'Define structured JSON schema for decisions & action items', completed: true },
      { id: 'st-5', title: 'Build task conversion button inside Meeting UI', completed: true },
      { id: 'st-6', title: 'Add fallback parsing for unstructured transcripts', completed: true },
    ],
    commentsCount: 2,
    githubPrNumber: 88,
    githubPrUrl: 'https://github.com/backlet/backlet-ai/pull/88',
    createdAt: '2026-09-03T11:20:00Z',
    updatedAt: '2026-09-08T11:00:00Z',
  },
  {
    id: 'task-103',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    projectName: 'Backlet Web',
    projectKey: 'BW',
    sprintId: 'sprint-14',
    taskNumber: 143,
    title: 'Design interactive video room UI with screen share & speaker grid',
    description: 'Modern WebRTC-ready layout featuring participant tiles, mic/camera controls, floating reactions, and side-by-side synchronized notes.',
    status: 'in_progress',
    priority: 'high',
    assignee: DEMO_PROFILES.maya,
    creator: DEMO_PROFILES.alex,
    labels: ['frontend', 'webrtc', 'ui'],
    dueDate: '2026-09-12',
    subtasks: [
      { id: 'st-7', title: 'Responsive 2x2 and spotlight grid layouts', completed: true },
      { id: 'st-8', title: 'Microphone & camera state toggle buttons', completed: true },
      { id: 'st-9', title: 'Integrated meeting chat & live notes panel', completed: false },
    ],
    commentsCount: 1,
    createdAt: '2026-09-04T14:15:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'task-104',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    projectName: 'Backlet Web',
    projectKey: 'BW',
    sprintId: 'sprint-14',
    taskNumber: 144,
    title: 'Deploy Kubernetes Helm chart & optimize multi-region Supabase replica routing',
    description: 'Ensure WebSocket connections handle regional failover and keep latency below 45ms across US and EU zones.',
    status: 'todo',
    priority: 'high',
    assignee: DEMO_PROFILES.sam,
    creator: DEMO_PROFILES.alex,
    labels: ['devops', 'infra', 'k8s'],
    dueDate: '2026-09-14',
    subtasks: [
      { id: 'st-10', title: 'Configure horizontal pod autoscaling for edge pods', completed: false },
      { id: 'st-11', title: 'Benchmark read replica latency under 10k concurrent pings', completed: false },
    ],
    commentsCount: 0,
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-07T16:00:00Z',
  },
  {
    id: 'task-105',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[1].id,
    projectName: 'AI Assistant',
    projectKey: 'AI',
    sprintId: 'sprint-14',
    taskNumber: 89,
    title: 'Build permission-aware semantic search with pgvector',
    description: 'Index documents, messages, and meeting notes with embeddings while strictly respecting workspace membership and private channel RLS.',
    status: 'backlog',
    priority: 'medium',
    assignee: DEMO_PROFILES.alex,
    creator: DEMO_PROFILES.jordan,
    labels: ['ai', 'search', 'pgvector'],
    dueDate: '2026-09-22',
    subtasks: [
      { id: 'st-12', title: 'Write pgvector schema migration and cosine index', completed: false },
      { id: 'st-13', title: 'Implement embedding chunking worker', completed: false },
    ],
    commentsCount: 3,
    createdAt: '2026-09-06T15:00:00Z',
    updatedAt: '2026-09-08T08:00:00Z',
  },
  {
    id: 'task-106',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    projectName: 'Backlet Web',
    projectKey: 'BW',
    sprintId: 'sprint-14',
    taskNumber: 139,
    title: 'Global keyboard shortcuts & Cmd+K command palette',
    description: 'Instant omni-search across channels, docs, tasks, meetings, and team members with arrow navigation and action triggers.',
    status: 'done',
    priority: 'medium',
    assignee: DEMO_PROFILES.maya,
    creator: DEMO_PROFILES.maya,
    labels: ['frontend', 'ux', 'accessibility'],
    dueDate: '2026-09-07',
    subtasks: [
      { id: 'st-14', title: 'Register global Cmd+K listener', completed: true },
      { id: 'st-15', title: 'Add quick action filters for tasks, channels, docs', completed: true },
    ],
    commentsCount: 5,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-07T18:00:00Z',
  },
];

export const DEMO_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    workspaceId: DEMO_WORKSPACE.id,
    channelId: DEMO_CHANNELS[1].id, // #engineering
    senderId: DEMO_PROFILES.alex.id,
    sender: DEMO_PROFILES.alex,
    content: `Team, PR #142 is ready for review! 🚀\n\nIt introduces the unified OAuth 2.0 PKCE flow with Supabase SSR tokens. Check out the diff: \`https://github.com/backlet/backlet-web/pull/142\`\n\nCan someone verify the callback redirect flow on localhost?`,
    reactions: [
      { id: 'r1', messageId: 'msg-1', profileId: DEMO_PROFILES.maya.id, emoji: '👀', userName: 'Maya Chen' },
      { id: 'r2', messageId: 'msg-1', profileId: DEMO_PROFILES.jordan.id, emoji: '🔥', userName: 'Jordan Taylor' },
      { id: 'r3', messageId: 'msg-1', profileId: DEMO_PROFILES.sam.id, emoji: '👍', userName: 'Sam Wilson' },
    ],
    replyCount: 2,
    isPinned: true,
    createdAt: '2026-09-08T09:15:00Z',
  },
  {
    id: 'msg-2',
    workspaceId: DEMO_WORKSPACE.id,
    channelId: DEMO_CHANNELS[1].id,
    parentId: 'msg-1',
    senderId: DEMO_PROFILES.maya.id,
    sender: DEMO_PROFILES.maya,
    content: `Taking a look right now! The auth cookies handle subdomain routing gracefully?`,
    reactions: [],
    createdAt: '2026-09-08T09:22:00Z',
  },
  {
    id: 'msg-3',
    workspaceId: DEMO_WORKSPACE.id,
    channelId: DEMO_CHANNELS[1].id,
    parentId: 'msg-1',
    senderId: DEMO_PROFILES.alex.id,
    sender: DEMO_PROFILES.alex,
    content: `Yes! Tested across \`app.backlet.dev\` and workspace subdomains. The session cookies are scoped with SameSite=Lax.`,
    reactions: [{ id: 'r4', messageId: 'msg-3', profileId: DEMO_PROFILES.maya.id, emoji: '🎉', userName: 'Maya Chen' }],
    createdAt: '2026-09-08T09:28:00Z',
  },
  {
    id: 'msg-4',
    workspaceId: DEMO_WORKSPACE.id,
    channelId: DEMO_CHANNELS[1].id,
    senderId: DEMO_PROFILES.sam.id,
    sender: DEMO_PROFILES.sam,
    content: `Quick infra heads up: staging deployment for Kubernetes cluster v1.30 was successful. WebSocket heartbeat latencies are averaging **22ms** in us-east.`,
    reactions: [
      { id: 'r5', messageId: 'msg-4', profileId: DEMO_PROFILES.alex.id, emoji: '⚡', userName: 'Alex Rivera' },
    ],
    createdAt: '2026-09-08T10:05:00Z',
  },
];

export const DEMO_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    projectName: 'Backlet Web',
    title: 'Sprint 14 Engineering Sync & Architecture Review',
    description: 'Weekly engineering alignment on OAuth PKCE migration, Realtime WebSocket performance, and meeting intelligence roadmap.',
    scheduledStart: '2026-09-08T10:30:00Z',
    scheduledEnd: '2026-09-08T11:15:00Z',
    host: DEMO_PROFILES.alex,
    status: 'in_progress',
    meetingUrl: '/workspace/backlet-labs/meetings/meet-1',
    agenda: '1. PR #142 OAuth signoff\n2. Realtime WebSocket stress test results\n3. AI Copilot prompt grounding strategy',
    participants: [DEMO_PROFILES.alex, DEMO_PROFILES.maya, DEMO_PROFILES.sam, DEMO_PROFILES.jordan],
    notes: {
      id: 'mn-1',
      meetingId: 'meet-1',
      rawTranscript: `Alex: Let's discuss the OAuth 2.0 PKCE rollout. Maya, did the local test pass?
Maya: Yes! The token refresh on SSR routes is flawless. We should merge PR #142 by end of day.
Jordan: Agreed. Let's make sure the user onboarding flow preserves the invite token if someone signs up with Google OAuth.
Sam: Staging infra is completely stable. I'll monitor error rates post-merge.
Alex: Perfect. Action item for Maya: finalize the meeting room video canvas controls. Action item for Sam: configure edge ingress rate limits.`,
      summary: 'Engineering sync reviewed PR #142 (OAuth PKCE), which passed local and staging verification. The team approved merging PR #142 today. Maya will finalize video canvas controls, and Sam will setup ingress rate limiting.',
      keyDecisions: [
        'Approved merging PR #142 (OAuth 2.0 PKCE) into main today after staging smoke test.',
        'Selected WebRTC mesh for 1-6 participant video huddles with SFU fallback for larger team syncs.',
        'Adopted strict RLS policies on all vector embedding searches.',
      ],
      topics: ['Authentication Migration', 'Video Room Canvas Architecture', 'Edge Ingress & Realtime'],
      followUps: ['Benchmark token refresh under high churn', 'Review Mobile App offline SQLite sync design'],
      actionItems: [
        {
          id: 'ai-1',
          meetingId: 'meet-1',
          description: 'Finalize meeting room video canvas controls and speaker grid',
          assigneeName: 'Maya Chen',
          assigneeId: DEMO_PROFILES.maya.id,
          dueDate: '2026-09-11',
          status: 'pending',
        },
        {
          id: 'ai-2',
          meetingId: 'meet-1',
          description: 'Configure edge ingress rate limiting on Kubernetes envoy proxies',
          assigneeName: 'Sam Wilson',
          assigneeId: DEMO_PROFILES.sam.id,
          dueDate: '2026-09-12',
          status: 'pending',
        },
        {
          id: 'ai-3',
          meetingId: 'meet-1',
          description: 'Ensure invite tokens persist through Google OAuth redirection',
          assigneeName: 'Alex Rivera',
          assigneeId: DEMO_PROFILES.alex.id,
          dueDate: '2026-09-09',
          status: 'converted',
          convertedTaskId: 'task-101',
        },
      ],
    },
    createdAt: '2026-09-07T12:00:00Z',
  },
  {
    id: 'meet-2',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[1].id,
    projectName: 'AI Assistant',
    title: 'Product Roadmap Review & Q4 Planning',
    description: 'Quarterly review of customer feedback, AI copilot adoption, and mobile launch timeline.',
    scheduledStart: '2026-09-08T14:00:00Z',
    scheduledEnd: '2026-09-08T14:45:00Z',
    host: DEMO_PROFILES.jordan,
    status: 'scheduled',
    meetingUrl: '/workspace/backlet-labs/meetings/meet-2',
    agenda: '1. Q4 Feature Priorities\n2. AI Assistant Pricing Model\n3. Customer Beta Feedback',
    participants: [DEMO_PROFILES.jordan, DEMO_PROFILES.alex, DEMO_PROFILES.maya],
    createdAt: '2026-09-06T10:00:00Z',
  },
  {
    id: 'meet-3',
    workspaceId: DEMO_WORKSPACE.id,
    title: '1:1 Alex & Jordan',
    description: 'Bi-weekly leadership sync and team growth planning.',
    scheduledStart: '2026-09-08T16:30:00Z',
    scheduledEnd: '2026-09-08T17:00:00Z',
    host: DEMO_PROFILES.alex,
    status: 'scheduled',
    meetingUrl: '/workspace/backlet-labs/meetings/meet-3',
    participants: [DEMO_PROFILES.alex, DEMO_PROFILES.jordan],
    createdAt: '2026-09-05T14:00:00Z',
  },
];

export const DEMO_KNOWLEDGE_PAGES: KnowledgePage[] = [
  {
    id: 'doc-1',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    title: 'System Architecture & Realtime Engine',
    slug: 'system-architecture-realtime',
    icon: '⚡',
    category: 'Engineering',
    isFavorite: true,
    readingTimeMinutes: 5,
    author: DEMO_PROFILES.alex,
    content: `# System Architecture & Realtime Engine

Backlet provides a unified reactive data loop across:
**Discuss → Meet → Decide → Document → Assign → Build → Track**

## 1. High-Level Architecture Overview
The system is constructed with three core tiers:
- **Next.js 14 App Router**: Server Components provide optimal initial paint and zero-bundle server computation; interactive client islands handle optimistic updates and local cache.
- **Supabase Realtime & PostgreSQL**: WAL-level CDC (Change Data Capture) emits broadcast events for instant message delivery, task column drags, and typing presence.
- **AI Intelligence Worker**: Runs asynchronous NLP summarization and decision extraction on completed meetings and RFC documents.

\`\`\`
Client (Next.js) <---> Next.js Server Actions / API Routes
       ^                            |
       | (Realtime WebSocket)       v
Supabase PostgreSQL <==============='
\`\`\`

## 2. Row Level Security Guarantees
Every query and realtime subscription executes under explicit tenant security:
- Private channels are isolated to authorized members.
- Task items cannot be enumerated by external workspaces.
- AI Copilot embeddings are pre-filtered by workspace ID before vector similarity scoring.
`,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-07T14:20:00Z',
  },
  {
    id: 'doc-2',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[0].id,
    title: 'OAuth 2.0 PKCE & Session Security Specification',
    slug: 'oauth-session-security-spec',
    icon: '🔒',
    category: 'Engineering',
    isFavorite: true,
    readingTimeMinutes: 4,
    author: DEMO_PROFILES.alex,
    content: `# OAuth 2.0 PKCE & Session Security Specification

This document details the security model implemented in PR #142 for developer single sign-on.

## Key Principles
1. **Proof Key for Code Exchange (PKCE)**: Used across all web and mobile auth flows to mitigate code interception attacks.
2. **HTTP-Only Cookies**: JWT tokens are stored in secure, encrypted HTTP-only session cookies with \`SameSite=Lax\`.
3. **Session Refresh**: Automatically triggered within middleware prior to token expiry.
`,
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-09-08T08:00:00Z',
  },
  {
    id: 'doc-3',
    workspaceId: DEMO_WORKSPACE.id,
    projectId: DEMO_PROJECTS[1].id,
    title: 'AI Meeting Intelligence & Decision Extraction RFC',
    slug: 'ai-meeting-intelligence-rfc',
    icon: '🧠',
    category: 'Product',
    isFavorite: false,
    readingTimeMinutes: 6,
    author: DEMO_PROFILES.maya,
    content: `# AI Meeting Intelligence & Decision Extraction RFC

## Problem Statement
Meeting decisions frequently get lost in audio recordings and disorganized meeting notes. Developers often spend 30+ minutes after syncs writing tickets manually.

## Solution: The Backlet Loop
1. Audio stream generates synchronized transcript.
2. Structured LLM pipeline extracts:
   - **Executive Summary**
   - **Key Architectural Decisions**
   - **Action Items** with assigned developer and target date.
3. 1-Click: Developers click "Convert to Task" to populate the sprint Kanban board immediately.
`,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-06T17:30:00Z',
  },
  {
    id: 'doc-4',
    workspaceId: DEMO_WORKSPACE.id,
    title: 'Company Handbook & Engineering Culture',
    slug: 'company-handbook',
    icon: '📘',
    category: 'Handbook',
    isFavorite: false,
    readingTimeMinutes: 3,
    author: DEMO_PROFILES.jordan,
    content: `# Backlet Labs Engineering Handbook

Welcome to Backlet Labs! We build tools that make engineering teams 10x more focused, communicative, and aligned.

## Core Values
- **Bias for Execution**: Decisions belong close to the code.
- **Asynchronous Clarity**: Document what you decided so anyone across timezones can understand the "why".
- **Deep Focus**: Minimize fragmented context switching across 7 disconnected browser tabs.
`,
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
  },
];

export const DEMO_PULL_REQUESTS: GitHubPullRequest[] = [
  {
    id: 'pr-142',
    repoFullName: 'backlet/backlet-web',
    prNumber: 142,
    title: 'Implement OAuth 2.0 PKCE with Supabase & Google SSO',
    author: 'arivera-dev',
    authorAvatar: DEMO_PROFILES.alex.avatarUrl,
    branch: 'feat/oauth-pkce-ssr',
    status: 'open',
    ciStatus: 'success',
    reviewerName: 'mayachen-tech',
    reviewStatus: 'awaiting_review',
    url: 'https://github.com/backlet/backlet-web/pull/142',
    createdAt: '2026-09-08T08:30:00Z',
    commentsCount: 3,
    additions: 384,
    deletions: 42,
  },
  {
    id: 'pr-141',
    repoFullName: 'backlet/backlet-web',
    prNumber: 141,
    title: 'Optimize WebSocket heartbeat & message de-duplication cache',
    author: 'swilson-ops',
    authorAvatar: DEMO_PROFILES.sam.avatarUrl,
    branch: 'perf/websocket-heartbeat',
    status: 'merged',
    ciStatus: 'success',
    reviewerName: 'arivera-dev',
    reviewStatus: 'approved',
    url: 'https://github.com/backlet/backlet-web/pull/141',
    createdAt: '2026-09-07T14:00:00Z',
    commentsCount: 6,
    additions: 128,
    deletions: 74,
  },
  {
    id: 'pr-88',
    repoFullName: 'backlet/backlet-ai',
    prNumber: 88,
    title: 'Structured JSON output schema for meeting decision extractor',
    author: 'mayachen-tech',
    authorAvatar: DEMO_PROFILES.maya.avatarUrl,
    branch: 'feat/decision-extractor-schema',
    status: 'open',
    ciStatus: 'pending',
    reviewerName: 'arivera-dev',
    reviewStatus: 'awaiting_review',
    url: 'https://github.com/backlet/backlet-ai/pull/88',
    createdAt: '2026-09-08T11:00:00Z',
    commentsCount: 2,
    additions: 215,
    deletions: 18,
  },
];

export const DEMO_COMMITS: GitHubCommit[] = [
  {
    id: 'c-1',
    repoFullName: 'backlet/backlet-web',
    sha: '8f3a12d',
    message: 'feat(auth): complete PKCE exchange and session cookie validation',
    authorName: 'Alex Rivera',
    authorAvatar: DEMO_PROFILES.alex.avatarUrl,
    branch: 'feat/oauth-pkce-ssr',
    committedAt: '2026-09-08T08:25:00Z',
  },
  {
    id: 'c-2',
    repoFullName: 'backlet/backlet-ai',
    sha: '4d91b8a',
    message: 'test(nlp): add test fixture for multi-speaker decision parsing',
    authorName: 'Maya Chen',
    authorAvatar: DEMO_PROFILES.maya.avatarUrl,
    branch: 'feat/decision-extractor-schema',
    committedAt: '2026-09-08T10:45:00Z',
  },
  {
    id: 'c-3',
    repoFullName: 'backlet/backlet-web',
    sha: 'e2098b1',
    message: 'chore(helm): tune ingress timeout parameters to 120s',
    authorName: 'Sam Wilson',
    authorAvatar: DEMO_PROFILES.sam.avatarUrl,
    branch: 'main',
    committedAt: '2026-09-07T16:15:00Z',
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    workspaceId: DEMO_WORKSPACE.id,
    title: 'PR Review Requested',
    message: 'Alex Rivera requested your review on PR #142 (OAuth 2.0 PKCE)',
    type: 'pr_review',
    linkUrl: '/workspace/backlet-labs/github',
    isRead: false,
    createdAt: '2026-09-08T09:15:00Z',
  },
  {
    id: 'notif-2',
    workspaceId: DEMO_WORKSPACE.id,
    title: 'Meeting in 15 minutes',
    message: 'Sprint 14 Engineering Sync starts at 10:30 AM',
    type: 'meeting_reminder',
    linkUrl: '/workspace/backlet-labs/meetings/meet-1',
    isRead: false,
    createdAt: '2026-09-08T10:15:00Z',
  },
  {
    id: 'notif-3',
    workspaceId: DEMO_WORKSPACE.id,
    title: 'New Mention in #engineering',
    message: 'Alex mentioned you: "Can someone verify the callback redirect flow?"',
    type: 'mention',
    linkUrl: '/workspace/backlet-labs/channels/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002',
    isRead: true,
    createdAt: '2026-09-08T09:16:00Z',
  },
];

export const DEMO_AI_BRIEFING: AIDailyBriefing = {
  greeting: 'Good morning, Alex 👋',
  dateStr: 'Tuesday, Sep 8, 2026',
  tasksDueCount: 3,
  prsAwaitingCount: 2,
  meetingsTodayCount: 3,
  unreadMessagesCount: 4,
  focusGoal: {
    title: 'Implement OAuth 2.0 PKCE Flow',
    progress: 80,
  },
  aiSummary:
    'Your API project has 2 open blockers. Two pull requests (PR #142 and PR #88) await review. You have the Sprint 14 Engineering Sync at 10:30 AM.',
  blockers: [
    'PR #142 needs final review from Maya Chen before staging merge.',
    'Kubernetes edge ingress limits require Sam to deploy Envoy config.',
  ],
};

# 🚀 Backlet — Enterprise Developer & Professional Workspace

## 📺 Project Demonstration

Click the image below to watch the full walkthrough of Backlet!

<p align="center">
  <a href="https://youtu.be/WviW8aUq5VY?si=wzkTezZ1xQ8MkqGG">
    <img src="https://youtube.com" alt="Watch the Backlet Demo" width="600">
  </a>
</p>


> **"Your team's workspace, meetings, knowledge, and execution in one place."**

Backlet is a modern, full-stack collaborative productivity platform designed around the real-world engineering and product lifecycle:

$$\mathbf{Discuss} \longrightarrow \mathbf{Meet} \longrightarrow \mathbf{Decide} \longrightarrow \mathbf{Document} \longrightarrow \mathbf{Assign} \longrightarrow \mathbf{Build} \longrightarrow \mathbf{Track}$$

Instead of fragmenting work across 6 different browser tabs (Slack, Google Meet, Notion, Linear/Jira, GitHub, Calendar), Backlet connects every stage seamlessly:
- **Slack-Grade Realtime Chat**: Channels, direct messages, thread drawers, emoji reactions, and 1-click conversion of messages into Linear tasks or Notion documents.
- **AI Meeting Intelligence & WebRTC Room**: Live video rooms with speaker visualizers, mic/camera controls, automated transcript analysis, structured executive summaries, key decisions, and 1-click action item task assignment.
- **Linear-Grade Tasks & Sprints**: Interactive Kanban board (`Backlog`, `Todo`, `In Progress`, `In Review`, `Done`), List View, Sprint milestones, subtask checklists, and issue comments.
- **Notion-Grade Knowledge Hub**: Nested page hierarchy, category tagging (`Engineering`, `Product`, `Design`, `Handbook`), and rich Markdown editor with live preview.
- **GitHub Integration & Velocity Hub**: Pull request review queue, commit activity, branch tracking, CI/CD status indicators, and engineering velocity metrics without intrusive surveillance.
- **Omni AI Copilot & Command Palette (`Cmd/Ctrl + K`)**: Context-aware assistant querying discussions, meetings, and RFC docs with strict Row Level Security (RLS) tenant isolation.

---

## 📑 Table of Contents

1. [Architecture & Tech Stack](#-architecture--tech-stack)
2. [Project Structure](#-project-structure)
3. [Prerequisites & Local Quickstart](#-prerequisites--local-quickstart)
4. [Connecting the Full Backend (Supabase)](#-connecting-the-full-backend-supabase)
   - [Step 1: Create Supabase Project](#step-1-create-supabase-project)
   - [Step 2: Apply Database Migrations & RLS](#step-2-apply-database-migrations--rls)
   - [Step 3: Seed Demo Data](#step-3-seed-demo-data)
   - [Step 4: Configure Supabase Authentication (Email & Google OAuth)](#step-4-configure-supabase-authentication)
   - [Step 5: Enable Supabase Realtime Channels](#step-5-enable-supabase-realtime-channels)
   - [Step 6: Configure Supabase Storage Buckets](#step-6-configure-supabase-storage-buckets)
5. [AI Provider Setup (OpenAI / Gemini / Anthropic)](#-ai-provider-setup)
6. [GitHub Integration Setup](#-github-integration-setup)
7. [Production Deployment](#-production-deployment)
   - [Option A: Vercel (One-Click)](#option-a-deploy-to-vercel)
   - [Option B: Docker & Container Deployment](#option-b-docker--container-deployment)
8. [Security & Permissions Model](#-security--permissions-model)
9. [Verification & Health Checks](#-verification--health-checks)
10. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏛️ Architecture & Tech Stack

```
                                 ┌─────────────────────────┐
                                 │   Next.js 14 Frontend   │
                                 │  (App Router, RSC, UI)  │
                                 └───────────┬─────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
            ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
            │  Next.js Server  │   │ Supabase Realtime│   │ Supabase Storage │
            │  Actions & APIs  │   │  (WebSockets)    │   │ (Files & Assets) │
            └─────────┬────────┘   └─────────┬────────┘   └──────────────────┘
                      │                      │
                      └──────────────┬───────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │    PostgreSQL on Supabase    │
                      │  • 20 Relational Tables      │
                      │  • Row Level Security (RLS)  │
                      │  • pgvector Semantic Search  │
                      └──────────────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.2 (App Router) | React Server Components, SSR, static page optimization |
| **Language** | TypeScript 5.4 (Strict Mode) | Strong domain modeling and compile-time type safety |
| **Styling & Design** | Tailwind CSS + custom tokens | Clean zinc/slate dark & light theme system |
| **Icons** | Lucide React | Clean, scalable developer icons |
| **Data & State Layer** | `@supabase/ssr` + Central Store | Hybrid architecture supporting local persistence & live Supabase |
| **Database** | PostgreSQL 15 via Supabase | Relational schema with UUID primary keys & foreign constraints |
| **Security** | Supabase Row Level Security | Tenant-level isolation enforcing workspace membership |
| **Realtime** | Supabase Realtime (WAL CDC) | Live message delivery, typing indicators, presence, task updates |
| **AI Intelligence** | Next.js Server API Routes | Decision extraction, structured action items, copilot answers |

---

## 📁 Project Structure

```
backlet/
├── app/
│   ├── (auth)/                               # Authentication routes
│   │   ├── login/page.tsx                    # Sign in + 1-click persona switcher
│   │   ├── signup/page.tsx                   # Registration leading to wizard
│   │   ├── forgot-password/page.tsx          # Password recovery
│   │   └── reset-password/page.tsx           # Password update
│   ├── (onboarding)/
│   │   └── onboarding/page.tsx               # 4-step workspace setup wizard
│   ├── workspace/
│   │   └── [workspaceId]/                    # Multi-tenant workspace routes
│   │       ├── layout.tsx                    # Sidebar, topbar, Cmd+K, AI copilot
│   │       ├── dashboard/page.tsx            # Personal dashboard & AI briefing
│   │       ├── inbox/page.tsx                # Mentions, unread alerts, notifications
│   │       ├── messages/page.tsx             # Direct 1-on-1 team messaging
│   │       ├── channels/[channelId]/page.tsx # Channels, threads, task conversion
│   │       ├── meetings/
│   │       │   ├── page.tsx                  # Calendar schedule & meeting archive
│   │       │   └── [meetingId]/page.tsx      # Video room UI & AI intelligence panel
│   │       ├── projects/
│   │       │   ├── page.tsx                  # Active projects directory & velocity
│   │       │   └── [projectId]/page.tsx      # Project detail, linked tasks & RFCs
│   │       ├── tasks/page.tsx                # Linear Kanban board, list view, subtasks
│   │       ├── knowledge/
│   │       │   ├── page.tsx                  # Documentation hub & templates
│   │       │   └── [pageId]/page.tsx         # Notion-like markdown reader/editor
│   │       ├── github/page.tsx               # PR review tracker, commits, velocity
│   │       ├── search/page.tsx               # Deep workspace semantic search
│   │       ├── notifications/page.tsx        # Notification center
│   │       ├── settings/page.tsx             # Workspace roles, integrations, billing
│   │       └── profile/page.tsx              # Availability status & persona switch
│   ├── api/                                  # Server-side API endpoints
│   │   ├── ai/copilot/route.ts               # RLS-aware AI Copilot query engine
│   │   ├── ai/meeting-summary/route.ts       # Structured transcript decision extractor
│   │   └── seed/route.ts                     # Verification payload endpoint
│   ├── globals.css                           # Dark/Light CSS variables & tokens
│   ├── layout.tsx                            # Root HTML layout with ThemeProvider
│   └── page.tsx                              # Landing page with instant launch buttons
├── components/
│   ├── ui/                                   # Button, Card, Input, Badge, Avatar, Modal
│   ├── navigation/                           # Sidebar, Topbar
│   ├── command/                              # CommandPalette (Cmd+K omnisearch)
│   ├── copilot/                              # AICopilotDrawer (Floating assistant)
│   └── theme-provider.tsx                    # Dark / Light / System theme context
├── lib/
│   ├── supabase/                             # Browser client, server client, middleware
│   ├── db/store.ts                           # Unified data store with local persistence
│   ├── seed/demo-data.ts                     # "Backlet Labs" rich seed dataset
│   └── utils.ts                              # Classnames (cn), date & time formatters
├── types/
│   └── workspace.types.ts                    # Strongly typed domain models
├── supabase/
│   ├── migrations/
│   │   └── 20240908000000_init_backlet_schema.sql  # Complete PostgreSQL RLS schema
│   └── seed.sql                              # SQL seed script for Supabase dashboard
├── .env.example                              # Environment variables template
├── package.json                              # Dependencies and build scripts
├── tailwind.config.js                        # Tailwind CSS styling configuration
└── tsconfig.json                             # Strict TypeScript configuration
```

---

## 💻 Prerequisites & Local Quickstart

### 1. Prerequisites
- **Node.js**: v18.16+ (or v20+)
- **npm**: v9+ (or pnpm / yarn)

### 2. Install & Run
```bash
# Clone or navigate to the repository
cd C:\Users\downloads\backlet

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

> [!NOTE]
> Backlet features an intelligent **Zero-Friction Fallback Layer**. Out of the box, the app loads with the pre-seeded **"Backlet Labs"** workspace (Alex, Maya, Jordan, Sam, Sprint 14 tasks, meetings, channels, and docs). You can test all UI features immediately even before provisioning a cloud backend!

---

## 🔌 Connecting the Full Backend (Supabase)

To connect Backlet to a live production database with realtime updates, user authentication, and persistent cloud storage, follow these steps:

### Step 1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **"New Project"**.
3. Choose your project name (e.g. `backlet-production`), set a strong database password, and choose your preferred geographic region.
4. Once provisioned, go to **Project Settings ➔ API**.
5. Copy the following credentials:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **Project API Anon Key** (`eyJh...`)
   - **Project API Service Role Key** (`eyJh...` - keep this secret!)

---

### Step 2: Apply Database Migrations & RLS
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **"New Query"**.
3. Copy the entire contents of [`supabase/migrations/20240908000000_init_backlet_schema.sql`](file:///C:/Users/vlsi/.gemini/antigravity/scratch/backlet/supabase/migrations/20240908000000_init_backlet_schema.sql).
4. Paste into the SQL editor and click **Run**.

This will automatically create:
- All 20 tables (`profiles`, `workspaces`, `workspace_members`, `channels`, `channel_members`, `messages`, `tasks`, `projects`, `meetings`, `knowledge_pages`, `github_*`, `notifications`, etc.).
- Primary keys, foreign key constraints, and performance indexes.
- The `is_workspace_member()` security definer function.
- Row Level Security (RLS) policies ensuring complete data privacy across workspaces.

---

### Step 3: Seed Demo Data
To populate your cloud database with realistic starter data:
1. In the Supabase **SQL Editor**, open another new query.
2. Copy the contents of [`supabase/seed.sql`](file:///C:/Users/vlsi/.gemini/antigravity/scratch/backlet/supabase/seed.sql).
3. Paste and click **Run**.

This seeds the "Backlet Labs" workspace, team profiles, channels, active projects, and initial tasks.

---

### Step 4: Configure Supabase Authentication

#### A. Email / Password Sign In
1. In Supabase Dashboard, navigate to **Authentication ➔ Providers**.
2. Ensure **Email** is enabled.
3. (Optional for local testing) In **Authentication ➔ URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (or your production URL `https://your-domain.com`)
   - **Redirect URLs**:
     - `http://localhost:3000/**`
     - `https://your-domain.com/**`

#### B. Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create an OAuth 2.0 Client ID under **APIs & Services ➔ Credentials**.
3. Add Authorized Redirect URI from Supabase:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client Secret** into Supabase Dashboard under **Authentication ➔ Providers ➔ Google**.

---

### Step 5: Enable Supabase Realtime Channels
To ensure messages, task column movements, and notifications broadcast in realtime:
1. In Supabase Dashboard, go to **Database ➔ Replication**.
2. Under **Source: supabase_realtime**, toggle **ON** replication for the following tables:
   - `messages`
   - `message_reactions`
   - `tasks`
   - `notifications`
   - `meeting_notes`

---

### Step 6: Configure Supabase Storage Buckets
Backlet supports file attachments, documents, and profile avatars:
1. In Supabase Dashboard, go to **Storage ➔ New Bucket**.
2. Create a bucket named `attachments`:
   - Set **Public bucket** to `false` (authenticated workspace access only).
3. Create a bucket named `avatars`:
   - Set **Public bucket** to `true`.
4. In the **Policies** tab for `attachments`, add a policy:
   - **Allowed operations**: `SELECT`, `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.role() = 'authenticated'`

---

### Step 7: Update Environment Variables
Create `.env.local` in your project root:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
# Supabase Live Backend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Restart your development server (`npm run dev`). Backlet will now automatically communicate with your live Supabase database!

---

## 🧠 AI Provider Setup

Backlet includes server-side AI endpoints for:
1. **Meeting Intelligence**: Summarizes transcripts, extracts key decisions, and creates structured action items.
2. **Omni Copilot**: Answers workspace questions citing specific meetings, RFC docs, and PRs.

To connect your own LLM provider, add your API key to `.env.local`:

### Using Google Gemini (Recommended)
```env
GEMINI_API_KEY=AIzaSy...
```

### Using OpenAI
```env
OPENAI_API_KEY=sk-...
```

The API endpoints in `app/api/ai/copilot/route.ts` and `app/api/ai/meeting-summary/route.ts` use server-side execution, ensuring **your API keys are never exposed to the frontend browser**.

---

## 🐙 GitHub Integration Setup

Backlet can track pull requests, commits, and CI status directly in the workspace.

1. Go to **GitHub ➔ Settings ➔ Developer Settings ➔ OAuth Apps ➔ New OAuth App**.
2. Fill in:
   - **Application Name**: `Backlet Workspace`
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Add your credentials to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

---

## 🚢 Production Deployment

### Option A: Deploy to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Backlet workspace"
   git remote add origin https://github.com/your-org/backlet.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `backlet` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel production URL, e.g. `https://backlet.vercel.app`)
5. Click **Deploy**. Vercel will build the Next.js bundle and deploy to global edge CDNs.

---

### Option B: Docker & Container Deployment

A production-ready multi-stage `Dockerfile` is included.

#### 1. Build the Docker image
```bash
docker build -t backlet:latest .
```

#### 2. Run with Docker Compose
```bash
docker-compose up -d
```

Your containerized Backlet application is now running on port `3000` with automated health checks!

---

## 🔐 Security & Permissions Model

Backlet enforces strict data isolation at every layer:

1. **Database Row Level Security (RLS)**:
   - Workspaces, channels, messages, tasks, and documents have active RLS policies.
   - The PostgreSQL helper function `is_workspace_member(workspace_id)` prevents cross-tenant enumeration.
2. **Private Channels**:
   - Private channel messages can only be queried by accounts with an explicit record in `channel_members`.
3. **AI Semantic Search Security**:
   - AI queries are pre-filtered by the user's workspace ID and private channel permissions before semantic similarity scoring.
4. **Credential Safety**:
   - Service role keys are kept strictly on the server (`SUPABASE_SERVICE_ROLE_KEY`) and are never bundled into client JS.

---

## 🧪 Verification & Health Checks

You can verify the health of your Backlet installation at any time:

### 1. Build Verification
```bash
npm run build
```
Expected output:
```
✓ Compiled successfully
✓ Generating static pages (12/12)
✓ Finalizing page optimization
```

### 2. Seed Verification API
```bash
curl http://localhost:3000/api/seed
```
Response:
```json
{
  "message": "Backlet Labs seed payload ready",
  "workspace": { "name": "Backlet Labs", "slug": "backlet-labs" },
  "teamMembersCount": 4,
  "channelsCount": 4,
  "tasksCount": 6,
  "meetingsCount": 3,
  "docsCount": 4,
  "prsCount": 3
}
```

### 3. AI Copilot Query Test
```bash
curl -X POST http://localhost:3000/api/ai/copilot \
  -H "Content-Type: application/json" \
  -d '{"query":"What did we decide about authentication?"}'
```

---

## ❓ Troubleshooting & FAQ

### Q: I get `You are using Node.js 18.16.1. For Next.js, Node.js version >= v18.17.0 is required.`
> **Solution**: A postinstall patch is configured in `package.json`. If you reinstall packages, it automatically patches `next/dist/bin/next` so Node 18.16.x runs flawlessly.

### Q: How do I switch between different team members in the demo?
> **Solution**: Navigate to the **Profile** page (`/workspace/backlet-labs/profile`) or the **Login** screen (`/login`). Click on any of the 4 demo personas (Alex, Maya, Jordan, Sam) to instantly switch perspective with full role permissions.

### Q: Does the meeting room require an active camera to test?
> **Solution**: No. The meeting room UI uses high-fidelity audio visualizer tiles and participant avatars. You can toggle microphones, cameras, screen sharing, and raise hands directly in the browser.

---

## 📄 License
Backlet is licensed under the **MIT License**. Free for commercial and open-source use.

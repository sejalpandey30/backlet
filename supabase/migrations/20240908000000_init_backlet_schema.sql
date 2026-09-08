-- Backlet Production PostgreSQL Database Schema with Row Level Security (RLS)
-- Enables UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role_title TEXT DEFAULT 'Software Engineer',
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'busy', 'away', 'dnd', 'offline')),
  bio TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACES
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan TEXT DEFAULT 'free',
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, profile_id)
);

-- 4. CHANNELS
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, name)
);

-- 5. CHANNEL MEMBERS
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, profile_id)
);

-- 6. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MESSAGE REACTIONS
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, profile_id, emoji)
);

-- 8. DIRECT MESSAGES & THREADS
CREATE TABLE IF NOT EXISTS direct_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  is_group BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS direct_conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, profile_id)
);

CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  description TEXT,
  lead_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'active', 'paused', 'completed')),
  color TEXT DEFAULT '#6366f1',
  target_date DATE,
  github_repo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, key)
);

-- 10. SPRINTS
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  task_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'in_review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  labels TEXT[] DEFAULT '{}',
  due_date TIMESTAMPTZ,
  subtasks JSONB DEFAULT '[]'::jsonb,
  github_pr_number INT,
  github_pr_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TASK COMMENTS
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. MEETINGS
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  host_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  meeting_url TEXT,
  recording_url TEXT,
  agenda TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MEETING PARTICIPANTS
CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status TEXT DEFAULT 'accepted' CHECK (rsvp_status IN ('accepted', 'declined', 'tentative')),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(meeting_id, profile_id)
);

-- 15. MEETING NOTES & INTELLIGENCE
CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID UNIQUE REFERENCES meetings(id) ON DELETE CASCADE,
  raw_transcript TEXT,
  summary TEXT,
  key_decisions TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  follow_ups TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MEETING ACTION ITEMS
CREATE TABLE IF NOT EXISTS meeting_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. KNOWLEDGE PAGES
CREATE TABLE IF NOT EXISTS knowledge_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES knowledge_pages(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT DEFAULT '📄',
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  is_favorite BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'Engineering',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. GITHUB DATA CACHE
CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  is_connected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS github_pull_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  pr_number INT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  branch TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'merged', 'closed')),
  ci_status TEXT DEFAULT 'pending' CHECK (ci_status IN ('success', 'failure', 'pending')),
  reviewer_name TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS github_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  sha TEXT NOT NULL,
  message TEXT NOT NULL,
  author_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  committed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mention', 'message', 'task_assigned', 'task_updated', 'meeting_reminder', 'pr_review', 'system')),
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ACTIVITY EVENTS
CREATE TABLE IF NOT EXISTS activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check workspace membership
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members wm
    JOIN profiles p ON wm.profile_id = p.id
    WHERE wm.workspace_id = ws_id
    AND p.auth_user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: users can read all profiles in their workspaces; users can update their own profile
CREATE POLICY "Profiles are viewable by members of shared workspaces" ON profiles
  FOR SELECT USING (
    id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM workspace_members wm1
      JOIN workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
      WHERE wm1.profile_id = profiles.id
      AND wm2.profile_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Workspaces: viewable if member
CREATE POLICY "Workspaces viewable by members" ON workspaces
  FOR SELECT USING (is_workspace_member(id));

-- Channels: public channels viewable by workspace members; private channels require channel_member
CREATE POLICY "Public channels viewable by workspace members" ON channels
  FOR SELECT USING (
    is_workspace_member(workspace_id)
    AND (
      is_private = FALSE
      OR EXISTS (
        SELECT 1 FROM channel_members cm
        JOIN profiles p ON cm.profile_id = p.id
        WHERE cm.channel_id = channels.id
        AND p.auth_user_id = auth.uid()
      )
    )
  );

-- Messages: readable if channel is accessible
CREATE POLICY "Messages readable by channel members" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = messages.channel_id
      AND is_workspace_member(c.workspace_id)
    )
  );

CREATE POLICY "Messages insertable by workspace members" ON messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- Tasks: accessible by workspace members
CREATE POLICY "Tasks viewable by workspace members" ON tasks
  FOR ALL USING (is_workspace_member(workspace_id));

-- Knowledge Pages: accessible by workspace members
CREATE POLICY "Knowledge pages viewable by workspace members" ON knowledge_pages
  FOR ALL USING (is_workspace_member(workspace_id));

-- Notifications: user can view and update their own notifications
CREATE POLICY "Notifications viewable by owner" ON notifications
  FOR SELECT USING (profile_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Notifications updatable by owner" ON notifications
  FOR UPDATE USING (profile_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

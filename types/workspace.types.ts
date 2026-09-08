// Backlet Domain Types & Enums

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'guest';
export type UserStatus = 'online' | 'busy' | 'away' | 'dnd' | 'offline';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  roleTitle: string;
  status: UserStatus;
  bio?: string;
  githubUsername?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  ownerId: string;
  role?: UserRole;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  profileId: string;
  role: UserRole;
  profile: UserProfile;
  joinedAt: string;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount?: number;
  unreadCount?: number;
  createdBy: string;
  createdAt: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  profileId: string;
  emoji: string;
  userName?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Message {
  id: string;
  workspaceId: string;
  channelId?: string;
  conversationId?: string;
  senderId: string;
  sender: UserProfile;
  parentId?: string;
  content: string;
  attachments?: MessageAttachment[];
  reactions: MessageReaction[];
  replyCount?: number;
  isPinned?: boolean;
  isEdited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: UserProfile;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName?: string;
  projectKey?: string;
  sprintId?: string;
  taskNumber: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: UserProfile;
  creator?: UserProfile;
  labels: string[];
  dueDate?: string;
  subtasks: TaskSubtask[];
  commentsCount?: number;
  comments?: TaskComment[];
  githubPrNumber?: number;
  githubPrUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description?: string;
  lead?: UserProfile;
  status: 'planned' | 'active' | 'paused' | 'completed';
  color: string;
  targetDate?: string;
  progressPercent: number;
  tasksCount: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  githubRepoUrl?: string;
  createdAt: string;
}

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MeetingActionItem {
  id: string;
  meetingId: string;
  description: string;
  assigneeName?: string;
  assigneeId?: string;
  dueDate?: string;
  status: 'pending' | 'converted' | 'completed';
  convertedTaskId?: string;
}

export interface MeetingNotes {
  id: string;
  meetingId: string;
  rawTranscript?: string;
  summary: string;
  keyDecisions: string[];
  topics: string[];
  followUps: string[];
  actionItems: MeetingActionItem[];
}

export interface Meeting {
  id: string;
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  host: UserProfile;
  status: MeetingStatus;
  meetingUrl: string;
  agenda?: string;
  participants: UserProfile[];
  notes?: MeetingNotes;
  createdAt: string;
}

export interface KnowledgePage {
  id: string;
  workspaceId: string;
  projectId?: string;
  parentId?: string;
  title: string;
  slug: string;
  icon: string;
  content: string;
  author: UserProfile;
  category: 'Engineering' | 'Product' | 'Design' | 'Operations' | 'Handbook';
  isFavorite: boolean;
  readingTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
  children?: KnowledgePage[];
}

export interface GitHubPullRequest {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  author: string;
  authorAvatar?: string;
  branch: string;
  status: 'open' | 'merged' | 'closed';
  ciStatus: 'success' | 'failure' | 'pending';
  reviewerName?: string;
  reviewStatus?: 'approved' | 'changes_requested' | 'awaiting_review';
  url: string;
  createdAt: string;
  commentsCount: number;
  additions: number;
  deletions: number;
}

export interface GitHubCommit {
  id: string;
  repoFullName: string;
  sha: string;
  message: string;
  authorName: string;
  authorAvatar?: string;
  branch: string;
  committedAt: string;
}

export interface NotificationItem {
  id: string;
  workspaceId: string;
  title: string;
  message: string;
  type: 'mention' | 'message' | 'task_assigned' | 'task_updated' | 'meeting_reminder' | 'pr_review' | 'system';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIDailyBriefing {
  greeting: string;
  dateStr: string;
  tasksDueCount: number;
  prsAwaitingCount: number;
  meetingsTodayCount: number;
  unreadMessagesCount: number;
  focusGoal: {
    title: string;
    progress: number;
  };
  aiSummary: string;
  blockers: string[];
}

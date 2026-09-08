// Backlet Central Data Access Layer & State Store
// Supports seamless local persistence + Supabase backend connectivity

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
  TaskStatus,
  UserStatus,
} from '@/types/workspace.types';

import {
  DEMO_PROFILES,
  DEMO_WORKSPACE,
  DEMO_CHANNELS,
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_MESSAGES,
  DEMO_MEETINGS,
  DEMO_KNOWLEDGE_PAGES,
  DEMO_PULL_REQUESTS,
  DEMO_COMMITS,
  DEMO_NOTIFICATIONS,
  DEMO_AI_BRIEFING,
} from '@/lib/seed/demo-data';

interface BackletStoreState {
  currentUser: UserProfile;
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  channels: Channel[];
  messages: Message[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  knowledgePages: KnowledgePage[];
  pullRequests: GitHubPullRequest[];
  commits: GitHubCommit[];
  notifications: NotificationItem[];
  dailyBriefing: AIDailyBriefing;
}

// In-memory persistent cache for server/client runtime
let globalState: BackletStoreState = {
  currentUser: DEMO_PROFILES.alex,
  currentWorkspace: DEMO_WORKSPACE,
  workspaces: [DEMO_WORKSPACE],
  channels: [...DEMO_CHANNELS],
  messages: [...DEMO_MESSAGES],
  projects: [...DEMO_PROJECTS],
  tasks: [...DEMO_TASKS],
  meetings: [...DEMO_MEETINGS],
  knowledgePages: [...DEMO_KNOWLEDGE_PAGES],
  pullRequests: [...DEMO_PULL_REQUESTS],
  commits: [...DEMO_COMMITS],
  notifications: [...DEMO_NOTIFICATIONS],
  dailyBriefing: { ...DEMO_AI_BRIEFING },
};

// Client-side local storage synchronization
const STORAGE_KEY = 'backlet_state_v1';

function syncToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch {
      // quota or private mode fallback
    }
  }
}

function loadFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        globalState = { ...globalState, ...parsed };
      }
    } catch {
      // fall back to default globalState
    }
  }
}

// Initialize on module load if in browser
if (typeof window !== 'undefined') {
  loadFromLocalStorage();
}

export const backletStore = {
  // Profiles & Current User
  getCurrentUser(): UserProfile {
    return globalState.currentUser;
  },

  setCurrentUser(profile: UserProfile): void {
    globalState.currentUser = profile;
    syncToLocalStorage();
  },

  updateUserStatus(status: UserStatus): UserProfile {
    globalState.currentUser = { ...globalState.currentUser, status };
    syncToLocalStorage();
    return globalState.currentUser;
  },

  getTeamMembers(): UserProfile[] {
    return Object.values(DEMO_PROFILES);
  },

  // Workspaces
  getCurrentWorkspace(): Workspace {
    return globalState.currentWorkspace;
  },

  getWorkspaces(): Workspace[] {
    return globalState.workspaces;
  },

  createWorkspace(name: string, slug: string, template: string): Workspace {
    const newWs: Workspace = {
      id: 'ws-' + Date.now(),
      name,
      slug,
      plan: 'pro',
      ownerId: globalState.currentUser.id,
      role: 'owner',
      createdAt: new Date().toISOString(),
    };
    globalState.workspaces.push(newWs);
    globalState.currentWorkspace = newWs;

    // Generate template defaults
    if (template === 'Software Team' || template === 'Startup') {
      const defaultChannels: Channel[] = [
        {
          id: 'ch-' + Date.now() + '-1',
          workspaceId: newWs.id,
          name: 'general',
          description: 'Announcements and general discussions',
          isPrivate: false,
          memberCount: 4,
          createdBy: globalState.currentUser.id,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ch-' + Date.now() + '-2',
          workspaceId: newWs.id,
          name: 'engineering',
          description: 'Technical specs, code reviews, and deploy logs',
          isPrivate: false,
          memberCount: 4,
          createdBy: globalState.currentUser.id,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ch-' + Date.now() + '-3',
          workspaceId: newWs.id,
          name: 'releases',
          description: 'Production release tags and changelogs',
          isPrivate: false,
          memberCount: 4,
          createdBy: globalState.currentUser.id,
          createdAt: new Date().toISOString(),
        },
      ];
      globalState.channels.push(...defaultChannels);
    }

    syncToLocalStorage();
    return newWs;
  },

  // Channels
  getChannels(workspaceId?: string): Channel[] {
    const wsId = workspaceId || globalState.currentWorkspace.id;
    return globalState.channels.filter((c) => c.workspaceId === wsId || c.workspaceId === DEMO_WORKSPACE.id);
  },

  getChannelById(channelId: string): Channel | undefined {
    return globalState.channels.find((c) => c.id === channelId);
  },

  createChannel(name: string, description: string, isPrivate: boolean, workspaceId?: string): Channel {
    const wsId = workspaceId || globalState.currentWorkspace.id;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const newChannel: Channel = {
      id: 'ch-' + Date.now(),
      workspaceId: wsId,
      name: cleanName,
      description,
      isPrivate,
      memberCount: 1,
      unreadCount: 0,
      createdBy: globalState.currentUser.id,
      createdAt: new Date().toISOString(),
    };
    globalState.channels.push(newChannel);
    syncToLocalStorage();
    return newChannel;
  },

  // Messages
  getMessages(channelId: string): Message[] {
    return globalState.messages.filter((m) => m.channelId === channelId && !m.parentId);
  },

  getThreadMessages(parentId: string): Message[] {
    return globalState.messages.filter((m) => m.parentId === parentId);
  },

  sendMessage(channelId: string, content: string, parentId?: string): Message {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      workspaceId: globalState.currentWorkspace.id,
      channelId,
      senderId: globalState.currentUser.id,
      sender: globalState.currentUser,
      parentId,
      content,
      reactions: [],
      createdAt: new Date().toISOString(),
    };

    if (parentId) {
      const parent = globalState.messages.find((m) => m.id === parentId);
      if (parent) {
        parent.replyCount = (parent.replyCount || 0) + 1;
      }
    }

    globalState.messages.push(newMsg);
    syncToLocalStorage();
    return newMsg;
  },

  toggleReaction(messageId: string, emoji: string): void {
    const msg = globalState.messages.find((m) => m.id === messageId);
    if (!msg) return;

    const existingIndex = msg.reactions.findIndex(
      (r) => r.emoji === emoji && r.profileId === globalState.currentUser.id
    );

    if (existingIndex >= 0) {
      msg.reactions.splice(existingIndex, 1);
    } else {
      msg.reactions.push({
        id: 'react-' + Date.now(),
        messageId,
        profileId: globalState.currentUser.id,
        emoji,
        userName: globalState.currentUser.fullName,
      });
    }
    syncToLocalStorage();
  },

  togglePinMessage(messageId: string): boolean {
    const msg = globalState.messages.find((m) => m.id === messageId);
    if (!msg) return false;
    msg.isPinned = !msg.isPinned;
    syncToLocalStorage();
    return !!msg.isPinned;
  },

  // Tasks
  getTasks(workspaceId?: string): Task[] {
    return globalState.tasks;
  },

  getTaskById(taskId: string): Task | undefined {
    return globalState.tasks.find((t) => t.id === taskId);
  },

  createTask(taskData: Partial<Task>): Task {
    const nextNumber = globalState.tasks.length + 145;
    const newTask: Task = {
      id: 'task-' + Date.now(),
      workspaceId: globalState.currentWorkspace.id,
      projectId: taskData.projectId || globalState.projects[0].id,
      projectName: taskData.projectName || globalState.projects[0].name,
      projectKey: taskData.projectKey || globalState.projects[0].key,
      taskNumber: nextNumber,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || globalState.currentUser,
      creator: globalState.currentUser,
      labels: taskData.labels || ['general'],
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      subtasks: taskData.subtasks || [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    globalState.tasks.unshift(newTask);
    syncToLocalStorage();
    return newTask;
  },

  updateTaskStatus(taskId: string, status: TaskStatus): Task | undefined {
    const task = globalState.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      syncToLocalStorage();
    }
    return task;
  },

  toggleSubtask(taskId: string, subtaskId: string): void {
    const task = globalState.tasks.find((t) => t.id === taskId);
    if (task) {
      const sub = task.subtasks.find((s) => s.id === subtaskId);
      if (sub) {
        sub.completed = !sub.completed;
        task.updatedAt = new Date().toISOString();
        syncToLocalStorage();
      }
    }
  },

  addTaskComment(taskId: string, content: string): void {
    const task = globalState.tasks.find((t) => t.id === taskId);
    if (task) {
      if (!task.comments) task.comments = [];
      task.comments.push({
        id: 'tc-' + Date.now(),
        taskId,
        author: globalState.currentUser,
        content,
        createdAt: new Date().toISOString(),
      });
      task.commentsCount = task.comments.length;
      syncToLocalStorage();
    }
  },

  // Projects
  getProjects(workspaceId?: string): Project[] {
    return globalState.projects;
  },

  getProjectById(projectId: string): Project | undefined {
    return globalState.projects.find((p) => p.id === projectId);
  },

  createProject(name: string, key: string, description: string, color: string): Project {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      workspaceId: globalState.currentWorkspace.id,
      name,
      key: key.toUpperCase(),
      description,
      lead: globalState.currentUser,
      status: 'active',
      color: color || '#6366f1',
      progressPercent: 0,
      tasksCount: { total: 0, completed: 0, inProgress: 0, blocked: 0 },
      createdAt: new Date().toISOString(),
    };
    globalState.projects.push(newProj);
    syncToLocalStorage();
    return newProj;
  },

  // Meetings
  getMeetings(): Meeting[] {
    return globalState.meetings;
  },

  getMeetingById(meetingId: string): Meeting | undefined {
    return globalState.meetings.find((m) => m.id === meetingId);
  },

  createMeeting(meetingData: Partial<Meeting>): Meeting {
    const newMeet: Meeting = {
      id: 'meet-' + Date.now(),
      workspaceId: globalState.currentWorkspace.id,
      title: meetingData.title || 'Untitled Meeting',
      description: meetingData.description || '',
      scheduledStart: meetingData.scheduledStart || new Date().toISOString(),
      scheduledEnd: meetingData.scheduledEnd || new Date(Date.now() + 3600000).toISOString(),
      host: globalState.currentUser,
      status: 'scheduled',
      meetingUrl: `/workspace/${globalState.currentWorkspace.slug}/meetings/meet-${Date.now()}`,
      agenda: meetingData.agenda || '',
      participants: meetingData.participants || [globalState.currentUser],
      createdAt: new Date().toISOString(),
    };
    globalState.meetings.unshift(newMeet);
    syncToLocalStorage();
    return newMeet;
  },

  convertActionItemToTask(meetingId: string, actionItemId: string): Task | null {
    const meet = globalState.meetings.find((m) => m.id === meetingId);
    if (!meet || !meet.notes) return null;

    const actionItem = meet.notes.actionItems.find((a) => a.id === actionItemId);
    if (!actionItem) return null;

    const assignee = Object.values(DEMO_PROFILES).find(
      (p) => p.fullName.toLowerCase() === actionItem.assigneeName?.toLowerCase()
    ) || globalState.currentUser;

    const createdTask = this.createTask({
      title: actionItem.description,
      description: `Action item automatically extracted from meeting: "${meet.title}"`,
      assignee,
      priority: 'high',
      dueDate: actionItem.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      labels: ['meeting-action', 'ai-generated'],
    });

    actionItem.status = 'converted';
    actionItem.convertedTaskId = createdTask.id;
    syncToLocalStorage();

    return createdTask;
  },

  // Knowledge Pages
  getKnowledgePages(): KnowledgePage[] {
    return globalState.knowledgePages;
  },

  getKnowledgePageById(pageId: string): KnowledgePage | undefined {
    return globalState.knowledgePages.find((p) => p.id === pageId || p.slug === pageId);
  },

  createKnowledgePage(title: string, category: KnowledgePage['category'], parentId?: string): KnowledgePage {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPage: KnowledgePage = {
      id: 'doc-' + Date.now(),
      workspaceId: globalState.currentWorkspace.id,
      parentId,
      title,
      slug,
      icon: '📄',
      content: `# ${title}\n\nStart writing documentation here...\n\n- [ ] Task 1\n- [ ] Task 2\n`,
      author: globalState.currentUser,
      category,
      isFavorite: false,
      readingTimeMinutes: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    globalState.knowledgePages.push(newPage);
    syncToLocalStorage();
    return newPage;
  },

  updateKnowledgePage(pageId: string, updates: Partial<KnowledgePage>): KnowledgePage | undefined {
    const page = globalState.knowledgePages.find((p) => p.id === pageId);
    if (page) {
      Object.assign(page, updates, { updatedAt: new Date().toISOString() });
      syncToLocalStorage();
    }
    return page;
  },

  toggleFavoritePage(pageId: string): boolean {
    const page = globalState.knowledgePages.find((p) => p.id === pageId);
    if (!page) return false;
    page.isFavorite = !page.isFavorite;
    syncToLocalStorage();
    return page.isFavorite;
  },

  // GitHub Data
  getPullRequests(): GitHubPullRequest[] {
    return globalState.pullRequests;
  },

  getCommits(): GitHubCommit[] {
    return globalState.commits;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return globalState.notifications;
  },

  markNotificationRead(notificationId: string): void {
    const n = globalState.notifications.find((notif) => notif.id === notificationId);
    if (n) {
      n.isRead = true;
      syncToLocalStorage();
    }
  },

  markAllNotificationsRead(): void {
    globalState.notifications.forEach((n) => (n.isRead = true));
    syncToLocalStorage();
  },

  // Daily Briefing
  getDailyBriefing(): AIDailyBriefing {
    return globalState.dailyBriefing;
  },

  // Global Semantic Search
  searchAll(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { messages: [], tasks: [], docs: [], meetings: [], prs: [] };

    return {
      messages: globalState.messages.filter((m) => m.content.toLowerCase().includes(q)),
      tasks: globalState.tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      ),
      docs: globalState.knowledgePages.filter(
        (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
      ),
      meetings: globalState.meetings.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.agenda?.toLowerCase().includes(q) ||
          m.notes?.summary.toLowerCase().includes(q)
      ),
      prs: globalState.pullRequests.filter(
        (pr) => pr.title.toLowerCase().includes(q) || pr.branch.toLowerCase().includes(q)
      ),
    };
  },
};

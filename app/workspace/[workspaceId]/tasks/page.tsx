'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Kanban,
  List,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  GitPullRequest,
  CheckSquare,
  Calendar,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';
import { Task, TaskStatus, TaskPriority } from '@/types/workspace.types';

export default function TasksPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [tasks, setTasks] = React.useState<Task[]>(backletStore.getTasks());
  const [viewMode, setViewMode] = React.useState<'kanban' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  // New task form fields
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<TaskPriority>('medium');
  const [newStatus, setNewStatus] = React.useState<TaskStatus>('todo');

  // Comments & subtasks for selected task
  const [newComment, setNewComment] = React.useState('');

  const refreshTasks = () => {
    setTasks([...backletStore.getTasks()]);
  };

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'backlog', label: 'Backlog', color: 'bg-zinc-500' },
    { status: 'todo', label: 'Todo', color: 'bg-amber-500' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    { status: 'in_review', label: 'In Review', color: 'bg-purple-500' },
    { status: 'done', label: 'Done', color: 'bg-emerald-500' },
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPriority && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    backletStore.createTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: newStatus,
    });

    setIsNewTaskModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    refreshTasks();
  };

  const handleStatusChange = (taskId: string, newStat: TaskStatus) => {
    backletStore.updateTaskStatus(taskId, newStat);
    refreshTasks();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(backletStore.getTaskById(taskId) || null);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    backletStore.toggleSubtask(taskId, subtaskId);
    refreshTasks();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(backletStore.getTaskById(taskId) || null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;
    backletStore.addTaskComment(selectedTask.id, newComment);
    setNewComment('');
    setSelectedTask(backletStore.getTaskById(selectedTask.id) || null);
    refreshTasks();
  };

  const priorityBadges: Record<TaskPriority, { color: string; label: string }> = {
    urgent: { color: 'border-rose-500/30 text-rose-500 bg-rose-500/10', label: 'Urgent' },
    high: { color: 'border-amber-500/30 text-amber-500 bg-amber-500/10', label: 'High' },
    medium: { color: 'border-blue-500/30 text-blue-500 bg-blue-500/10', label: 'Medium' },
    low: { color: 'border-zinc-500/30 text-zinc-400 bg-zinc-500/10', label: 'Low' },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Task Board Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b px-6 py-3.5 bg-card/50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Sprint 14 Tasks</h1>
          <Badge variant="secondary" className="font-mono text-xs">
            {filteredTasks.length} Issues
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-44 text-xs"
            />
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-md border p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`rounded p-1 ${viewMode === 'kanban' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
              title="Kanban Board"
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded p-1 ${viewMode === 'list' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsNewTaskModalOpen(true)}
            className="h-8 gap-1.5 text-xs shadow-sm bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Main Kanban or List Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {viewMode === 'kanban' ? (
          <div className="flex h-full gap-4 items-start pb-4">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.status);
              return (
                <div
                  key={col.status}
                  className="flex flex-col h-full w-80 flex-shrink-0 rounded-xl border border-border/60 bg-muted/30 p-3"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                      <span className="font-semibold text-xs">{col.label}</span>
                      <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewStatus(col.status);
                        setIsNewTaskModalOpen(true);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Task Cards Column Stream */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {colTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        className="group rounded-lg border border-border/60 bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                            {t.projectKey}-{t.taskNumber}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold ${priorityBadges[t.priority].color}`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold leading-snug line-clamp-2">{t.title}</h4>

                        {/* Labels */}
                        {t.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {t.labels.map((lbl) => (
                              <span
                                key={lbl}
                                className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer info */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-muted-foreground text-[10px]">
                          <div className="flex items-center gap-2">
                            {t.subtasks.length > 0 && (
                              <span className="inline-flex items-center gap-1 font-mono">
                                <CheckSquare className="h-3 w-3" />
                                {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                              </span>
                            )}
                            {t.githubPrNumber && (
                              <span className="inline-flex items-center gap-0.5 text-purple-400 font-mono">
                                <GitPullRequest className="h-3 w-3" />#{t.githubPrNumber}
                              </span>
                            )}
                          </div>

                          {t.assignee && (
                            <Avatar
                              src={t.assignee.avatarUrl}
                              name={t.assignee.fullName}
                              size="sm"
                              title={t.assignee.fullName}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              <div className="col-span-2">Issue ID</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-1 text-right">Assignee</div>
            </div>
            <div className="divide-y divide-border/60">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="grid grid-cols-12 gap-2 items-center px-4 py-3 text-xs hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className="col-span-2 font-mono font-semibold text-muted-foreground">
                    {t.projectKey}-{t.taskNumber}
                  </div>
                  <div className="col-span-5 font-medium truncate">{t.title}</div>
                  <div className="col-span-2">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase font-mono">
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] uppercase font-mono font-semibold ${priorityBadges[t.priority].color}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {t.assignee && (
                      <Avatar src={t.assignee.avatarUrl} name={t.assignee.fullName} size="sm" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Create New Sprint Task"
        description="Add an issue or feature to the active sprint backlog."
      >
        <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Issue Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Implement webhook retry handler"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe acceptance criteria or technical context..."
              className="w-full rounded-md border border-input bg-transparent p-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none"
              >
                {columns.map((c) => (
                  <option key={c.status} value={c.status}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={`${selectedTask.projectKey}-${selectedTask.taskNumber}: ${selectedTask.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 pt-2">
            {/* Status & Priority Controls Bar */}
            <div className="flex flex-wrap items-center gap-3 border-b pb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Status:</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => handleStatusChange(selectedTask.id, e.target.value as TaskStatus)}
                  className="rounded-md border bg-background px-2 py-1 text-xs font-semibold focus:outline-none"
                >
                  {columns.map((c) => (
                    <option key={c.status} value={c.status}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Priority:</span>
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-mono uppercase font-semibold ${priorityBadges[selectedTask.priority].color}`}
                >
                  {selectedTask.priority}
                </span>
              </div>

              {selectedTask.githubPrNumber && (
                <a
                  href={selectedTask.githubPrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 text-xs font-mono hover:underline ml-auto"
                >
                  <GitPullRequest className="h-3 w-3" />
                  <span>PR #{selectedTask.githubPrNumber}</span>
                </a>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Description</h4>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedTask.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Subtasks Checklist */}
            {selectedTask.subtasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                    Subtasks ({selectedTask.subtasks.filter((s) => s.completed).length}/
                    {selectedTask.subtasks.length})
                  </h4>
                </div>
                <div className="space-y-1.5 rounded-lg border p-3 bg-muted/20">
                  {selectedTask.subtasks.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-2.5 text-xs cursor-pointer hover:text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(selectedTask.id, st.id)}
                        className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span className={st.completed ? 'line-through text-muted-foreground' : ''}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Feed */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                Comments ({selectedTask.comments?.length || 0})
              </h4>
              <div className="space-y-2.5 max-h-40 overflow-y-auto">
                {(selectedTask.comments || []).map((c) => (
                  <div key={c.id} className="rounded-lg border p-2.5 text-xs space-y-1 bg-background">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{c.author.fullName}</span>
                      <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-muted-foreground">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave a comment on this issue..."
                  className="text-xs"
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  Comment
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

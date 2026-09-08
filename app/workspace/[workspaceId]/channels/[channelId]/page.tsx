'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Hash,
  Lock,
  Users,
  Search,
  Pin,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  CheckSquare,
  FileText,
  MoreVertical,
  ArrowRight,
  X,
  File,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { backletStore } from '@/lib/db/store';
import { formatTime, formatRelativeTime } from '@/lib/utils';
import { Message, Channel } from '@/types/workspace.types';

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params?.channelId as string;
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const currentUser = backletStore.getCurrentUser();
  const channel = backletStore.getChannelById(channelId) || backletStore.getChannels()[0];

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [activeThread, setActiveThread] = React.useState<Message | null>(null);
  const [threadInputText, setThreadInputText] = React.useState('');
  const [showRightPanel, setShowRightPanel] = React.useState(false);
  const [rightPanelTab, setRightPanelTab] = React.useState<'about' | 'pinned' | 'files'>('about');

  // Quick Convert to Task Modal
  const [convertTaskMessage, setConvertTaskMessage] = React.useState<Message | null>(null);
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskPriority, setTaskPriority] = React.useState<'urgent' | 'high' | 'medium' | 'low'>('high');

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const loadMessages = React.useCallback(() => {
    if (channel) {
      setMessages(backletStore.getMessages(channel.id));
    }
  }, [channel]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !channel) return;

    backletStore.sendMessage(channel.id, inputText);
    setInputText('');
    loadMessages();
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadInputText.trim() || !activeThread || !channel) return;

    backletStore.sendMessage(channel.id, threadInputText, activeThread.id);
    setThreadInputText('');
    loadMessages();
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    backletStore.toggleReaction(messageId, emoji);
    loadMessages();
  };

  const handleTogglePin = (messageId: string) => {
    backletStore.togglePinMessage(messageId);
    loadMessages();
  };

  const handleOpenConvertTask = (msg: Message) => {
    setConvertTaskMessage(msg);
    // Suggest clean title from message
    const firstLine = msg.content.split('\n')[0].replace(/[`*#]/g, '').trim();
    setTaskTitle(firstLine.slice(0, 70));
  };

  const handleConfirmConvertTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !convertTaskMessage) return;

    backletStore.createTask({
      title: taskTitle,
      description: `Created from message by ${convertTaskMessage.sender.fullName} in #${channel?.name}:\n\n> ${convertTaskMessage.content}`,
      priority: taskPriority,
      labels: ['channel-created', channel?.name || 'general'],
    });

    setConvertTaskMessage(null);
    alert('Task successfully created in Sprint Board!');
  };

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const threadReplies = activeThread ? backletStore.getThreadMessages(activeThread.id) : [];

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Central Channel Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Channel Header */}
        <div className="flex h-14 items-center justify-between border-b px-4 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            {channel?.isPrivate ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Hash className="h-4 w-4 text-primary" />
            )}
            <div>
              <h2 className="font-semibold text-sm leading-none">{channel?.name}</h2>
              {channel?.description && (
                <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                  {channel.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
              <Users className="h-3.5 w-3.5" />
              <span>{channel?.memberCount || 4}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowRightPanel(!showRightPanel)}
              title="Channel Details"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Channel Welcome Banner */}
          <div className="border-b pb-4 pt-2 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-2">
              <Hash className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-base">Welcome to #{channel?.name}</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              This is the beginning of the #{channel?.name} channel. Discuss, share specs, and convert ideas directly to tasks.
            </p>
          </div>

          {messages.map((msg) => {
            return (
              <div
                key={msg.id}
                className="group relative flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/40 transition-colors"
              >
                <Avatar
                  src={msg.sender.avatarUrl}
                  name={msg.sender.fullName}
                  size="md"
                  status={msg.sender.status}
                />

                <div className="flex-1 overflow-hidden space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{msg.sender.fullName}</span>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(msg.createdAt)}</span>
                    {msg.isPinned && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] gap-0.5 text-primary">
                        <Pin className="h-2.5 w-2.5" /> Pinned
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Emoji Reactions Pill Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {msg.reactions.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleToggleReaction(msg.id, r.emoji)}
                        className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-2 py-0.5 text-[11px] hover:border-primary/50 transition-colors"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">1</span>
                      </button>
                    ))}

                    {/* Thread replies pill */}
                    {(msg.replyCount || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveThread(msg)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>{msg.replyCount} {msg.replyCount === 1 ? 'reply' : 'replies'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Floating Hover Action Toolbar */}
                <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-0.5 rounded-lg border bg-card p-1 shadow-md z-10 animate-in fade-in duration-100">
                  {['👍', '❤️', '🔥', '👀', '🚀'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleToggleReaction(msg.id, emoji)}
                      className="rounded p-1 hover:bg-muted text-xs"
                    >
                      {emoji}
                    </button>
                  ))}

                  <div className="h-3 w-px bg-border mx-1" />

                  <button
                    type="button"
                    onClick={() => setActiveThread(msg)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Reply in Thread"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenConvertTask(msg)}
                    className="rounded p-1 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                    title="Convert to Task"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePin(msg.id)}
                    className={`rounded p-1 ${
                      msg.isPinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={msg.isPinned ? 'Unpin' : 'Pin to Channel'}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="border-t p-3 bg-card/50">
          <form onSubmit={handleSendMessage} className="rounded-xl border border-border/80 bg-background p-2 focus-within:border-primary/50 transition-colors">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Message #${channel?.name || 'channel'} (Press Enter to send)...`}
              className="w-full resize-none bg-transparent p-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-border/40 pt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6">
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setInputText((prev) => prev + ' 🚀 ')}
                >
                  <Smile className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[10px] ml-2 hidden sm:inline">Markdown & code blocks supported</span>
              </div>
              <Button type="submit" size="sm" className="h-7 px-3 text-xs gap-1" disabled={!inputText.trim()}>
                <span>Send</span>
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Drawer: Thread Replies */}
      {activeThread && (
        <div className="w-80 md:w-96 border-l bg-card flex flex-col h-full animate-in slide-in-from-right duration-200">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Thread</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveThread(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Root Thread Message */}
            <div className="border-b pb-3 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar
                  src={activeThread.sender.avatarUrl}
                  name={activeThread.sender.fullName}
                  size="sm"
                />
                <span className="font-semibold text-xs">{activeThread.sender.fullName}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(activeThread.createdAt)}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{activeThread.content}</p>
            </div>

            {/* Replies List */}
            <div className="space-y-3">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {threadReplies.length} {threadReplies.length === 1 ? 'Reply' : 'Replies'}
              </div>
              {threadReplies.map((r) => (
                <div key={r.id} className="flex items-start gap-2.5 text-xs">
                  <Avatar src={r.sender.avatarUrl} name={r.sender.fullName} size="sm" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.sender.fullName}</span>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(r.createdAt)}</span>
                    </div>
                    <p className="leading-relaxed text-muted-foreground">{r.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thread Input */}
          <div className="border-t p-3">
            <form onSubmit={handleSendThreadReply} className="flex gap-2">
              <Input
                placeholder="Reply to thread..."
                value={threadInputText}
                onChange={(e) => setThreadInputText(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" disabled={!threadInputText.trim()}>
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Right Drawer: Channel Info Panel */}
      {showRightPanel && !activeThread && (
        <div className="w-80 border-l bg-card flex flex-col h-full animate-in slide-in-from-right duration-200">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h3 className="font-semibold text-sm">Channel Details</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRightPanel(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-xs">
            <button
              type="button"
              onClick={() => setRightPanelTab('about')}
              className={`flex-1 py-2.5 text-center font-medium border-b-2 ${
                rightPanelTab === 'about'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab('pinned')}
              className={`flex-1 py-2.5 text-center font-medium border-b-2 ${
                rightPanelTab === 'pinned'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              Pinned ({pinnedMessages.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {rightPanelTab === 'about' ? (
              <>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Topic</span>
                  <p className="text-xs text-foreground">{channel?.description || 'No topic set'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Created</span>
                  <p className="text-xs text-foreground">January 15, 2026 by Alex Rivera</p>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Members ({channel?.memberCount || 4})
                  </span>
                  {backletStore.getTeamMembers().map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar src={m.avatarUrl} name={m.fullName} size="sm" status={m.status} />
                      <div className="truncate">
                        <div className="text-xs font-medium truncate">{m.fullName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{m.roleTitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {pinnedMessages.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No pinned messages yet</p>
                ) : (
                  pinnedMessages.map((p) => (
                    <div key={p.id} className="rounded-lg border p-2.5 space-y-1 text-xs bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{p.sender.fullName}</span>
                        <Pin className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-muted-foreground line-clamp-3">{p.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convert Message to Task Modal */}
      <Modal
        isOpen={!!convertTaskMessage}
        onClose={() => setConvertTaskMessage(null)}
        title="Convert Message to Linear Task"
        description="Extract this discussion item directly into a tracked engineering task."
      >
        <form onSubmit={handleConfirmConvertTask} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Task Title</label>
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Verify OAuth token refresh"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={taskPriority === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTaskPriority(p)}
                  className="capitalize text-xs"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
            <span className="font-semibold text-muted-foreground">Source Message:</span>
            <p className="italic text-foreground line-clamp-2">
              &ldquo;{convertTaskMessage?.content}&rdquo;
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setConvertTaskMessage(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Video,
  FolderGit2,
  CheckSquare,
  FileText,
  Github,
  Search,
  Bell,
  Settings,
  Plus,
  Hash,
  Lock,
  ChevronDown,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { backletStore } from '@/lib/db/store';
import { useTheme } from '@/components/theme-provider';
import { UserStatus } from '@/types/workspace.types';

interface SidebarProps {
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
}

export function Sidebar({ onOpenCommandPalette, onOpenCopilot }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';
  const currentUser = backletStore.getCurrentUser();
  const channels = backletStore.getChannels();
  const projects = backletStore.getProjects();
  const workspaces = backletStore.getWorkspaces();
  const notifications = backletStore.getNotifications();
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const [isChannelModalOpen, setIsChannelModalOpen] = React.useState(false);
  const [newChannelName, setNewChannelName] = React.useState('');
  const [newChannelDesc, setNewChannelDesc] = React.useState('');
  const [newChannelPrivate, setNewChannelPrivate] = React.useState(false);

  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: `/workspace/${workspaceSlug}/dashboard` },
    { label: 'Inbox', icon: Inbox, href: `/workspace/${workspaceSlug}/inbox`, badge: unreadNotifs ? `${unreadNotifs}` : undefined },
    { label: 'Messages', icon: MessageSquare, href: `/workspace/${workspaceSlug}/messages` },
    { label: 'Meetings', icon: Video, href: `/workspace/${workspaceSlug}/meetings` },
    { label: 'Projects', icon: FolderGit2, href: `/workspace/${workspaceSlug}/projects` },
    { label: 'Tasks', icon: CheckSquare, href: `/workspace/${workspaceSlug}/tasks` },
    { label: 'Knowledge', icon: FileText, href: `/workspace/${workspaceSlug}/knowledge` },
    { label: 'GitHub', icon: Github, href: `/workspace/${workspaceSlug}/github` },
  ];

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName) return;
    const created = backletStore.createChannel(newChannelName, newChannelDesc, newChannelPrivate);
    setIsChannelModalOpen(false);
    setNewChannelName('');
    setNewChannelDesc('');
    router.push(`/workspace/${workspaceSlug}/channels/${created.id}`);
  };

  const handleStatusChange = (status: UserStatus) => {
    backletStore.updateUserStatus(status);
    setIsStatusMenuOpen(false);
  };

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r border-border/60 bg-card text-card-foreground select-none">
        {/* Workspace Switcher Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm flex-shrink-0">
              B
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 font-semibold text-sm truncate">
                <span>Backlet Labs</span>
                <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-bold text-primary">
                  PRO
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground truncate">backlet-labs.backlet.dev</div>
            </div>
          </div>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* Quick AI & Search buttons */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Quick search...</span>
              </div>
              <kbd className="rounded border bg-muted px-1 py-0.5 text-[9px] font-mono">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={onOpenCopilot}
              className="flex w-full items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Copilot</span>
              </div>
              <span className="rounded-full bg-primary text-[9px] text-primary-foreground px-1.5 font-mono">
                Ask
              </span>
            </button>
          </div>

          {/* Primary Nav */}
          <div className="space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="default" className="h-4 px-1.5 text-[10px] rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Channels Section */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Channels
              </span>
              <button
                type="button"
                onClick={() => setIsChannelModalOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                title="Create Channel"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {channels.map((ch) => {
              const isActive = pathname === `/workspace/${workspaceSlug}/channels/${ch.id}`;
              return (
                <Link
                  key={ch.id}
                  href={`/workspace/${workspaceSlug}/channels/${ch.id}`}
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {ch.isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unreadCount ? (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Active Projects */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Projects
              </span>
              <Link
                href={`/workspace/${workspaceSlug}/projects`}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/workspace/${workspaceSlug}/projects/${p.id}`}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{p.progressPercent}%</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Profile Footer */}
        <div className="border-t border-border/60 p-3 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between">
            <Link
              href={`/workspace/${workspaceSlug}/profile`}
              className="flex items-center gap-2.5 overflow-hidden hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={currentUser.avatarUrl}
                name={currentUser.fullName}
                size="sm"
                status={currentUser.status}
              />
              <div className="truncate">
                <div className="font-medium text-xs truncate">{currentUser.fullName}</div>
                <div className="text-[10px] text-muted-foreground truncate">{currentUser.roleTitle}</div>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>

              <Link href={`/workspace/${workspaceSlug}/settings`}>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Settings">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Create Channel Modal */}
      <Modal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        title="Create a Channel"
        description="Channels are where your team communicates on specific topics, projects, or teams."
      >
        <form onSubmit={handleCreateChannel} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Channel Name</label>
            <div className="flex items-center rounded-md border border-input px-3">
              <Hash className="h-4 w-4 text-muted-foreground mr-1" />
              <Input
                placeholder="e.g. backend-api, infra-alerts"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="border-0 p-0 shadow-none focus-visible:ring-0"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description (optional)</label>
            <Input
              placeholder="What is this channel about?"
              value={newChannelDesc}
              onChange={(e) => setNewChannelDesc(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrivate"
              checked={newChannelPrivate}
              onChange={(e) => setNewChannelPrivate(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="isPrivate" className="text-xs font-medium cursor-pointer">
              Make channel private (by invitation only)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsChannelModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Channel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

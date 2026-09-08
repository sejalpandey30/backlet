'use client';

import * as React from 'react';
import { usePathname, useParams } from 'next/navigation';
import {
  Menu,
  Sparkles,
  Plus,
  Video,
  CheckSquare,
  Search,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backletStore } from '@/lib/db/store';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
}

export function Topbar({
  onToggleMobileMenu,
  onOpenCommandPalette,
  onOpenCopilot,
}: TopbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  // Generate breadcrumb from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const section = pathParts[2] || 'dashboard';

  const sectionTitles: Record<string, string> = {
    dashboard: 'Personal Dashboard',
    inbox: 'Inbox & Mentions',
    messages: 'Direct Messages',
    channels: 'Channels',
    meetings: 'Meetings & Audio Rooms',
    projects: 'Projects',
    tasks: 'Sprint Tasks & Kanban',
    knowledge: 'Knowledge Hub',
    github: 'Developer Activity & PRs',
    notifications: 'Notifications',
    settings: 'Workspace Settings',
    profile: 'Developer Profile',
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onToggleMobileMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span className="text-foreground font-semibold capitalize">{workspaceSlug}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-foreground">{sectionTitles[section] || section}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 h-8 text-xs text-muted-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick search</span>
          <kbd className="rounded border bg-muted px-1 py-0.5 text-[9px] font-mono">⌘K</kbd>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onOpenCopilot}
          className="h-8 gap-1.5 text-xs shadow-sm bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Button>
      </div>
    </header>
  );
}

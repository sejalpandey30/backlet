'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Search,
  MessageSquare,
  CheckSquare,
  FileText,
  Video,
  Github,
  User,
  ArrowRight,
  Hash,
} from 'lucide-react';
import { backletStore } from '@/lib/db/store';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = backletStore.searchAll(query);
  const channels = backletStore.getChannels().filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  type Item = {
    id: string;
    type: 'channel' | 'task' | 'doc' | 'meeting' | 'pr' | 'message';
    title: string;
    subtitle?: string;
    url: string;
  };

  const allItems: Item[] = [
    ...channels.slice(0, 3).map((c) => ({
      id: c.id,
      type: 'channel' as const,
      title: `#${c.name}`,
      subtitle: c.description,
      url: `/workspace/${workspaceSlug}/channels/${c.id}`,
    })),
    ...searchResults.tasks.slice(0, 3).map((t) => ({
      id: t.id,
      type: 'task' as const,
      title: `${t.projectKey}-${t.taskNumber}: ${t.title}`,
      subtitle: `Status: ${t.status} | Priority: ${t.priority}`,
      url: `/workspace/${workspaceSlug}/tasks`,
    })),
    ...searchResults.docs.slice(0, 3).map((d) => ({
      id: d.id,
      type: 'doc' as const,
      title: d.title,
      subtitle: `${d.category} · ${d.readingTimeMinutes || 3} min read`,
      url: `/workspace/${workspaceSlug}/knowledge/${d.id}`,
    })),
    ...searchResults.meetings.slice(0, 2).map((m) => ({
      id: m.id,
      type: 'meeting' as const,
      title: m.title,
      subtitle: `Meeting · ${m.status}`,
      url: `/workspace/${workspaceSlug}/meetings/${m.id}`,
    })),
    ...searchResults.prs.slice(0, 2).map((pr) => ({
      id: pr.id,
      type: 'pr' as const,
      title: `PR #${pr.prNumber}: ${pr.title}`,
      subtitle: `Branch: ${pr.branch} | CI: ${pr.ciStatus}`,
      url: `/workspace/${workspaceSlug}/github`,
    })),
  ];

  const handleSelect = (item: Item) => {
    router.push(item.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border bg-card shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search channels, tasks, documents, meetings, PRs (e.g. 'OAuth', 'API')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {allItems.map((item, idx) => {
                const getIcon = () => {
                  switch (item.type) {
                    case 'channel':
                      return <Hash className="h-4 w-4 text-primary" />;
                    case 'task':
                      return <CheckSquare className="h-4 w-4 text-indigo-400" />;
                    case 'doc':
                      return <FileText className="h-4 w-4 text-emerald-400" />;
                    case 'meeting':
                      return <Video className="h-4 w-4 text-amber-400" />;
                    case 'pr':
                      return <Github className="h-4 w-4 text-purple-400" />;
                    default:
                      return <Search className="h-4 w-4 text-muted-foreground" />;
                  }
                };

                return (
                  <button
                    key={item.id + idx}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/60 flex-shrink-0">
                        {getIcon()}
                      </div>
                      <div className="truncate">
                        <div className="font-medium truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <span>Search Backlet Omnisearch</span>
          <div className="flex items-center gap-2">
            <span>Navigate with click</span>
            <span>·</span>
            <span>Press ESC to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

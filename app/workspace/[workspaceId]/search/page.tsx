'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Search,
  MessageSquare,
  CheckSquare,
  FileText,
  Video,
  Github,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { backletStore } from '@/lib/db/store';

export default function SearchPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [query, setQuery] = React.useState('OAuth');
  const [filterType, setFilterType] = React.useState<'all' | 'tasks' | 'docs' | 'messages' | 'meetings'>('all');

  const results = backletStore.searchAll(query);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Workspace Semantic Search</h1>
          <Badge variant="outline" className="text-xs text-primary border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" /> pgvector Ready
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Unified search across channels, meeting transcripts, knowledge pages, and GitHub PRs
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, decisions, or specs (e.g. OAuth, WebSocket, Kubernetes)..."
            className="pl-9 h-10 text-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs border-b pb-3">
        {(['all', 'tasks', 'docs', 'messages', 'meetings'] as const).map((t) => (
          <Button
            key={t}
            variant={filterType === t ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(t)}
            className="h-7 capitalize text-xs"
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {/* Tasks Section */}
        {(filterType === 'all' || filterType === 'tasks') && results.tasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>Sprint Tasks ({results.tasks.length})</span>
            </h3>
            <div className="space-y-2">
              {results.tasks.map((t) => (
                <Link key={t.id} href={`/workspace/${workspaceSlug}/tasks`}>
                  <div className="rounded-lg border p-3 hover:border-primary/50 transition-colors bg-card flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-muted-foreground mr-2">
                        {t.projectKey}-{t.taskNumber}
                      </span>
                      <span className="font-medium text-foreground">{t.title}</span>
                    </div>
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {t.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Docs Section */}
        {(filterType === 'all' || filterType === 'docs') && results.docs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Knowledge Pages ({results.docs.length})</span>
            </h3>
            <div className="space-y-2">
              {results.docs.map((d) => (
                <Link key={d.id} href={`/workspace/${workspaceSlug}/knowledge/${d.id}`}>
                  <div className="rounded-lg border p-3 hover:border-primary/50 transition-colors bg-card text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span>{d.icon}</span>
                      <span className="font-medium text-foreground">{d.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {d.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-1">
                      {d.content.slice(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Meetings Section */}
        {(filterType === 'all' || filterType === 'meetings') && results.meetings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-amber-400" />
              <span>Meeting Intelligence ({results.meetings.length})</span>
            </h3>
            <div className="space-y-2">
              {results.meetings.map((m) => (
                <Link key={m.id} href={`/workspace/${workspaceSlug}/meetings/${m.id}`}>
                  <div className="rounded-lg border p-3 hover:border-primary/50 transition-colors bg-card text-xs space-y-1">
                    <div className="font-medium text-foreground">{m.title}</div>
                    <p className="text-muted-foreground line-clamp-2">
                      {m.notes?.summary || m.agenda || 'Meeting details'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Messages Section */}
        {(filterType === 'all' || filterType === 'messages') && results.messages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>Channel Conversations ({results.messages.length})</span>
            </h3>
            <div className="space-y-2">
              {results.messages.map((msg) => (
                <div key={msg.id} className="rounded-lg border p-3 bg-card text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{msg.sender.fullName}</span>
                    <span className="text-muted-foreground">in #engineering</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

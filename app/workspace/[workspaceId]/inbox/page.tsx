'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  GitPullRequest,
  Calendar,
  AtSign,
  MessageSquare,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { backletStore } from '@/lib/db/store';
import { formatRelativeTime } from '@/lib/utils';

export default function InboxPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [notifications, setNotifications] = React.useState(backletStore.getNotifications());
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  const handleMarkRead = (id: string) => {
    backletStore.markNotificationRead(id);
    setNotifications([...backletStore.getNotifications()]);
  };

  const handleMarkAllRead = () => {
    backletStore.markAllNotificationsRead();
    setNotifications([...backletStore.getNotifications()]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pr_review':
        return <GitPullRequest className="h-4 w-4 text-purple-400" />;
      case 'meeting_reminder':
        return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-primary" />;
      default:
        return <MessageSquare className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mentions, task assignments, and review requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-0.5 text-xs bg-muted/40">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Unread
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs gap-1.5">
            <Check className="h-3.5 w-3.5" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="font-semibold text-sm">You&apos;re all caught up!</h3>
            <p className="text-xs text-muted-foreground">No new notifications in your inbox.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                !n.isRead ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(n.id)}
                    className="h-7 text-[11px]"
                  >
                    Mark read
                  </Button>
                )}
                {n.linkUrl && (
                  <Link href={n.linkUrl}>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backletStore } from '@/lib/db/store';
import { formatRelativeTime } from '@/lib/utils';

export default function NotificationsPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [notifications, setNotifications] = React.useState(backletStore.getNotifications());

  const handleMarkAllRead = () => {
    backletStore.markAllNotificationsRead();
    setNotifications([...backletStore.getNotifications()]);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Realtime activity feed, mentions, and system alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs gap-1.5">
            <Check className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </Button>
          <Link href={`/workspace/${workspaceSlug}/settings`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
              !n.isRead ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0 mt-0.5">
                <Bell className="h-4 w-4 text-primary" />
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

            {n.linkUrl && (
              <Link href={n.linkUrl}>
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1">
                  <span>View</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

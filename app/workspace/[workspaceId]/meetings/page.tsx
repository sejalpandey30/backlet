'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Video,
  Calendar,
  Clock,
  Users,
  Plus,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { backletStore } from '@/lib/db/store';
import { formatDate, formatTime } from '@/lib/utils';
import { Meeting } from '@/types/workspace.types';

export default function MeetingsPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [meetings, setMeetings] = React.useState<Meeting[]>(backletStore.getMeetings());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [agenda, setAgenda] = React.useState('');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    backletStore.createMeeting({
      title,
      description,
      agenda,
    });

    setMeetings([...backletStore.getMeetings()]);
    setIsScheduleModalOpen(false);
    setTitle('');
    setDescription('');
    setAgenda('');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings & Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Video rooms with automated transcription, key decision extraction, and 1-click task conversion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Meeting</span>
          </Button>
        </div>
      </div>

      {/* Active & Scheduled Meetings */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Today&apos;s Syncs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((m, idx) => (
            <Card
              key={m.id}
              className={`border transition-all hover:shadow-md flex flex-col justify-between ${
                idx === 0
                  ? 'border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card ring-1 ring-primary/30'
                  : 'border-border/60 bg-card'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTime(m.scheduledStart)} - {formatTime(m.scheduledEnd)}</span>
                  </div>
                  <Badge variant={idx === 0 ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono">
                    {idx === 0 ? 'Ready to Join' : m.status}
                  </Badge>
                </div>

                <CardTitle className="text-base mt-2">{m.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {m.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* AI Intelligence badge */}
                {m.notes && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs flex items-center gap-2 text-emerald-500">
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-[11px] truncate">
                      AI Extracted {m.notes.keyDecisions.length} decisions & {m.notes.actionItems.length} action items
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="flex -space-x-1.5">
                    {m.participants.map((p) => (
                      <Avatar key={p.id} src={p.avatarUrl} name={p.fullName} size="sm" />
                    ))}
                  </div>

                  <Link href={`/workspace/${workspaceSlug}/meetings/${m.id}`}>
                    <Button size="sm" className="h-8 gap-1.5 text-xs">
                      <Play className="h-3 w-3" />
                      <span>Enter Room</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Team Meeting"
        description="Invite participants and set an agenda for automated transcription & decision extraction."
      >
        <form onSubmit={handleSchedule} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Meeting Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architecture RFC Review"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context for the attendees..."
              className="w-full rounded-md border border-input bg-transparent p-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Agenda Items</label>
            <textarea
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="1. Review OAuth PKCE PR&#10;2. Performance benchmark&#10;3. Next steps"
              className="w-full rounded-md border border-input bg-transparent p-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Schedule Sync
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

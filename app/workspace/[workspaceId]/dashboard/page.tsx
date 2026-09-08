'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  CheckSquare,
  Github,
  MessageSquare,
  ArrowRight,
  Clock,
  Video,
  AlertCircle,
  Plus,
  Play,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { formatDate, formatTime } from '@/lib/utils';

export default function DashboardPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const currentUser = backletStore.getCurrentUser();
  const briefing = backletStore.getDailyBriefing();
  const tasks = backletStore.getTasks();
  const meetings = backletStore.getMeetings();
  const projects = backletStore.getProjects();
  const pullRequests = backletStore.getPullRequests();

  const myTasks = tasks.filter((t) => t.assignee?.id === currentUser.id && t.status !== 'done');
  const todayMeetings = meetings.slice(0, 3);
  const openPrs = pullRequests.filter((pr) => pr.status === 'open');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Welcome & AI Daily Briefing Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Good morning, {currentUser.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{briefing.dateStr} · Backlet Labs Workspace</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/workspace/${workspaceSlug}/tasks`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <CheckSquare className="h-3.5 w-3.5" /> New Task
            </Button>
          </Link>
          <Link href={`/workspace/${workspaceSlug}/meetings/meet-1`}>
            <Button size="sm" className="gap-1.5 text-xs bg-primary hover:bg-primary/90">
              <Video className="h-3.5 w-3.5" /> Join 10:30 Sync
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Daily Briefing Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  AI Morning Briefing
                </span>
                <span className="text-[10px] text-muted-foreground">Generated 10m ago</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                &ldquo;{briefing.aiSummary}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-semibold text-rose-500">
                  <AlertCircle className="h-3 w-3" /> 2 Blockers:
                </span>
                {briefing.blockers.map((b, idx) => (
                  <span key={idx} className="rounded bg-background/80 px-2 py-0.5 border text-[11px]">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Overview Metric Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Tasks Due</span>
            <CheckSquare className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold mt-2">{briefing.tasksDueCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">1 urgent priority</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">PRs Pending</span>
            <Github className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold mt-2">{openPrs.length}</div>
          <div className="text-[11px] text-emerald-500 mt-0.5 font-medium">CI checks passing</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Today&apos;s Meetings</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold mt-2">{todayMeetings.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Next in 15 mins</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Unread Pings</span>
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-2">{briefing.unreadMessagesCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across 2 channels</div>
        </div>
      </div>

      {/* Focus & Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Focus & Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Focus Widget */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Today&apos;s Deep Focus
                </span>
                <Badge variant="default" className="text-[10px]">
                  Sprint 14 Goal
                </Badge>
              </div>
              <CardTitle className="text-lg mt-1">{briefing.focusGoal.title}</CardTitle>
              <CardDescription>
                PR #142 awaiting review before merging session cookies to main.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Progress</span>
                <span className="font-mono text-primary font-bold">{briefing.focusGoal.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${briefing.focusGoal.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks List */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Assigned to You ({myTasks.length})</CardTitle>
                <CardDescription>High-priority execution items</CardDescription>
              </div>
              <Link href={`/workspace/${workspaceSlug}/tasks`}>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  View Board <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground">
                      {t.projectKey}-{t.taskNumber}
                    </span>
                    <span className="text-xs font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={t.priority === 'urgent' ? 'destructive' : 'secondary'}
                      className="text-[10px] uppercase font-mono"
                    >
                      {t.priority}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">Due {formatDate(t.dueDate || '')}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Projects Status */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Velocity</CardTitle>
              <CardDescription>Tracking active sprint milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{p.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.progressPercent}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Today's Meetings & GitHub PRs */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
                <Link href={`/workspace/${workspaceSlug}/meetings`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                    Calendar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayMeetings.map((m, idx) => (
                <div
                  key={m.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    idx === 0
                      ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border/50 bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-semibold text-primary">
                      {formatTime(m.scheduledStart)}
                    </span>
                    {idx === 0 && (
                      <Badge variant="default" className="text-[9px] bg-emerald-600">
                        In 15m
                      </Badge>
                    )}
                  </div>
                  <div className="font-semibold text-xs leading-snug">{m.title}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {m.participants.slice(0, 3).map((p) => (
                        <Avatar key={p.id} src={p.avatarUrl} name={p.fullName} size="sm" />
                      ))}
                    </div>
                    <Link href={`/workspace/${workspaceSlug}/meetings/${m.id}`}>
                      <Button size="sm" variant={idx === 0 ? 'default' : 'outline'} className="h-7 text-[11px] gap-1">
                        <Play className="h-3 w-3" /> Join
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* GitHub PRs Needing Review */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">GitHub Activity</CardTitle>
                <Link href={`/workspace/${workspaceSlug}/github`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                    All PRs
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {openPrs.map((pr) => (
                <div
                  key={pr.id}
                  className="rounded-lg border border-border/50 bg-background/50 p-2.5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs truncate">
                      #{pr.prNumber} {pr.title}
                    </span>
                    <Badge
                      variant={pr.ciStatus === 'success' ? 'success' : 'warning'}
                      className="text-[9px] uppercase font-mono"
                    >
                      CI: {pr.ciStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono text-[10px]">{pr.branch}</span>
                    <span>Reviewer: {pr.reviewerName?.split('-')[0]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Github,
  GitPullRequest,
  GitCommit,
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';
import { GitHubPullRequest, GitHubCommit } from '@/types/workspace.types';

export default function GitHubHubPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const pullRequests = backletStore.getPullRequests();
  const commits = backletStore.getCommits();
  const tasks = backletStore.getTasks();

  const [activeTab, setActiveTab] = React.useState<'prs' | 'commits' | 'velocity'>('prs');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Developer Activity & GitHub</h1>
            <Badge variant="outline" className="text-xs gap-1 border-emerald-500/30 text-emerald-500">
              <CheckCircle2 className="h-3 w-3" /> Connected: backlet/backlet-web
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Engineering collaboration, pull request review queue, and CI/CD deployment tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/backlet/backlet-web"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Github className="h-3.5 w-3.5" />
              <span>View on GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Open PRs</span>
            <GitPullRequest className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {pullRequests.filter((pr) => pr.status === 'open').length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">2 awaiting review</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">CI Build Health</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold mt-2 text-emerald-500">100%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Staging tests passing</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Commits This Week</span>
            <GitCommit className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold mt-2">28</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across 3 branches</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Average Review Time</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold mt-2">2.4h</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">-35% from last sprint</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('prs')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'prs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pull Requests ({pullRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('commits')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'commits'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Recent Commits ({commits.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('velocity')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'velocity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Engineering Velocity & Collaboration
        </button>
      </div>

      {/* PRs View */}
      {activeTab === 'prs' && (
        <div className="space-y-3">
          {pullRequests.map((pr) => {
            const linkedTask = tasks.find((t) => t.githubPrNumber === pr.prNumber);
            return (
              <div
                key={pr.id}
                className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <GitPullRequest
                      className={`h-4 w-4 flex-shrink-0 ${
                        pr.status === 'merged' ? 'text-purple-400' : 'text-emerald-400'
                      }`}
                    />
                    <span className="font-semibold text-sm">
                      #{pr.prNumber} {pr.title}
                    </span>
                    <Badge variant={pr.status === 'merged' ? 'secondary' : 'default'} className="text-[10px] capitalize">
                      {pr.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={pr.ciStatus === 'success' ? 'success' : 'warning'}
                      className="text-[10px] font-mono uppercase"
                    >
                      CI: {pr.ciStatus}
                    </Badge>
                    <a href={pr.url} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <GitBranch className="h-3.5 w-3.5" />
                    {pr.branch}
                  </span>
                  <span>Author: {pr.author}</span>
                  {pr.reviewerName && <span>Reviewer: {pr.reviewerName}</span>}
                  <span className="font-mono text-[11px]">
                    <span className="text-emerald-500 font-semibold">+{pr.additions}</span>{' '}
                    <span className="text-rose-500 font-semibold">-{pr.deletions}</span>
                  </span>
                  <span>{formatDate(pr.createdAt)}</span>
                </div>

                {/* Direct Task Link */}
                {linkedTask && (
                  <div className="rounded-lg bg-muted/40 p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Linked Backlet Task:</span>
                      <span className="font-semibold text-foreground">
                        {linkedTask.projectKey}-{linkedTask.taskNumber}: {linkedTask.title}
                      </span>
                    </div>
                    <Link href={`/workspace/${workspaceSlug}/tasks`}>
                      <span className="text-[11px] text-primary font-medium hover:underline">
                        Open in Kanban →
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Commits View */}
      {activeTab === 'commits' && (
        <div className="rounded-xl border bg-card divide-y">
          {commits.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3.5 text-xs">
              <div className="flex items-center gap-3">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold text-foreground">{c.message}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {c.authorName} committed to <span className="font-mono">{c.branch}</span>
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] rounded bg-muted px-2 py-0.5">{c.sha}</span>
            </div>
          ))}
        </div>
      )}

      {/* Velocity View */}
      {activeTab === 'velocity' && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Engineering Velocity & Health</CardTitle>
            <CardDescription>
              Visibility into deployment frequency and pull request turnaround without invasive surveillance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-3 space-y-1">
                <div className="text-xs text-muted-foreground">Deployment Frequency</div>
                <div className="text-xl font-bold">4.2 / day</div>
                <div className="text-[10px] text-emerald-500">Continuous delivery to staging</div>
              </div>
              <div className="rounded-lg border p-3 space-y-1">
                <div className="text-xs text-muted-foreground">Mean Time to Merge</div>
                <div className="text-xl font-bold">4.8 hours</div>
                <div className="text-[10px] text-emerald-500">Healthy asynchronous review rate</div>
              </div>
              <div className="rounded-lg border p-3 space-y-1">
                <div className="text-xs text-muted-foreground">Staging Rollback Rate</div>
                <div className="text-xl font-bold">0%</div>
                <div className="text-[10px] text-muted-foreground">Zero incidents in Sprint 14</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FolderGit2,
  CheckSquare,
  FileText,
  Video,
  Github,
  Calendar,
  ArrowLeft,
  Plus,
  GitPullRequest,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const project = backletStore.getProjectById(projectId) || backletStore.getProjects()[0];
  const allTasks = backletStore.getTasks();
  const projectTasks = allTasks.filter((t) => t.projectId === project?.id);
  const docs = backletStore.getKnowledgePages().filter((d) => d.projectId === project?.id);

  if (!project) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-xl font-bold">Project Not Found</h2>
        <Link href={`/workspace/${workspaceSlug}/projects`}>
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3 border-b pb-4">
        <Link
          href={`/workspace/${workspaceSlug}/projects`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                <span className="font-mono text-xs rounded bg-muted px-2 py-0.5">{project.key}</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {project.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/workspace/${workspaceSlug}/tasks`}>
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> New Task
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{project.progressPercent}%</div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${project.progressPercent}%`, backgroundColor: project.color }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sprint Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {projectTasks.filter((t) => t.status === 'done').length} completed ·{' '}
              {projectTasks.filter((t) => t.status === 'in_progress').length} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Target Launch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {project.targetDate ? formatDate(project.targetDate) : 'TBD'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lead: {project.lead?.fullName || 'Alex Rivera'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Linked Tasks and Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Project Tasks ({projectTasks.length})</CardTitle>
            <Link href={`/workspace/${workspaceSlug}/tasks`}>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View Kanban Board
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {projectTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No tasks assigned to this project yet.</p>
            ) : (
              projectTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border p-2.5 text-xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-muted-foreground">{t.projectKey}-{t.taskNumber}</span>
                    <span className="font-medium truncate">{t.title}</span>
                  </div>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {t.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Linked Documents */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Linked Specifications</CardTitle>
            <Link href={`/workspace/${workspaceSlug}/knowledge`}>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                All Docs
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {docs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No documentation linked to this project yet.</p>
            ) : (
              docs.map((d) => (
                <Link
                  key={d.id}
                  href={`/workspace/${workspaceSlug}/knowledge/${d.id}`}
                  className="flex items-center justify-between rounded-lg border p-2.5 text-xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{d.icon}</span>
                    <span className="font-medium truncate">{d.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.readingTimeMinutes || 3}m read</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

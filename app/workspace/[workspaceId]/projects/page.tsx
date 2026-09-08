'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FolderGit2,
  Plus,
  ArrowRight,
  Github,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';
import { Project } from '@/types/workspace.types';

export default function ProjectsPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [projects, setProjects] = React.useState<Project[]>(backletStore.getProjects());
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [key, setKey] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [color, setColor] = React.useState('#6366f1');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    backletStore.createProject(name, key, desc, color);
    setProjects([...backletStore.getProjects()]);
    setIsNewProjectModalOpen(false);
    setName('');
    setKey('');
    setDesc('');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Projects</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Engineering roadmaps, milestones, and cross-functional deliverables
          </p>
        </div>

        <Button onClick={() => setIsNewProjectModalOpen(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/workspace/${workspaceSlug}/projects/${p.id}`}>
            <Card className="h-full border-border/60 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="font-mono text-xs font-semibold text-muted-foreground">{p.key}</span>
                  </div>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {p.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{p.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs mt-1">
                  {p.description || 'No project description provided.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono font-semibold">{p.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.progressPercent}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    {p.lead && <Avatar src={p.lead.avatarUrl} name={p.lead.fullName} size="sm" />}
                    <span className="truncate">{p.lead?.fullName.split(' ')[0]}</span>
                  </div>
                  {p.targetDate && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(p.targetDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Create New Project"
        description="Organize sprint issues, linked docs, and code repositories under a project."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Project Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key) {
                  setKey(
                    e.target.value
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 4)
                  );
                }
              }}
              placeholder="e.g. Realtime Sync Engine"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Project Key (Prefix)</label>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="e.g. RTE"
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 rounded border border-input cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What does this project accomplish?"
              className="w-full rounded-md border border-input bg-transparent p-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

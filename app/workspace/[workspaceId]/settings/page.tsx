'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Settings,
  Users,
  ShieldCheck,
  Github,
  Database,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { backletStore } from '@/lib/db/store';
import { UserRole } from '@/types/workspace.types';

export default function SettingsPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [activeTab, setActiveTab] = React.useState<'general' | 'members' | 'integrations' | 'security' | 'billing'>('members');
  const [workspaceName, setWorkspaceName] = React.useState('Backlet Labs');
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<UserRole>('member');

  const members = backletStore.getTeamMembers();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}!`);
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage team members, roles, permissions, database integrations, and billing
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b text-xs overflow-x-auto pb-1 gap-2">
        {[
          { id: 'members', label: 'Members & Roles', icon: Users },
          { id: 'general', label: 'General', icon: Settings },
          { id: 'integrations', label: 'Integrations', icon: Github },
          { id: 'security', label: 'Security & RLS', icon: ShieldCheck },
          { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3.5 font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MEMBERS & ROLES */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Team Members ({members.length})</h3>
              <p className="text-xs text-muted-foreground">
                Users with access to Backlet Labs workspace resources
              </p>
            </div>
            <Button size="sm" onClick={() => setIsInviteModalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Invite Teammate</span>
            </Button>
          </div>

          <div className="rounded-xl border bg-card divide-y">
            {members.map((m, idx) => {
              const role = idx === 0 ? 'owner' : idx === 2 ? 'admin' : 'member';
              return (
                <div key={m.id} className="flex items-center justify-between p-4 text-xs">
                  <div className="flex items-center gap-3">
                    <Avatar src={m.avatarUrl} name={m.fullName} size="md" status={m.status} />
                    <div>
                      <div className="font-semibold text-foreground">{m.fullName}</div>
                      <div className="text-muted-foreground">{m.email} · {m.roleTitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={role === 'owner' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                      {role}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GENERAL */}
      {activeTab === 'general' && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Workspace Identity</CardTitle>
            <CardDescription className="text-xs">Update your team name and workspace domain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Workspace Name</label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Workspace Slug</label>
              <Input value={workspaceSlug} disabled className="max-w-md bg-muted/40 font-mono text-xs" />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  <CardTitle className="text-sm">GitHub</CardTitle>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Connected
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Linked to repository <code className="text-foreground">backlet/backlet-web</code>. Synchronizes PRs, commits, and CI status with tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="text-xs">
                Configure Webhooks
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-sm">Supabase</CardTitle>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Active
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                PostgreSQL schema, Row Level Security, Realtime channels, and Storage bucket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="text-xs">
                View Connection Health
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECURITY & RLS */}
      {activeTab === 'security' && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Row Level Security (RLS) & Access Control</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Every table in Backlet is protected by PostgreSQL tenant isolation policies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Workspaces & Multi-tenancy</span>
                <span className="text-emerald-500 font-medium">ENFORCED</span>
              </div>
              <p className="text-muted-foreground">
                Queries are scoped by <code className="bg-muted px-1 py-0.5 rounded">is_workspace_member()</code> function ensuring cross-tenant data leaks are physically blocked at the database engine level.
              </p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Private Channels & DMs</span>
                <span className="text-emerald-500 font-medium">ENFORCED</span>
              </div>
              <p className="text-muted-foreground">
                Channel messages require explicit membership in <code className="bg-muted px-1 py-0.5 rounded">channel_members</code>.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BILLING */}
      {activeTab === 'billing' && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Workspace Subscription</CardTitle>
            <CardDescription className="text-xs">
              Backlet Labs is currently active on the Pro Plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="font-semibold text-sm">Backlet Pro</div>
                <div className="text-muted-foreground">Unlimited team members, AI Copilot, meeting intelligence, GitHub sync.</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-base">$12 / user / month</div>
                <Badge variant="default" className="text-[10px]">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Teammate to Workspace"
        description="Invited members will receive an email with instructions to join Backlet Labs."
      >
        <form onSubmit={handleInvite} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Teammate Email</label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none"
            >
              <option value="admin">Admin (Can manage settings and invite members)</option>
              <option value="manager">Manager (Can manage projects and sprints)</option>
              <option value="member">Member (Full collaboration, tasks, channels)</option>
              <option value="guest">Guest (Restricted to specific projects/channels)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

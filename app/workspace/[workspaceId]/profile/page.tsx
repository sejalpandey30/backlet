'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Briefcase,
  Github,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Edit,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { DEMO_PROFILES } from '@/lib/seed/demo-data';
import { UserStatus } from '@/types/workspace.types';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [currentUser, setCurrentUser] = React.useState(backletStore.getCurrentUser());
  const [status, setStatus] = React.useState<UserStatus>(currentUser.status);
  const [bio, setBio] = React.useState(currentUser.bio || '');

  const handleStatusChange = (newStatus: UserStatus) => {
    setStatus(newStatus);
    const updated = backletStore.updateUserStatus(newStatus);
    setCurrentUser({ ...updated });
  };

  const handleSwitchPersona = (key: keyof typeof DEMO_PROFILES) => {
    const p = DEMO_PROFILES[key];
    backletStore.setCurrentUser(p);
    setCurrentUser(p);
    setStatus(p.status);
    setBio(p.bio || '');
  };

  const statusOptions: { status: UserStatus; label: string; color: string }[] = [
    { status: 'online', label: 'Online', color: 'bg-emerald-500' },
    { status: 'busy', label: 'In deep focus / Busy', color: 'bg-rose-500' },
    { status: 'away', label: 'Away / In a meeting', color: 'bg-amber-500' },
    { status: 'dnd', label: 'Do not disturb', color: 'bg-rose-600' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Developer Profile</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your availability status, role details, and test team persona views
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={currentUser.avatarUrl}
                name={currentUser.fullName}
                size="lg"
                status={status}
                className="h-16 w-16 text-lg"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{currentUser.fullName}</h2>
                  <Badge variant="outline" className="text-xs font-mono">
                    Owner
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{currentUser.roleTitle}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{currentUser.email}</span>
                  {currentUser.githubUsername && (
                    <span className="font-mono text-primary">@{currentUser.githubUsername}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Selector */}
          <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Availability Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => handleStatusChange(opt.status)}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs transition-colors ${
                    status === opt.status
                      ? 'border-primary bg-primary/10 font-semibold text-foreground'
                      : 'border-border/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className={`h-2.5 w-2.5 rounded-full ${opt.color}`} />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Persona Switcher For Testing & Demos */}
      <Card className="border-border/60 bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Switch Demo Persona</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Test Backlet through the eyes of different team roles (Architect, Full-stack, Product, DevOps)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(DEMO_PROFILES) as (keyof typeof DEMO_PROFILES)[]).map((k) => {
            const p = DEMO_PROFILES[k];
            const isCurrent = currentUser.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSwitchPersona(k)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border/60 bg-card hover:border-primary/40'
                }`}
              >
                <Avatar src={p.avatarUrl} name={p.fullName} size="md" status={p.status} />
                <div className="font-semibold text-xs mt-2 truncate w-full">{p.fullName}</div>
                <div className="text-[10px] text-muted-foreground truncate w-full">{p.roleTitle}</div>
                {isCurrent && (
                  <Badge variant="default" className="mt-2 text-[9px] py-0 px-1.5">
                    Active
                  </Badge>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

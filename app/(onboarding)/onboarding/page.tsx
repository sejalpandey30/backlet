'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Code,
  Sparkles,
  Palette,
  Megaphone,
  Briefcase,
  Globe,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Building,
  Rocket,
  Layout,
  FolderGit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { backletStore } from '@/lib/db/store';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);

  // Step 1: Use case
  const [useCase, setUseCase] = React.useState('Software development');

  // Step 2: Workspace details
  const [wsName, setWsName] = React.useState('Acme Engineering');
  const [wsSlug, setWsSlug] = React.useState('acme-eng');
  const [teamSize, setTeamSize] = React.useState('11-50 members');

  // Step 3: Invites
  const [inviteEmails, setInviteEmails] = React.useState(['maya@acme.dev', 'jordan@acme.dev']);
  const [newEmail, setNewEmail] = React.useState('');

  // Step 4: Template
  const [template, setTemplate] = React.useState('Software Team');
  const [creating, setCreating] = React.useState(false);

  const useCases = [
    { id: 'Software development', icon: Code, label: 'Software development', desc: 'Code, PRs, sprints, and CI/CD' },
    { id: 'Product', icon: Sparkles, label: 'Product management', desc: 'Roadmaps, specs, and feature velocity' },
    { id: 'Design', icon: Palette, label: 'Design & UX', desc: 'Design systems, tokens, and prototypes' },
    { id: 'Marketing', icon: Megaphone, label: 'Growth & Marketing', desc: 'Campaigns, assets, and messaging' },
    { id: 'Operations', icon: Briefcase, label: 'Business Operations', desc: 'Processes, workflows, and handbooks' },
    { id: 'Remote work', icon: Globe, label: 'Remote team sync', desc: 'Async huddles, meetings, and notes' },
  ];

  const templates = [
    {
      id: 'Software Team',
      icon: FolderGit2,
      name: 'Software Team',
      desc: 'Channels: #general, #engineering, #releases. Projects: Web App, API. Sprints enabled.',
    },
    {
      id: 'Startup',
      icon: Rocket,
      name: 'Startup MVP',
      desc: 'Fast-paced execution with combined product & dev channels, lean backlog.',
    },
    {
      id: 'Product Team',
      icon: Layout,
      name: 'Product & Design',
      desc: 'Spec documentation, customer interview notes, design critique channels.',
    },
    {
      id: 'Agency',
      icon: Building,
      name: 'Client Agency',
      desc: 'Multi-client project folders, milestone deliverables, client shared pages.',
    },
    {
      id: 'Personal Workspace',
      icon: Users,
      name: 'Personal Sandbox',
      desc: 'Individual task tracking, notes scratchpad, GitHub sync.',
    },
  ];

  const handleNameChange = (val: string) => {
    setWsName(val);
    setWsSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
  };

  const handleAddEmail = () => {
    if (newEmail && !inviteEmails.includes(newEmail)) {
      setInviteEmails([...inviteEmails, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  };

  const handleFinish = () => {
    setCreating(true);
    const newWorkspace = backletStore.createWorkspace(wsName, wsSlug, template);
    setTimeout(() => {
      router.push(`/workspace/${newWorkspace.slug}/dashboard`);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Workspace Setup Wizard</h1>
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-all ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {step} of 4</p>
        </div>

        <Card className="border-border/60 shadow-2xl">
          {/* STEP 1: USE CASE */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>What are you using Backlet for?</CardTitle>
                <CardDescription>
                  We will tailor your default templates, integrations, and widgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {useCases.map((u) => {
                  const Icon = u.icon;
                  const isSelected = useCase === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUseCase(u.id)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border/60 hover:border-primary/40 bg-card'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{u.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{u.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-4">
                <Button onClick={() => setStep(2)} className="gap-2">
                  Next: Workspace Details <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 2: WORKSPACE DETAILS */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Create your workspace</CardTitle>
                <CardDescription>
                  Workspaces contain your team channels, projects, meetings, and knowledge base.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Workspace Name</label>
                  <Input
                    type="text"
                    value={wsName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Acme Engineering"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Workspace URL</label>
                  <div className="flex items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground">
                    <span className="text-xs">app.backlet.dev/</span>
                    <input
                      type="text"
                      value={wsSlug}
                      onChange={(e) => setWsSlug(e.target.value)}
                      className="w-full bg-transparent p-2 text-sm text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Company / Team Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1-10 members', '11-50 members', '50+ members'].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={teamSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTeamSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next: Invite Team <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 3: INVITE TEAMMATES */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Invite teammates</CardTitle>
                <CardDescription>
                  Backlet works best when engineering, product, and design collaborate in realtime.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="teammate@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                  />
                  <Button type="button" onClick={handleAddEmail} variant="secondary">
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Invited Members ({inviteEmails.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {inviteEmails.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs">
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="hover:text-destructive text-muted-foreground ml-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                  💡 Teammates will automatically be enrolled as members with access to public channels and project boards.
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} className="gap-2">
                  Next: Choose Template <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 4: TEMPLATE SELECTION */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Choose your workspace template</CardTitle>
                <CardDescription>
                  We’ll pre-configure starter channels, projects, and roadmap templates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((t) => {
                  const Icon = t.icon;
                  const isSelected = template === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate(t.id)}
                      className={`flex w-full items-start gap-4 rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border/60 hover:border-primary/40 bg-card'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2.5 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{t.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                <Button variant="ghost" onClick={() => setStep(3)} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleFinish} className="gap-2" disabled={creating}>
                  {creating ? 'Creating Workspace...' : 'Launch Workspace'}
                  <Rocket className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

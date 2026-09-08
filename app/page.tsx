import Link from 'next/link';
import { ArrowRight, Layers, MessageSquare, Video, FileText, CheckSquare, Github, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              B
            </div>
            <span className="text-xl font-bold tracking-tight">Backlet</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/workspace/backlet-labs/dashboard">
              <Button size="sm" className="gap-2">
                Launch Backlet Labs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              The Developer & Professional Productivity Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Your team’s workspace, meetings, knowledge & execution in{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                one place.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Backlet connects the entire cycle:
              <br />
              <strong className="text-foreground">
                Discuss → Meet → Decide → Document → Assign → Build → Track
              </strong>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/workspace/backlet-labs/dashboard">
                <Button size="lg" className="gap-2 text-base px-7">
                  Enter Demo Workspace <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="lg" variant="outline" className="text-base px-7">
                  Create Workspace
                </Button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 text-left">
              {[
                { icon: MessageSquare, label: 'Channels & DMs', sub: 'Slack-grade' },
                { icon: Video, label: 'AI Meetings', sub: 'Action items' },
                { icon: FileText, label: 'Knowledge Hub', sub: 'Notion-grade' },
                { icon: CheckSquare, label: 'Issue Tracking', sub: 'Linear-grade' },
                { icon: Github, label: 'GitHub Workflows', sub: 'PRs & Commits' },
                { icon: Sparkles, label: 'Omni Copilot', sub: 'Multi-source AI' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/50"
                >
                  <item.icon className="h-5 w-5 text-primary mb-2" />
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Backlet Inc. Built for high-velocity engineering and product teams.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="h-4 w-4" /> Supabase RLS Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

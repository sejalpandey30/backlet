'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Github, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { backletStore } from '@/lib/db/store';
import { DEMO_PROFILES } from '@/lib/seed/demo-data';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    // Simulate auth token exchange
    setTimeout(() => {
      router.push('/workspace/backlet-labs/dashboard');
    }, 600);
  };

  const handleDemoLogin = (profileKey: keyof typeof DEMO_PROFILES) => {
    const profile = DEMO_PROFILES[profileKey];
    backletStore.setCurrentUser(profile);
    router.push('/workspace/backlet-labs/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back to Backlet</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your team workspace, meetings, and tasks
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your work email or choose a demo persona below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In with Email'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or instant demo sign-in</span>
              </div>
            </div>

            {/* 1-Click Demo Profiles */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 text-left"
                onClick={() => handleDemoLogin('alex')}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">Alex (Lead Arch)</div>
                  <div className="text-[10px] text-muted-foreground">Engineering</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 text-left"
                onClick={() => handleDemoLogin('maya')}
              >
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">Maya (Full-stack)</div>
                  <div className="text-[10px] text-muted-foreground">Frontend/UI</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 text-left"
                onClick={() => handleDemoLogin('jordan')}
              >
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">Jordan (Product)</div>
                  <div className="text-[10px] text-muted-foreground">Specs & Roadmap</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 text-left"
                onClick={() => handleDemoLogin('sam')}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">Sam (DevOps)</div>
                  <div className="text-[10px] text-muted-foreground">K8s & CI/CD</div>
                </div>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 py-4 text-xs text-muted-foreground">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="ml-1 font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

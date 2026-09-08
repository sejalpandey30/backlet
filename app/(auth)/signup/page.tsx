'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { backletStore } from '@/lib/db/store';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Register user in store
    const newUser = {
      id: 'user-' + Date.now(),
      email,
      fullName: name,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      roleTitle: 'Software Engineer',
      status: 'online' as const,
    };
    backletStore.setCurrentUser(newUser);

    setTimeout(() => {
      router.push('/onboarding');
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your Backlet account</h1>
          <p className="text-sm text-muted-foreground">
            Join your engineering team or launch a new workspace
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>Free for teams up to 10 members. No credit card required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-3 gap-2" disabled={loading}>
                {loading ? 'Creating account...' : 'Continue to Workspace Setup'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 py-4 text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="ml-1 font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [completed, setCompleted] = React.useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setCompleted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a strong password with at least 8 characters
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          {completed ? (
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Password Updated</h3>
              <p className="text-sm text-muted-foreground">
                Your password has been changed successfully.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Sign in with new password
              </Button>
            </CardContent>
          ) : (
            <CardContent className="pt-6">
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

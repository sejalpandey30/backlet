'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            We will send you a secure magic link to reset your account credentials
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          {sent ? (
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Check your inbox</h3>
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>.
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Return to Sign in
                </Button>
              </Link>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">Forgot password</CardTitle>
                <CardDescription>Enter your account email to receive instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center border-t border-border/50 py-4 text-xs text-muted-foreground">
            <Link href="/login" className="inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

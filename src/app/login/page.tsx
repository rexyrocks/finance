'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('owner@networth.local');

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-700/60 bg-ink-800 p-8 shadow-card">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400 font-display text-base text-ink-900">N</span>
        <h1 className="mt-4 font-display text-xl text-ink-0">Sign in to NetWorth OS</h1>
        <p className="mt-1 text-sm text-ink-200">
          This demo uses a seeded account. Replace with real OAuth or password auth in <code>src/lib/auth.ts</code>.
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            signIn('credentials', { email, callbackUrl: '/' });
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-xl border border-ink-700 bg-ink-700/40 px-3 text-sm text-ink-0 focus:border-gold-400 focus:outline-none"
          />
          <Button type="submit" variant="primary" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}

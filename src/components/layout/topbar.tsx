'use client';

import { useState } from 'react';
import { Search, Moon, Sun, Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [dark, setDark] = useState(true);

  return (
    <header className="flex flex-col gap-4 border-b border-ink-700/60 bg-ink-900/80 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl text-ink-0">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-ink-200">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
          <input
            placeholder="Search records..."
            className="h-9 w-56 rounded-xl border border-ink-700 bg-ink-800 pl-9 pr-3 text-sm text-ink-0 placeholder:text-ink-200 focus:border-gold-400 focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="md" aria-label="Notifications">
          <Bell size={16} />
        </Button>
        <Button variant="ghost" size="md" aria-label="Export report">
          <Download size={16} />
        </Button>
        <Button variant="ghost" size="md" aria-label="Toggle theme" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
    </header>
  );
}

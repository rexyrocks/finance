'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Wallet, CreditCard, ShieldCheck, LineChart, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Assets', icon: Wallet },
  { href: '/liabilities', label: 'Liabilities', icon: CreditCard },
  { href: '/insurance', label: 'Insurance', icon: ShieldCheck },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-700/60 bg-ink-850 px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 font-display text-base font-medium text-ink-900">
          N
        </span>
        <span className="font-display text-lg text-ink-0">NetWorth OS</span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-ink-700 text-ink-0' : 'text-ink-200 hover:bg-ink-700/60 hover:text-ink-0',
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 hover:bg-ink-700/60 hover:text-ink-0"
      >
        <Settings size={16} />
        Settings
      </Link>
    </aside>
  );
}

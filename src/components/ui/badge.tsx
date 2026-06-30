import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const toneClasses = {
  neutral: 'bg-ink-700 text-ink-100',
  gold: 'bg-gold-400/15 text-gold-300',
  emerald: 'bg-emerald-400/15 text-emerald-300',
  coral: 'bg-coral-400/15 text-coral-300',
  sapphire: 'bg-sapphire-400/15 text-sapphire-300',
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneClasses;
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

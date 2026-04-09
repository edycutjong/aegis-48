import { cn } from '@/lib/utils';
import type { ChainType } from '@/lib/types';

interface ChainBadgeProps {
  name: string;
  emoji: string;
  chainType: ChainType;
  className?: string;
}

export function ChainBadge({ name, emoji, chainType, className }: ChainBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'bg-surface-elevated border border-border text-xs font-medium text-text-secondary',
        className
      )}
    >
      <span>{emoji}</span>
      <span>{name}</span>
      <span className="text-text-muted uppercase text-[10px] tracking-wider">
        {chainType}
      </span>
    </span>
  );
}

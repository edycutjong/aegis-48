import { cn } from '@/lib/utils';
import type { ChainType } from '@/lib/types';

interface ChainBadgeProps {
  name: string;
  iconUrl: string;
  chainType: ChainType;
  className?: string;
}

export function ChainBadge({ name, iconUrl, chainType, className }: ChainBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'bg-surface-elevated border border-border text-xs font-medium text-text-secondary',
        className
      )}
    >
      {iconUrl ? <img src={iconUrl} alt={name} className="w-3.5 h-3.5" /> : <span>🔗</span>}
      <span>{name}</span>
      <span className="text-text-muted uppercase text-[10px] tracking-wider">
        {chainType}
      </span>
    </span>
  );
}

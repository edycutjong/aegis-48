'use client';

import { cn } from '@/lib/utils';

interface ExampleChipProps {
  emoji: string;
  label: string;
  address: string;
  onClick: (address: string, chainId: string) => void;
  chainId: string;
}

export function ExampleChip({ emoji, label, address, onClick, chainId }: ExampleChipProps) {
  return (
    <button
      onClick={() => onClick(address, chainId)}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'glass border border-border hover:border-border-bright',
        'text-sm text-text-secondary hover:text-text-primary',
        'transition-all duration-200 hover:scale-[1.03]',
        'active:scale-[0.97]'
      )}
    >
      <span>{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

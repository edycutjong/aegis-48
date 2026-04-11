'use client';

import { cn } from '@/lib/utils';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ExampleChipProps {
  status: 'safe' | 'vuln';
  label: string;
  address: string;
  onClick: (address: string, chainId: string) => void;
  chainId: string;
}

export function ExampleChip({ status, label, address, onClick, chainId }: ExampleChipProps) {
  return (
    <button
      onClick={() => onClick(address, chainId)}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'glass border hover:border-border-bright',
        status === 'safe' ? 'border-safe/30' : 'border-danger/30',
        'text-sm text-text-secondary hover:text-text-primary',
        'transition-all duration-200 hover:scale-[1.03]',
        'active:scale-[0.97]'
      )}
    >
      {status === 'safe' ? (
        <ShieldCheck className="w-4 h-4 text-safe" />
      ) : (
        <ShieldAlert className="w-4 h-4 text-danger" />
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
}

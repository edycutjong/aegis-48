'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ExampleChip } from '@/components/ExampleChip';
import { ScanAnimation } from '@/components/ScanAnimation';
import { DEMO_CONTRACTS, getDemoContract } from '@/data/demo-contracts';
import { CHAINS, MOCK_STATS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type AppState = 'idle' | 'scanning';

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>('idle');
  const [scanAddress, setScanAddress] = useState('');
  const [scanChainId, setScanChainId] = useState('');

  const handleSubmit = useCallback(
    (address: string, chainId: string) => {
      setScanAddress(address);
      setScanChainId(chainId);

      // For demo contracts, check if we need to resolve chainId
      const demo = getDemoContract(address);
      const resolvedChainId = demo ? demo.chainId : chainId;
      setScanChainId(resolvedChainId);
      setState('scanning');
    },
    []
  );

  const handleScanComplete = useCallback(() => {
    const demo = getDemoContract(scanAddress);
    const chainId = demo ? demo.chainId : scanChainId;
    router.push(`/audit/${chainId}/${encodeURIComponent(scanAddress)}`);
  }, [scanAddress, scanChainId, router]);

  const chainName =
    CHAINS.find((c) => c.id === scanChainId)?.name || 'Unknown';

  if (state === 'scanning') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <ScanAnimation
          chainName={chainName}
          address={scanAddress}
          onComplete={handleScanComplete}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto space-y-8 text-center">
        {/* Shield Logo */}
        <div className="flex justify-center">
          <div
            className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center',
              'bg-primary/10 border border-primary/20'
            )}
          >
            <Shield className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-text-primary">
            AEGIS-48
          </h1>
          <p className="text-lg text-text-secondary">
            Cross-Chain Security Oracle
          </p>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Paste any contract address from any blockchain. Get an instant
            AI-powered security audit with vulnerability line references.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSubmit={handleSubmit} />

        {/* Example Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {DEMO_CONTRACTS.map((demo) => (
            <ExampleChip
              key={demo.address}
              emoji={demo.emoji}
              label={demo.label}
              address={demo.address}
              chainId={demo.chainId}
              onClick={handleSubmit}
            />
          ))}
        </div>

        {/* Chain Support Icons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          {CHAINS.slice(0, 6).map((chain) => (
            <div
              key={chain.id}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors cursor-default"
              title={chain.name}
            >
              <span className="text-xl opacity-50 hover:opacity-100 transition-opacity">
                {chain.iconEmoji}
              </span>
            </div>
          ))}
          <span className="text-xs text-text-muted">+42 more</span>
        </div>

        {/* Floating Counter */}
        <CounterStat value={MOCK_STATS.totalAudits} />
      </div>
    </main>
  );
}

function CounterStat({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <p className="text-xs text-text-muted pt-6">
      <span className="font-mono text-text-secondary font-bold">
        {count.toLocaleString()}
      </span>{' '}
      contracts audited
    </p>
  );
}

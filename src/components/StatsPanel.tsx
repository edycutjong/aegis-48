'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface StatsPanelProps {
  totalAudits: number;
  criticalFindings: number;
  safeContracts: number;
  chainsCovered: number;
}

export function StatsPanel({
  totalAudits,
  criticalFindings,
  safeContracts,
  chainsCovered,
}: StatsPanelProps) {
  const stats: Stat[] = [
    {
      label: 'Total Audits',
      value: totalAudits,
      icon: <Shield className="w-5 h-5" />,
      color: 'var(--color-primary)',
    },
    {
      label: 'Critical Findings',
      value: criticalFindings,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'var(--color-critical)',
    },
    {
      label: 'Safe Contracts',
      value: safeContracts,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'var(--color-safe)',
    },
    {
      label: 'Chains Covered',
      value: chainsCovered,
      icon: <Globe className="w-5 h-5" />,
      color: 'var(--color-ai)',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} delay={i * 150} />
      ))}
    </div>
  );
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(stat.value * eased));

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [stat.value, delay]);

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-4 count-up',
        'hover:border-border-bright hover:bg-surface-elevated transition-all duration-200'
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: stat.color }}>{stat.icon}</div>
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {stat.label}
        </span>
      </div>
      <p className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
        {count.toLocaleString()}
      </p>
    </div>
  );
}

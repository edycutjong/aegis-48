'use client';

import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanAnimationProps {
  chainName: string;
  address: string;
  onComplete?: () => void;
}

const STAGES = [
  { label: 'Fetching bytecode', duration: 600 },
  { label: 'Decompiling contract', duration: 1000 },
  { label: 'Running AI security analysis', duration: 3000 },
  { label: 'Generating report', duration: 500 },
];

export function ScanAnimation({ chainName, address, onComplete }: ScanAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stagesComplete, setStagesComplete] = useState<boolean[]>(
    new Array(STAGES.length).fill(false)
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let totalDelay = 0;

    STAGES.forEach((stage, i) => {
      totalDelay += stage.duration;
      timeout = setTimeout(() => {
        setStagesComplete((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setCurrentStage(i + 1);

        if (i === STAGES.length - 1 && onComplete) {
          setTimeout(onComplete, 300);
        }
      }, totalDelay);
    });

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Sonar Rings */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'absolute inset-0 rounded-full border border-ai/30 sonar-ring'
            )}
          />
        ))}
        <div className="relative z-10 w-16 h-16 rounded-full bg-surface-elevated border border-ai/40 flex items-center justify-center">
          <Shield className="w-8 h-8 text-ai" />
        </div>
      </div>

      {/* Address */}
      <div className="text-center space-y-2">
        <p className="font-mono text-lg text-text-primary tracking-wide">
          {address.length > 20
            ? `${address.slice(0, 10)}...${address.slice(-8)}`
            : address}
        </p>
        <p className="text-sm text-text-secondary">
          Analyzing contract on <span className="text-ai font-semibold">{chainName}</span>
        </p>
      </div>

      {/* Progress Stages */}
      <div className="space-y-3 w-full max-w-sm">
        {STAGES.map((stage, i) => (
          <div
            key={stage.label}
            className={cn(
              'flex items-center gap-3 text-sm transition-all duration-300',
              stagesComplete[i]
                ? 'text-safe'
                : currentStage === i
                ? 'text-ai'
                : 'text-text-muted'
            )}
          >
            <span className="w-5 text-center">
              {stagesComplete[i] ? '✓' : currentStage === i ? '⟳' : '○'}
            </span>
            <span className={cn(stagesComplete[i] && 'line-through opacity-60')}>
              {stage.label}...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

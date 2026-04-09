'use client';

import { useEffect, useState } from 'react';
import { SEVERITY_CONFIG } from '@/lib/constants';
import type { Severity } from '@/lib/types';

interface ThreatGaugeProps {
  score: number;
  severity: Severity;
  size?: number;
}

export function ThreatGauge({ score, severity, size = 120 }: ThreatGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = SEVERITY_CONFIG[severity];

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
          style={{
            filter: `drop-shadow(0 0 6px ${config.color}60)`,
          }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-3xl font-bold"
          style={{ color: config.color }}
        >
          {animatedScore}
        </span>
        <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

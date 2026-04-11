'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { truncateAddress, formatDuration } from '@/lib/utils';
import { SEVERITY_CONFIG } from '@/lib/constants';
import { ThreatGauge } from './ThreatGauge';
import { ChainBadge } from './ChainBadge';
import { Share2, Copy, Check, Skull, Flame, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import type { Severity, ChainType } from '@/lib/types';

interface VerdictBannerProps {
  severity: Severity;
  threatScore: number;
  contractAddress: string;
  chainName: string;
  chainType: ChainType;
  chainIconUrl: string;
  analysisTimeMs: number;
  vulnerabilityCount: number;
}

export function VerdictBanner({
  severity,
  threatScore,
  contractAddress,
  chainName,
  chainType,
  chainIconUrl,
  analysisTimeMs,
  vulnerabilityCount,
}: VerdictBannerProps) {
  const [hasFlashed, setHasFlashed] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = SEVERITY_CONFIG[severity];

  const flashClass =
    severity === 'CRITICAL' || severity === 'HIGH'
      ? 'flash-critical'
      : severity === 'SAFE' || severity === 'LOW'
      ? 'flash-safe'
      : 'flash-medium';

  useEffect(() => {
    setHasFlashed(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const IconComponent = {
    CRITICAL: Skull,
    HIGH: Flame,
    MEDIUM: AlertTriangle,
    LOW: Info,
    SAFE: ShieldCheck,
  }[severity];

  return (
    <div
      className={cn(
        'relative w-full px-6 py-8 md:py-10 rounded-2xl overflow-hidden',
        hasFlashed && flashClass,
        severity === 'CRITICAL' || severity === 'HIGH'
          ? 'screen-shake'
          : ''
      )}
      style={{
        background: `linear-gradient(135deg, ${config.bg}, var(--color-surface))`,
        borderLeft: `4px solid ${config.color}`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${config.color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Verdict + Info */}
        <div className="flex-1 space-y-3">
          {/* Verdict Label */}
          <div className="flex items-center gap-3">
            <span className="text-4xl" style={{ color: config.color }}>
              <IconComponent className="w-10 h-10" />
            </span>
            <h1
              className="text-5xl md:text-6xl font-black tracking-tight"
              style={{ color: config.color }}
            >
              {config.label}
            </h1>
          </div>

          {/* Contract Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <ChainBadge name={chainName} iconUrl={chainIconUrl} chainType={chainType} />
            <span className="font-mono text-text-secondary">
              {truncateAddress(contractAddress)}
            </span>
            <span className="text-text-muted">·</span>
            <span className="text-text-secondary">
              Analyzed in {formatDuration(analysisTimeMs)}
            </span>
            {vulnerabilityCount > 0 && (
              <>
                <span className="text-text-muted">·</span>
                <span style={{ color: config.color }} className="font-semibold">
                  {vulnerabilityCount} finding{vulnerabilityCount !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>

          {/* Share */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-safe" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied!' : 'Share Report'}
          </button>
        </div>

        {/* Right: Threat Gauge */}
        <div className="shrink-0">
          <ThreatGauge score={threatScore} severity={severity} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Vulnerability } from '@/lib/types';

interface CodeViewerProps {
  code: string;
  language: string;
  vulnerabilities: Vulnerability[];
  highlightedVuln?: Vulnerability | null;
}

export function CodeViewer({ code, language, vulnerabilities, highlightedVuln }: CodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  // Build a set of vulnerable line numbers
  const lineMarkers = new Map<number, { severity: string; color: string }>();
  vulnerabilities.forEach((v) => {
    if (v.lineStart && v.lineEnd) {
      const color =
        v.severity === 'CRITICAL'
          ? 'critical'
          : v.severity === 'HIGH'
          ? 'high'
          : 'medium';
      for (let i = v.lineStart; i <= v.lineEnd; i++) {
        lineMarkers.set(i, { severity: v.severity, color });
      }
    }
  });

  // Scroll to highlighted vulnerability
  useEffect(() => {
    if (highlightedVuln?.lineStart && containerRef.current) {
      const lineEl = containerRef.current.querySelector(
        `[data-line="${highlightedVuln.lineStart}"]`
      );
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedVuln]);

  const isHighlighted = (lineNum: number) => {
    if (!highlightedVuln?.lineStart || !highlightedVuln?.lineEnd) return false;
    return lineNum >= highlightedVuln.lineStart && lineNum <= highlightedVuln.lineEnd;
  };

  return (
    <div className="rounded-xl border border-border bg-code-bg overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-critical/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-medium/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-safe/60" />
          </div>
          <span className="text-xs text-text-muted font-mono uppercase tracking-wider">
            {language}
          </span>
        </div>
        <span className="text-xs text-text-muted">
          {lines.length} lines
        </span>
      </div>

      {/* Code */}
      <div ref={containerRef} className="overflow-auto flex-1 text-[13px] leading-6">
        <table className="w-full">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const marker = lineMarkers.get(lineNum);
              const highlighted = isHighlighted(lineNum);

              return (
                <tr
                  key={lineNum}
                  data-line={lineNum}
                  className={cn(
                    'transition-colors duration-300',
                    marker && `code-line-${marker.color}`,
                    highlighted && 'bg-primary/10 ring-1 ring-inset ring-primary/30'
                  )}
                >
                  {/* Line Number */}
                  <td className="w-12 text-right pr-4 pl-3 select-none text-text-muted/50 font-mono text-xs">
                    {marker && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                        style={{
                          backgroundColor:
                            marker.severity === 'CRITICAL'
                              ? 'var(--color-critical)'
                              : marker.severity === 'HIGH'
                              ? 'var(--color-high)'
                              : 'var(--color-medium)',
                        }}
                      />
                    )}
                    {lineNum}
                  </td>
                  {/* Code */}
                  <td className="pr-4 font-mono text-text-secondary whitespace-pre">
                    {line || ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

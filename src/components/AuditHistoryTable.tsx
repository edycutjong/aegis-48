'use client';

import Link from 'next/link';
import { cn, truncateAddress, formatRelativeTime } from '@/lib/utils';
import { SeverityBadge } from './SeverityBadge';
import { getChain } from '@/lib/constants';
import type { AuditReport } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface AuditHistoryTableProps {
  audits: AuditReport[];
}

export function AuditHistoryTable({ audits }: AuditHistoryTableProps) {
  if (audits.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg">No audits yet</p>
        <p className="text-sm mt-1">Scan your first contract to see results here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-surface border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Address
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Chain
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Verdict
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Score
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Findings
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => {
            const chain = getChain(audit.chainId);
            return (
              <tr
                key={audit.id}
                className="border-b border-border/50 hover:bg-surface-elevated transition-colors group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/audit/${audit.chainId}/${audit.contractAddress}`}
                    className="flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {truncateAddress(audit.contractAddress)}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <span>{chain?.iconEmoji || '🔗'}</span>
                    <span>{audit.chainName}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={audit.severity} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-sm font-bold"
                    style={{
                      color:
                        audit.threatScore >= 70
                          ? 'var(--color-critical)'
                          : audit.threatScore >= 40
                          ? 'var(--color-medium)'
                          : 'var(--color-safe)',
                    }}
                  >
                    {audit.threatScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {audit.vulnerabilities.length}
                </td>
                <td className="px-4 py-3 text-right text-xs text-text-muted">
                  {formatRelativeTime(audit.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

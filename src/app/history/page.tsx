'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { StatsPanel } from '@/components/StatsPanel';
import { AuditHistoryTable } from '@/components/AuditHistoryTable';
import { getDemoHistory } from '@/data/demo-contracts';
import { MOCK_STATS } from '@/lib/constants';

export default function HistoryPage() {
  const audits = getDemoHistory();

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <nav className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-text-primary">Audit History</h1>
      </div>

      {/* Stats Panel */}
      <StatsPanel
        totalAudits={MOCK_STATS.totalAudits}
        criticalFindings={MOCK_STATS.criticalFindings}
        safeContracts={MOCK_STATS.safeContracts}
        chainsCovered={MOCK_STATS.chainsCovered}
      />

      {/* Audit Table */}
      <AuditHistoryTable audits={audits} />

      {/* Footer */}
      <p className="text-center text-xs text-text-muted py-4">
        All audit data stored and cached via Supabase PostgreSQL
      </p>
    </main>
  );
}

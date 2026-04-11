'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any;
    }
  }
}
import { VerdictBanner } from '@/components/VerdictBanner';
import { VulnerabilityCard } from '@/components/VulnerabilityCard';
import { CodeViewer } from '@/components/CodeViewer';
import { getDemoContract } from '@/data/demo-contracts';
import { getChain } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Vulnerability, AuditReport } from '@/lib/types';

export default function AuditReportPage() {
  const params = useParams();
  const chain = params.chain as string;
  const address = decodeURIComponent(params.address as string);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [mintStatus, setMintStatus] = useState<'idle' | 'minting' | 'success'>('idle');

  const handleMint = useCallback(() => {
    if (mintStatus !== 'idle') return;
    setMintStatus('minting');
    
    // Mock a blockchain transaction delay
    setTimeout(() => {
      setMintStatus('success');
    }, 2500);
  }, [mintStatus]);

  // Look up the demo contract
  const demo = getDemoContract(address);
  const report: AuditReport | null = demo?.report || null;
  const chainInfo = getChain(chain) || getChain(demo?.chainId || 'ethereum');

  if (!report) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 relative flex flex-col items-center">
          <div className="w-24 h-24 opacity-60">
            <dotlottie-wc 
              src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie" 
              autoplay 
              loop 
              speed="0.5"
              style={{ width: '100%', height: '100%' }}>
            </dotlottie-wc>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Audit Not Found</h1>
          <p className="text-text-secondary">
            No cached audit found for this address.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scanner
          </Link>
        </div>
      </main>
    );
  }

  const handleVulnSelect = useCallback((vuln: Vulnerability) => {
    setSelectedVuln((prev) => (prev?.id === vuln.id ? null : vuln));
  }, []);

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
        <Link
          href="/history"
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          History
        </Link>
      </nav>

      {/* Verdict Banner */}
      <VerdictBanner
        severity={report.severity}
        threatScore={report.threatScore}
        contractAddress={report.contractAddress}
        chainName={report.chainName}
        chainType={report.chainType}
        chainIconUrl={chainInfo?.iconUrl || ''}
        analysisTimeMs={report.analysisTimeMs}
        vulnerabilityCount={report.vulnerabilities.length}
      />

      {/* Summary */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
          AI Analysis Summary
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {report.summary}
        </p>
      </div>

      {/* Two-Panel Layout: Findings + Code */}
      {report.vulnerabilities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left: Vulnerability Cards */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <span>Vulnerabilities</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--color-critical-glow)',
                  color: 'var(--color-critical)',
                }}
              >
                {report.vulnerabilities.length}
              </span>
            </h2>
            {report.vulnerabilities.map((vuln, i) => (
              <VulnerabilityCard
                key={vuln.id}
                vulnerability={vuln}
                index={i}
                onSelect={handleVulnSelect}
                isSelected={selectedVuln?.id === vuln.id}
              />
            ))}
          </div>

          {/* Right: Code Viewer */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-3">
              Source Code
            </h2>
            <div className="h-[600px]">
              <CodeViewer
                code={report.sourceCode}
                language={report.language}
                vulnerabilities={report.vulnerabilities}
                highlightedVuln={selectedVuln}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Safe contract — show code viewer full-width + mint CTA */
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-safe/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-safe" />
              </div>
              <h2 className="text-xl font-bold text-safe">No Vulnerabilities Detected</h2>
              <p className="text-sm text-text-secondary max-w-md">
                This contract passes all security checks for the{' '}
                <span className="font-semibold">{report.chainType.toUpperCase()}</span> vulnerability
                checklist.
              </p>

              {/* Mint CTA */}
              <button
                onClick={handleMint}
                disabled={mintStatus !== 'idle'}
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-xl',
                  mintStatus === 'success'
                    ? 'bg-safe text-[#002b16] font-bold shadow-[0_0_20px_rgba(0,230,118,0.3)]'
                    : 'bg-primary hover:bg-primary-glow text-white glow-primary',
                  'font-semibold transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed'
                )}
              >
                {mintStatus === 'idle' && (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Mint Aegis Verified Credential
                  </>
                )}
                {mintStatus === 'minting' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming Transaction...
                  </>
                )}
                {mintStatus === 'success' && (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Credential Successfully Minted
                  </>
                )}
              </button>
            </div>
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Source Code
          </h2>
          <div className="h-[500px]">
            <CodeViewer
              code={report.sourceCode}
              language={report.language}
              vulnerabilities={[]}
              highlightedVuln={null}
            />
          </div>
        </div>
      )}
    </main>
  );
}

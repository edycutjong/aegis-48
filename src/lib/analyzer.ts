import { getDemoContract } from '@/data/demo-contracts';
import type { AuditReport } from './types';
import { CHAINS } from './constants';
import { v4Style } from './utils';

/**
 * Mock analyzer engine.
 * For demo contracts: returns pre-cached results instantly.
 * For unknown addresses: generates a deterministic mock based on address hash.
 */
export async function analyzeContract(
  address: string,
  chainId: string
): Promise<AuditReport> {
  // Check demo contracts first (instant)
  const demo = getDemoContract(address);
  if (demo) {
    return demo.report;
  }

  // For unknown addresses, simulate analysis delay
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Generate deterministic mock based on address
  const hash = simpleHash(address);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  const isSafe = hash % 3 === 0;

  const report: AuditReport = {
    id: v4Style(hash),
    chainId: chain.id,
    chainName: chain.name,
    chainType: chain.chainType,
    contractAddress: address,
    severity: isSafe ? 'SAFE' : hash % 5 === 0 ? 'CRITICAL' : 'HIGH',
    threatScore: isSafe ? Math.floor(hash % 15) : 40 + Math.floor(hash % 55),
    vulnerabilities: isSafe
      ? []
      : [
          {
            id: `${chain.chainType}-generic-001`,
            name: 'Potential Access Control Issue',
            severity: 'HIGH',
            lineReference: null,
            lineStart: null,
            lineEnd: null,
            description:
              'The contract bytecode suggests potential access control weaknesses. A full source code review is recommended for definitive analysis.',
            remediation:
              'Implement role-based access control using established patterns for this chain type.',
          },
        ],
    sourceCode: `// Bytecode analysis — source code not verified on-chain\n// Address: ${address}\n// Chain: ${chain.name}\n\n// Full decompilation not available for unverified contracts.\n// Aegis-48 analyzed the raw bytecode for known vulnerability patterns.`,
    language: chain.chainType === 'evm' ? 'solidity' : chain.chainType === 'svm' ? 'rust' : 'move',
    analysisTimeMs: 2000 + Math.floor(Math.random() * 4000),
    createdAt: new Date().toISOString(),
    summary: isSafe
      ? 'No critical vulnerability patterns detected in bytecode analysis. Note: source verification recommended for comprehensive audit.'
      : 'Potential security concerns detected. Full source code verification recommended for definitive findings.',
  };

  return report;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

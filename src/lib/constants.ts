import type { Chain, ChainType, Severity } from './types';

/* ============================================
   CHAIN REGISTRY
   ============================================ */

export const CHAINS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainType: 'evm',
    rpcUrl: 'https://eth.public-rpc.com',
    explorerUrl: 'https://etherscan.io',
    iconUrl: '/icons/ethereum.svg',
    isTestnet: false,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainType: 'evm',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    iconUrl: '/icons/arbitrum.svg',
    isTestnet: false,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainType: 'evm',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    iconUrl: '/icons/polygon.svg',
    isTestnet: false,
  },
  {
    id: 'base',
    name: 'Base',
    chainType: 'evm',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    iconUrl: '/icons/base.svg',
    isTestnet: false,
  },
  {
    id: 'solana',
    name: 'Solana',
    chainType: 'svm',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    iconUrl: '/icons/solana.svg',
    isTestnet: false,
  },
  {
    id: 'aptos',
    name: 'Aptos',
    chainType: 'move',
    rpcUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
    explorerUrl: 'https://explorer.aptoslabs.com',
    iconUrl: '/icons/aptos.svg',
    isTestnet: false,
  },
];

export function getChain(id: string): Chain | undefined {
  return CHAINS.find((c) => c.id === id);
}

export function getChainsByType(type: ChainType): Chain[] {
  return CHAINS.filter((c) => c.chainType === type);
}

/* ============================================
   SEVERITY CONFIGURATION
   ============================================ */

export const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; label: string; icon: string }> = {
  CRITICAL: { color: '#ff2d55', bg: 'rgba(255,45,85,0.12)', label: 'CRITICAL', icon: '💀' },
  HIGH:     { color: '#ff6b35', bg: 'rgba(255,107,53,0.12)', label: 'HIGH',     icon: '🔥' },
  MEDIUM:   { color: '#ffb800', bg: 'rgba(255,184,0,0.12)',  label: 'MEDIUM',   icon: '⚠️' },
  LOW:      { color: '#5a9cf5', bg: 'rgba(90,156,245,0.12)', label: 'LOW',      icon: 'ℹ️' },
  SAFE:     { color: '#00e676', bg: 'rgba(0,230,118,0.12)',  label: 'SAFE',     icon: '✅' },
};

/* ============================================
   VULNERABILITY CHECKLISTS
   ============================================ */

export const EVM_VULNERABILITIES = [
  { id: 'evm-reentrancy',      name: 'Reentrancy Attack',                 typicalSeverity: 'CRITICAL' as const },
  { id: 'evm-unchecked-call',   name: 'Unchecked External Call',           typicalSeverity: 'HIGH' as const },
  { id: 'evm-integer-overflow', name: 'Integer Overflow/Underflow',        typicalSeverity: 'HIGH' as const },
  { id: 'evm-selfdestruct',    name: 'Unprotected selfdestruct',          typicalSeverity: 'CRITICAL' as const },
  { id: 'evm-access-control',  name: 'Missing Access Control',            typicalSeverity: 'HIGH' as const },
  { id: 'evm-frontrun',        name: 'Front-running Susceptibility',      typicalSeverity: 'MEDIUM' as const },
];

export const SVM_VULNERABILITIES = [
  { id: 'svm-missing-signer',  name: 'Missing Signer Check',              typicalSeverity: 'CRITICAL' as const },
  { id: 'svm-missing-owner',   name: 'Missing Owner Check',               typicalSeverity: 'CRITICAL' as const },
  { id: 'svm-arbitrary-cpi',   name: 'Arbitrary Cross-Program Invocation', typicalSeverity: 'HIGH' as const },
  { id: 'svm-uninitialized',   name: 'Uninitialized Account Data',        typicalSeverity: 'HIGH' as const },
  { id: 'svm-rent-exempt',     name: 'Missing Rent Exemption Check',      typicalSeverity: 'MEDIUM' as const },
  { id: 'svm-pda-validation',  name: 'PDA Seed Validation Missing',       typicalSeverity: 'HIGH' as const },
];

export const MOVE_VULNERABILITIES = [
  { id: 'move-missing-signer',  name: 'Missing signer Parameter',         typicalSeverity: 'CRITICAL' as const },
  { id: 'move-unsafe-borrow',   name: 'Unchecked borrow_global_mut',      typicalSeverity: 'HIGH' as const },
  { id: 'move-missing-acquires', name: 'Missing acquires Annotation',      typicalSeverity: 'MEDIUM' as const },
  { id: 'move-public-entry',   name: 'Public Entry Without Auth',         typicalSeverity: 'HIGH' as const },
  { id: 'move-resource-leak',  name: 'Resource Leak',                     typicalSeverity: 'MEDIUM' as const },
  { id: 'move-abort-handling',  name: 'Missing Abort Code Documentation', typicalSeverity: 'LOW' as const },
];

/* ============================================
   MOCK STATS
   ============================================ */

export const MOCK_STATS = {
  totalAudits: 2847,
  criticalFindings: 423,
  safeContracts: 1892,
  chainsCovered: 48,
};

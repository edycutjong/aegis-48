/* ============================================
   SEVERITY TYPE DEFINITIONS
   ============================================ */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export type ChainType = 'evm' | 'svm' | 'move';

/* ============================================
   CHAIN
   ============================================ */

export interface Chain {
  id: string;
  name: string;
  chainType: ChainType;
  rpcUrl: string;
  explorerUrl: string;
  iconUrl: string;
  isTestnet: boolean;
}

/* ============================================
   VULNERABILITY
   ============================================ */

export interface Vulnerability {
  id: string;
  name: string;
  severity: Exclude<Severity, 'SAFE'>;
  lineReference: string | null;
  lineStart: number | null;
  lineEnd: number | null;
  description: string;
  remediation: string;
  cweId?: string;
}

/* ============================================
   AUDIT REPORT
   ============================================ */

export interface AuditReport {
  id: string;
  chainId: string;
  chainName: string;
  chainType: ChainType;
  contractAddress: string;
  severity: Severity;
  threatScore: number;
  vulnerabilities: Vulnerability[];
  sourceCode: string;
  language: string;
  analysisTimeMs: number;
  createdAt: string;
  summary: string;
}

/* ============================================
   DEMO CONTRACT
   ============================================ */

export interface DemoContract {
  address: string;
  chainId: string;
  label: string;
  status: 'safe' | 'vuln';
  report: AuditReport;
}

/* ============================================
   API TYPES
   ============================================ */

export interface AuditRequest {
  address: string;
  chainId: string;
}

export interface AuditResponse {
  audit: AuditReport;
}

export interface HistoryResponse {
  audits: AuditReport[];
}

export interface ChainsResponse {
  chains: Chain[];
}

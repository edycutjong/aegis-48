/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { AuditHistoryTable } from './AuditHistoryTable';
import { DEMO_CONTRACTS } from '@/data/demo-contracts';

describe('AuditHistoryTable', () => {
  it('renders a list of audits', () => {
    const mediumAudit = {
      ...DEMO_CONTRACTS[0].report,
      id: 'medium-1',
      contractAddress: '0xMediumAddress123',
      threatScore: 50,
      severity: 'MEDIUM' as const,
      chainId: 'unknown-chain'
    };
    const audits = [DEMO_CONTRACTS[0].report, DEMO_CONTRACTS[1].report, mediumAudit];
    const { getByText } = render(<AuditHistoryTable audits={audits} />);

    // Renders table headers
    expect(getByText('Address')).toBeInTheDocument();
    expect(getByText('Chain')).toBeInTheDocument();
    expect(getByText('Verdict')).toBeInTheDocument();
    expect(getByText('Score')).toBeInTheDocument();
    expect(getByText('Findings')).toBeInTheDocument();
    expect(getByText('Date')).toBeInTheDocument();

    // Renders specific addresses (truncated)
    expect(getByText(/0x742d35/)).toBeInTheDocument();
    expect(getByText(/0xA0b869/)).toBeInTheDocument();
  });

  it('renders empty state when no audits passed', () => {
    const { getByText } = render(<AuditHistoryTable audits={[]} />);
    expect(getByText('No audits yet')).toBeInTheDocument();
  });
});

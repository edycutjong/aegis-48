/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import AuditReportPage from './page';
import { useParams } from 'next/navigation';
import { DEMO_CONTRACTS } from '@/data/demo-contracts';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

describe('Audit Report Page', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    Element.prototype.scrollIntoView = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders "Audit Not Found" when no report exists', () => {
    (useParams as jest.Mock).mockReturnValue({
      chain: 'ethereum',
      address: '0xinvalid',
    });

    const { getByText } = render(<AuditReportPage />);
    expect(getByText('Audit Not Found')).toBeInTheDocument();
  });

  it('renders vulnerable contract correctly and handles vulnerability selection', () => {
    const vulnContract = DEMO_CONTRACTS[0]; // Vulnerable target
    (useParams as jest.Mock).mockReturnValue({
      chain: vulnContract.chainId,
      address: vulnContract.address,
    });

    const { getByText, getAllByRole } = render(<AuditReportPage />);
    
    expect(getByText('AI Analysis Summary')).toBeInTheDocument();
    
    // Select first vulnerability card (it's a button wrapping the header)
    // The VulnerabilityCard renders a button wrapping 'Reentrancy in withdraw()' for example
    const vulnCards = getAllByRole('button').filter(b => b.textContent?.includes('Reentrancy') || b.textContent?.includes('Access Control'));
    if (vulnCards.length > 0) {
      fireEvent.click(vulnCards[0]);
      // Click again to unselect
      fireEvent.click(vulnCards[0]);
    }
  });

  it('renders correctly with unknown chain id for fallbacks', () => {
    (useParams as jest.Mock).mockReturnValue({
      chain: 'unknown-chain',
      address: DEMO_CONTRACTS[0].address,
    });
    const { getByText } = render(<AuditReportPage />);
    expect(getByText('AI Analysis Summary')).toBeInTheDocument();
  });

  it('renders safe contract correctly and handles minting', () => {
    const safeContract = DEMO_CONTRACTS[1]; // Safe Target
    (useParams as jest.Mock).mockReturnValue({
      chain: safeContract.chainId,
      address: safeContract.address,
    });

    const { getByText, getByRole } = render(<AuditReportPage />);
    
    expect(getByText('No Vulnerabilities Detected')).toBeInTheDocument();
    
    const mintButton = getByRole('button', { name: /Mint Aegis Verified Credential/i });
    expect(mintButton).toBeInTheDocument();

    // Click mint
    fireEvent.click(mintButton);
    expect(getByText('Confirming Transaction...')).toBeInTheDocument();

    // Fast forward timeouts
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(getByText('Credential Successfully Minted')).toBeInTheDocument();

    // Clicking again should do nothing
    const successButton = getByRole('button', { name: /Credential Successfully Minted/i });
    fireEvent.click(successButton);
    expect(getByText('Credential Successfully Minted')).toBeInTheDocument();
  });
});

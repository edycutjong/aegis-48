/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { VerdictBanner } from './VerdictBanner';

describe('VerdictBanner', () => {
  const originalClipboard = navigator.clipboard;

  beforeAll(() => {
    jest.useFakeTimers();
    // @ts-ignore
    navigator.clipboard = { writeText: jest.fn() };
  });

  afterAll(() => {
    jest.useRealTimers();
    // @ts-ignore
    navigator.clipboard = originalClipboard;
  });

  it('renders CRITICAL verdict and handles copy', () => {
    const { getByText, getByRole } = render(
      <VerdictBanner
        severity="CRITICAL"
        threatScore={95}
        contractAddress="0x12345"
        chainName="Ethereum"
        chainType="evm"
        chainIconUrl=""
        analysisTimeMs={1500}
        vulnerabilityCount={3}
      />
    );

    expect(getByText('CRITICAL')).toBeInTheDocument();
    expect(getByText('3 findings')).toBeInTheDocument();
    
    const copyButton = getByRole('button', { name: /share/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(getByText(/copied/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText(/share/i)).toBeInTheDocument();
  });

  it('renders SAFE verdict without vulnerability count', () => {
    const { getByText, queryByText } = render(
      <VerdictBanner
        severity="SAFE"
        threatScore={5}
        contractAddress="0x12345"
        chainName="Ethereum"
        chainType="evm"
        chainIconUrl=""
        analysisTimeMs={1500}
        vulnerabilityCount={0}
      />
    );

    expect(getByText('SAFE')).toBeInTheDocument();
    expect(queryByText(/finding/i)).toBeNull();
  });
});

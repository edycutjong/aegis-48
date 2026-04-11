/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import Home from './page';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEMO_CONTRACTS } from '@/data/demo-contracts';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock ScanAnimation to avoid long async timeouts in testing
jest.mock('@/components/ScanAnimation', () => ({
  ScanAnimation: ({ onComplete, address, chainName }: any) => (
    <div data-testid="mock-scan-animation">
      Scanning {address} on {chainName}
      <button data-testid="complete-scan" onClick={onComplete}>Complete</button>
    </div>
  ),
}));

jest.mock('@/components/ChainGridModal', () => ({
  ChainGridModal: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="mock-chain-modal">
      <button onClick={onClose} data-testid="close-modal-btn">Close</button>
    </div>
  ) : null,
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  const Dummy = React.forwardRef((props: any, ref: any) => {
    const { children, initial, animate, exit, transition, variants, whileHover, ...rest } = props;
    return <div ref={ref} {...rest}>{children}</div>;
  });
  Dummy.displayName = 'Dummy';
  return {
    motion: {
      div: Dummy,
      main: Dummy,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Home Page', () => {
  let mockRouterPush: jest.Mock;
  let rafSpy: jest.SpyInstance;
  let cafSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    jest.useFakeTimers();
    rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(0), 0) as any;
    });
    cafSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<Home />);
    expect(getByText(/Aegis-48/i)).toBeInTheDocument();
  });

  it('starts scanning automatically if demo and scan=true present', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'demo') return '0';
        if (key === 'scan') return 'true';
        return null;
      },
    });

    const { getByTestId, queryByTestId } = render(<Home />);
    
    // Using act with requestAnimationFrame mock since page uses requestAnimationFrame
    act(() => {
      jest.runAllTimers();
    });

    // Expect the ScanAnimation component to be rendered
    expect(getByTestId('mock-scan-animation')).toBeInTheDocument();
  });

  it('handles invalid demo param gracefully', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'demo') return 'invalid';
        if (key === 'scan') return 'true';
        return null;
      },
    });

    const { queryByTestId } = render(<Home />);
    act(() => jest.runAllTimers());
    expect(queryByTestId('mock-scan-animation')).toBeNull();
  });

  it('handles demo address params correctly and transitions to scan completion', async () => {
    const demoContractAddr = DEMO_CONTRACTS[0].address;
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'demo') return demoContractAddr;
        if (key === 'scan') return 'true';
        return null;
      },
    });

    const { getByTestId } = render(<Home />);
    act(() => jest.runAllTimers());

    const completeBtn = getByTestId('complete-scan');
    fireEvent.click(completeBtn);

    const expectedChain = DEMO_CONTRACTS[0].chainId;
    expect(mockRouterPush).toHaveBeenCalledWith(`/audit/${expectedChain}/${encodeURIComponent(demoContractAddr)}`);
  });

  it('submits form from SearchBar and navigates after scan', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(<Home />);
    
    const input = getByPlaceholderText(/Paste any contract/i);
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } });
    
    const submitBtn = getByRole('button', { name: /scan/i });
    fireEvent.click(submitBtn);

    expect(getByTestId('mock-scan-animation')).toBeInTheDocument();

    const completeBtn = getByTestId('complete-scan');
    fireEvent.click(completeBtn);

    expect(mockRouterPush).toHaveBeenCalledWith(`/audit/ethereum/${encodeURIComponent('0x1234567890123456789012345678901234567890')}`);
  });

  it('clicks ExampleChip and scans', () => {
    const { getByText, getByTestId } = render(<Home />);
    
    const chip = getByText(DEMO_CONTRACTS[1].label);
    fireEvent.click(chip);

    expect(getByTestId('mock-scan-animation')).toBeInTheDocument();
  });

  it('opens and closes the ChainGridModal', () => {
    const { getByRole, getByTestId, queryByTestId } = render(<Home />);
    
    // Open modal
    const moreBtn = getByRole('button', { name: /\+42 more/i });
    fireEvent.click(moreBtn);

    expect(getByTestId('mock-chain-modal')).toBeInTheDocument();

    // Click close button in modal
    const closeBtn = getByTestId('close-modal-btn');
    fireEvent.click(closeBtn);
    
    expect(queryByTestId('mock-chain-modal')).toBeNull();
  });
});

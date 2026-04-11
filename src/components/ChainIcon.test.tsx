/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ChainIcon } from './ChainIcon';

jest.mock('@web3icons/react', () => ({
  NetworkEthereum: () => <svg data-testid="ethereum-icon" />,
  // mock other requested icons similarly or use proxy
}));

describe('ChainIcon', () => {
  it('renders a known icon component', () => {
    const { container } = render(<ChainIcon name="Ethereum" className="w-6 h-6" />);
    // Should render an SVG from @web3icons/react
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a fallback text for unknown chain', () => {
    const { getByText } = render(<ChainIcon name="Unknown" />);
    expect(getByText('UN')).toBeInTheDocument();
  });

  it('renders fallback if icon exists in the map but returns undefined from the library', () => {
    // Solana is in ICON_MAP but we didn't mock it, so Web3Icons['NetworkSolana'] is undefined
    const { getByText } = render(<ChainIcon name="Solana" />);
    expect(getByText('SO')).toBeInTheDocument();
  });
});

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
});

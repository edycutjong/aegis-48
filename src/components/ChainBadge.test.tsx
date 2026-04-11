/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ChainBadge } from './ChainBadge';

describe('ChainBadge', () => {
  it('renders with iconUrl', () => {
    const { getByText, getByAltText } = render(
      <ChainBadge name="Ethereum" iconUrl="/eth.svg" chainType="evm" />
    );
    expect(getByText('Ethereum')).toBeInTheDocument();
    expect(getByText('evm')).toBeInTheDocument();
    expect(getByAltText('Ethereum')).toBeInTheDocument();
  });

  it('renders without iconUrl', () => {
    const { getByText, queryByRole } = render(
      <ChainBadge name="Unknown" iconUrl="" chainType="svm" />
    );
    expect(getByText('🔗')).toBeInTheDocument();
    expect(queryByRole('img')).toBeNull();
  });
});

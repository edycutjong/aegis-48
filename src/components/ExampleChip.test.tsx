/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ExampleChip } from './ExampleChip';

describe('ExampleChip', () => {
  it('renders and responds to click', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ExampleChip
        label="Test Chip"
        address="0x123"
        chainId="ethereum"
        status="safe"
        onClick={onClick}
      />
    );

    const button = getByText('Test Chip');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith('0x123', 'ethereum');
  });

  it('renders correctly with safe status', () => {
    const { getByText } = render(
      <ExampleChip
        label="Test Safe Chip"
        address="0x123"
        chainId="ethereum"
        status="safe"
        onClick={jest.fn()}
      />
    );
    expect(getByText('Test Safe Chip')).toBeInTheDocument();
  });

  it('renders correctly with vuln status', () => {
    const { getByText } = render(
      <ExampleChip
        label="Test Vuln Chip"
        address="0x123"
        chainId="ethereum"
        status="vuln"
        onClick={jest.fn()}
      />
    );
    expect(getByText('Test Vuln Chip')).toBeInTheDocument();
  });
});

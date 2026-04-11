/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ChainGridModal } from './ChainGridModal';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
  Layers: () => <div data-testid="layers-icon" />,
}));

describe('ChainGridModal', () => {
  it('renders modal content', () => {
    const onClose = jest.fn();
    const { getByText, getAllByText } = render(
      <ChainGridModal isOpen={true} onClose={onClose} />
    );

    expect(getByText('48')).toBeInTheDocument();
    expect(getByText(/Supported Networks/)).toBeInTheDocument();
    expect(getAllByText(/EVM/i).length).toBeGreaterThan(0);
    expect(getAllByText(/SVM/i).length).toBeGreaterThan(0);
  });

  it('does not render if not open', () => {
    const { queryByText } = render(
      <ChainGridModal isOpen={false} onClose={jest.fn()} />
    );

    expect(queryByText('Supported Chains')).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <ChainGridModal isOpen={true} onClose={onClose} />
    );

    const closeButton = getByTestId('x-icon').parentElement;
    fireEvent.click(closeButton!);
    expect(onClose).toHaveBeenCalled();
  });
});

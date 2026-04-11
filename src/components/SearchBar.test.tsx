/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('allows typing and submission for valid address', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <SearchBar onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText(/Paste any contract/i);
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } });

    const submitButton = getByRole('button', { name: /scan/i });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890', 'ethereum');
  });

  it('shows error for invalid short address', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByRole, getByText } = render(
      <SearchBar onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText(/Paste any contract/i);
    fireEvent.change(input, { target: { value: '0x123' } });

    const submitButton = getByRole('button', { name: /scan/i });
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(getByText(/Please enter a valid/i)).toBeInTheDocument();

    // typing again clears error
    fireEvent.change(input, { target: { value: '0x1234' } });
    expect(() => getByText(/Please enter a valid/i)).toThrow();
  });

  it('can change selected chain', () => {
    const onSubmit = jest.fn();
    const { getByText, getAllByText, getByPlaceholderText, getByRole } = render(<SearchBar onSubmit={onSubmit} />);

    // Default chain is Ethereum
    let ethTextElements = getAllByText('Ethereum');
    expect(ethTextElements.length).toBeGreaterThan(0);

    // Open dropdown
    const chainSelectButton = ethTextElements[0].closest('button');
    fireEvent.click(chainSelectButton!);

    // Select Solana
    const solanaOption = getByText('Solana').closest('button');
    fireEvent.click(solanaOption!);

    // Submit with solana
    const input = getByPlaceholderText(/Paste any contract/i, { exact: false });
    fireEvent.change(input, { target: { value: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' } });

    const submitButton = getByRole('button', { name: /scan/i });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS', 'solana');
  });

  it('handles focus and blur states without crashing', () => {
    const { getByPlaceholderText } = render(<SearchBar onSubmit={() => {}} />);
    const input = getByPlaceholderText(/Paste any contract/i);
    fireEvent.focus(input);
    fireEvent.blur(input);
  });
});

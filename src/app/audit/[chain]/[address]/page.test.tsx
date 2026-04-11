/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import AuditReportPage from './page';

// Rely on global mock from jest.setup.ts

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('Audit Report Page', () => {
  it('renders loading state initially', () => {
    const { getByText } = render(<AuditReportPage />);
    expect(getByText('Audit Not Found')).toBeInTheDocument();
  });
});

/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import HistoryPage from './page';

// Mock components
jest.mock('@/components/AuditHistoryTable', () => ({
  AuditHistoryTable: () => <div data-testid="audit-table-mock" />,
}));
jest.mock('@/components/StatsPanel', () => ({
  StatsPanel: () => <div data-testid="stats-panel-mock" />,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ audits: [] }),
  })
) as jest.Mock;

describe('History Page', () => {
  it('renders history page correctly', () => {
    const { getByText } = render(<HistoryPage />);
    expect(getByText('Audit History')).toBeInTheDocument();
  });
});

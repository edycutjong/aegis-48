/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { SeverityBadge } from './SeverityBadge';

describe('SeverityBadge', () => {
  it('renders CRITICAL severity with correct colors', () => {
    const { getByText } = render(<SeverityBadge severity="CRITICAL" />);
    const el = getByText('CRITICAL');
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({ color: '#ff2d55' });
  });

  it('renders SAFE severity with correct label', () => {
    const { getByText } = render(<SeverityBadge severity="SAFE" />);
    expect(getByText('SAFE')).toBeInTheDocument();
  });
});

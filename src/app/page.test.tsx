/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import Home from './page';

// Rely on global mock from jest.setup.ts

describe('Home Page', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Home />);
    expect(getByText(/Aegis-48/i)).toBeInTheDocument();
  });
});

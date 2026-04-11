/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { StatsPanel } from './StatsPanel';

describe('StatsPanel', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders standard values after animation', () => {
    // Mock performance.now to control animation speed manually or rely on standard jest advance
    jest.spyOn(performance, 'now').mockReturnValue(0);

    const { getByText, getAllByText } = render(
      <StatsPanel
        totalAudits={100}
        criticalFindings={10}
        safeContracts={90}
        chainsCovered={5}
      />
    );

    // Initial state is 0 for everything
    expect(getAllByText('0').length).toBeGreaterThan(0);

    // Fast Forward through initial timeouts
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // We also need to advance requestAnimationFrame frames, which jest fakeTimers also handles if properly synced
    // However, since we mock performance.now(), we'll actually need to step through
    act(() => {
      jest.spyOn(performance, 'now').mockReturnValue(2000);
      jest.advanceTimersByTime(100);
    });

    // Check final stat values
    expect(getByText('100')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('90')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });
});

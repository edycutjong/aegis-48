/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { ScanAnimation } from './ScanAnimation';

describe('ScanAnimation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('progresses through all stages and calls onComplete', () => {
    const onComplete = jest.fn();
    const { getByText } = render(
      <ScanAnimation chainName="Ethereum" address="0x12345678901234567890" onComplete={onComplete} />
    );

    expect(getByText('Fetching bytecode...')).toBeInTheDocument();
    
    // Total duration of stages: 600 + 1000 + 3000 + 500 = 5100
    // Then 800ms for onComplete timeout = 5900
    act(() => {
      jest.advanceTimersByTime(5100);
    });

    expect(getByText('Generating report...')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

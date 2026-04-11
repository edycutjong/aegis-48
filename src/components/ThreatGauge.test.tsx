/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { ThreatGauge } from './ThreatGauge';

describe('ThreatGauge', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('animates to the target score', () => {
    jest.spyOn(performance, 'now').mockReturnValue(0);

    const { getByText } = render(
      <ThreatGauge score={85} severity="HIGH" size={120} />
    );

    // Initial state is 0
    expect(getByText('0')).toBeInTheDocument();

    act(() => {
      jest.spyOn(performance, 'now').mockReturnValue(1200);
      jest.advanceTimersByTime(1200);
    });

    // Score reaches 85
    expect(getByText('85')).toBeInTheDocument();
  });
});

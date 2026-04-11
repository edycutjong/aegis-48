/**
 * @jest-environment node
 */
import { GET } from './route';
import { NextResponse } from 'next/server';
import { getDemoHistory } from '@/data/demo-contracts';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => data),
  },
}));

describe('GET /api/history', () => {
  it('returns the mocked history data', async () => {
    const response = await GET();
    const audits = getDemoHistory();
    expect(NextResponse.json).toHaveBeenCalledWith({ audits });
    expect(response).toEqual({ audits });
  });
});

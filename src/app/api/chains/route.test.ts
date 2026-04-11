/**
 * @jest-environment node
 */
import { GET } from './route';
import { NextResponse } from 'next/server';
import { CHAINS } from '@/lib/constants';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => data),
  },
}));

describe('GET /api/chains', () => {
  it('returns the mocked CHAINS data', async () => {
    const response = await GET();
    expect(NextResponse.json).toHaveBeenCalledWith({ chains: CHAINS });
    expect(response).toEqual({ chains: CHAINS });
  });
});

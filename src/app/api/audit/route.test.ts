import { POST } from './route';
import { analyzeContract } from '@/lib/analyzer';

// Mock the analyzer
jest.mock('@/lib/analyzer', () => ({
  analyzeContract: jest.fn(),
}));

describe('POST /api/audit', () => {
  it('returns 400 if address is missing', async () => {
    const req = new Request('http://localhost:3000/api/audit', {
      method: 'POST',
      body: JSON.stringify({ chainId: 'ethereum' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing address or chainId');
  });

  it('returns 400 if chainId is missing', async () => {
    const req = new Request('http://localhost:3000/api/audit', {
      method: 'POST',
      body: JSON.stringify({ address: '0x123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 200 with audit report on success', async () => {
    (analyzeContract as jest.Mock).mockResolvedValue({ id: 'test-report-id' });

    const req = new Request('http://localhost:3000/api/audit', {
      method: 'POST',
      body: JSON.stringify({ address: '0x123', chainId: 'ethereum' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.audit.id).toBe('test-report-id');
  });

  it('returns 500 if analyzer throws an error', async () => {
    // Silence console.error for this expected throw
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (analyzeContract as jest.Mock).mockRejectedValue(new Error('Analyzer Boom'));

    const req = new Request('http://localhost:3000/api/audit', {
      method: 'POST',
      body: JSON.stringify({ address: '0x123', chainId: 'ethereum' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Analysis failed');

    consoleSpy.mockRestore();
  });
});

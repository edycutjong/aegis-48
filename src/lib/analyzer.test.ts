import { analyzeContract, getViemChain } from './analyzer';
import { DEMO_CONTRACTS } from '@/data/demo-contracts';

// Mock dependencies
jest.mock('viem', () => ({
  createPublicClient: jest.fn(),
  http: jest.fn(),
}));

export const mockParse = jest.fn();

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    beta: {
      chat: {
        completions: {
          parse: (...args: any[]) => mockParse(...args),
        },
      },
    },
  }));
});

import { createPublicClient } from 'viem';
import OpenAI from 'openai';

  describe('analyzeContract', () => {
    let mockGetBytecode: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();

      mockGetBytecode = jest.fn();
      (createPublicClient as jest.Mock).mockReturnValue({
        getBytecode: mockGetBytecode,
      });
    });

  it('returns demo contract instantly if address matches', async () => {
    const demo = DEMO_CONTRACTS[0];
    const result = await analyzeContract(demo.address, 'ethereum');
    expect(result.id).toBe(demo.report.id);
    expect(createPublicClient).not.toHaveBeenCalled();
  });

  it('falls back to mock report for non-EVM chains', async () => {
    // Solana isn't EVM
    const result = await analyzeContract('some-random-solana-addr', 'solana');
    expect(result.chainType).toBe('svm');
    expect(createPublicClient).not.toHaveBeenCalled();
    expect(result.sourceCode).toContain('Bytecode analysis');
  });

  it('performs real analysis via Viem and OpenAI for EVM chains', async () => {
    mockGetBytecode.mockResolvedValue('0x123456');

    mockParse.mockResolvedValue({
      choices: [
        {
          message: {
            parsed: {
              severity: 'CRITICAL',
              threatScore: 90,
              summary: 'Bad contract',
              vulnerabilities: [],
            },
          },
        },
      ],
    });

    const result = await analyzeContract('0xNewEvmAddress', 'ethereum');

    expect(createPublicClient).toHaveBeenCalled();
    expect(mockGetBytecode).toHaveBeenCalledWith({ address: '0xNewEvmAddress' });
    expect(mockParse).toHaveBeenCalled();
    
    expect(result.severity).toBe('CRITICAL');
    expect(result.threatScore).toBe(90);
    expect(result.summary).toBe('Bad contract');
    expect(result.sourceCode).toContain('0x123456');
  });

  it('falls back to mock report if viem throws an error (e.g., no bytecode)', async () => {
    mockGetBytecode.mockResolvedValue('0x'); // Empty bytecode triggers throw

    const result = await analyzeContract('0xEmptyEvmAddress', 'base');

    expect(createPublicClient).toHaveBeenCalled();
    expect(mockParse).not.toHaveBeenCalled();
    expect(result.chainType).toBe('evm');
    // Result should look like the deterministic mock
    expect(result.sourceCode).toContain('Full decompilation not available');
  });

  it('falls back to mock report if openai fails to parse', async () => {
    mockGetBytecode.mockResolvedValue('0x123456');
    
    // Simulate OpenAI returning empty parsed data
    mockParse.mockResolvedValue({
      choices: [
        {
          message: { parsed: null },
        },
      ],
    });

    const result = await analyzeContract('0xFailAddress', 'polygon');

    expect(mockParse).toHaveBeenCalled();
    expect(result.sourceCode).toContain('Full decompilation not available');
  });

  it('falls back to default chain if chainId is unknown', async () => {
    mockGetBytecode.mockResolvedValue('0x'); // Trigger fallback
    const result = await analyzeContract('0xFallBack', 'unknown-chain');
    expect(result.chainId).toBe('ethereum'); // CHAINS[0]
  });

  it('handles MOVE chains correctly', async () => {
    const result = await analyzeContract('0xMoveAddr', 'aptos');
    expect(result.chainType).toBe('move');
    expect(result.language).toBe('move');
  });

  it('handles SAFE fallback generation', async () => {
    // Find an address where simpleHash % 3 === 0
    let safeAddr = '';
    for (let i = 0; i < 1000; i++) {
       if (simpleHash(String(i)) % 3 === 0) {
         safeAddr = String(i);
         break;
       }
    }
    const result = await analyzeContract(safeAddr, 'aptos');
    expect(result.severity).toBe('SAFE');
    expect(result.vulnerabilities.length).toBe(0);
  });

  it('handles CRITICAL fallback generation', async () => {
    // Find an address where simpleHash % 3 !== 0 && simpleHash % 5 === 0
    let critAddr = '';
    for (let i = 0; i < 1000; i++) {
       const h = simpleHash(String(i));
       if (h % 3 !== 0 && h % 5 === 0) {
         critAddr = String(i);
         break;
       }
    }
    const result = await analyzeContract(critAddr, 'solana');
    expect(result.severity).toBe('CRITICAL');
  });
});

describe('Environment Fallbacks', () => {
  it('uses dummy keys when env is missing', async () => {
    const originalOpenAi = process.env.OPENAI_API_KEY;
    const originalAlchemy = process.env.ALCHEMY_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ALCHEMY_API_KEY;

    jest.resetModules();
    
    // Re-import after deleting env
    const { analyzeContract } = require('./analyzer');
    const { createPublicClient } = require('viem');
    
    const mockGetBytecode = jest.fn().mockResolvedValue('0x'); // trigger throw
    createPublicClient.mockReturnValue({ getBytecode: mockGetBytecode });

    await analyzeContract('0xEnvFallbacks', 'ethereum');
    
    expect(createPublicClient).toHaveBeenCalled();

    // Restore env
    process.env.OPENAI_API_KEY = originalOpenAi;
    process.env.ALCHEMY_API_KEY = originalAlchemy;
  });
});

import { simpleHash } from './analyzer';

describe('getViemChain', () => {
  it('maps correct chains', () => {
    expect(getViemChain('ethereum').name).toBe('Ethereum');
    expect(getViemChain('base').name).toBe('Base');
    expect(getViemChain('arbitrum').name).toBe('Arbitrum One');
    expect(getViemChain('polygon').name).toBe('Polygon');
    expect(getViemChain('unknown').name).toBe('Ethereum');
  });
});

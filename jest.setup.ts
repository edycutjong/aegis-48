// Mock environment variables for tests
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ALCHEMY_API_KEY = 'test-alchemy-key';

import '@testing-library/jest-dom';

// Global mocks
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  useParams() {
    return {
      chain: 'ethereum',
      address: '0x123',
    };
  },
}));

// Provide basic matchMedia if window exists
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock globals for Node environment (often stripped by Jest)
if (typeof Request === 'undefined') {
  // @ts-ignore
  global.Request = class Request {};
}
if (typeof Response === 'undefined') {
  // @ts-ignore
  global.Response = class Response {};
}
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

// Mock @web3icons/react globally
jest.mock('@web3icons/react', () => ({
  NetworkEthereum: () => null,
  NetworkAptos: () => null,
  NetworkOptimism: () => null,
  NetworkAvalanche: () => null,
  NetworkFantom: () => null,
  TokenCRO: () => null,
  NetworkBinanceSmartChain: () => null,
  NetworkPolygon: () => null,
  NetworkArbitrum: () => null,
  NetworkSolana: () => null,
}), { virtual: true });

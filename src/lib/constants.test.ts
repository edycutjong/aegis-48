import { getChain, getChainsByType, CHAINS } from './constants';

describe('constants', () => {
  describe('getChain', () => {
    it('returns the correct chain by id', () => {
      const chain = getChain('ethereum');
      expect(chain).toBeDefined();
      expect(chain?.name).toBe('Ethereum');
    });

    it('returns undefined for unknown chain', () => {
      expect(getChain('unknown-chain')).toBeUndefined();
    });
  });

  describe('getChainsByType', () => {
    it('returns chains of a specific type', () => {
      const evmChains = getChainsByType('evm');
      expect(evmChains.length).toBeGreaterThan(0);
      expect(evmChains.every(c => c.chainType === 'evm')).toBe(true);
    });

    it('returns empty array for unknown type', () => {
      // @ts-ignore for testing invalid type
      expect(getChainsByType('unknown-type')).toEqual([]);
    });
  });
});

import { getDemoContract, getDemoHistory, DEMO_CONTRACTS } from './demo-contracts';

describe('demo-contracts', () => {
  describe('getDemoContract', () => {
    it('returns the correct demo contract by address', () => {
      const contract = getDemoContract('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e');
      expect(contract).toBeDefined();
      expect(contract?.status).toBe('vuln');
    });

    it('is case-insensitive', () => {
      const contract = getDemoContract('0X742D35CC6634C0532925A3B844BC9E7595F2BD1E');
      expect(contract).toBeDefined();
    });

    it('returns undefined for unknown address', () => {
      expect(getDemoContract('0xunknown')).toBeUndefined();
    });
  });

  describe('getDemoHistory', () => {
    it('returns all reports', () => {
      const history = getDemoHistory();
      expect(history).toHaveLength(DEMO_CONTRACTS.length);
      expect(history[0]).toEqual(DEMO_CONTRACTS[0].report);
    });
  });
});

import { cn, v4Style, truncateAddress, formatDuration, formatRelativeTime } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
      expect(cn('px-2 py-1', { 'opacity-50': true })).toBe('px-2 py-1 opacity-50');
    });
  });

  describe('v4Style', () => {
    it('generates a consistent mock UUID based on seed', () => {
      expect(v4Style(1)).toBe('9e3779b1-9e37-4e37-ae37-9e3779b10000');
      expect(v4Style(2)).toBe('13c6ef36-13c6-43c6-a3c6-13c6ef362000');
    });
  });

  describe('truncateAddress', () => {
    it('truncates a long address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(truncateAddress(address)).toBe('0x123456...567890');
    });

    it('returns the same string if short', () => {
      expect(truncateAddress('0x123', 6)).toBe('0x123');
    });
  });

  describe('formatDuration', () => {
    it('formats ms < 1000', () => {
      expect(formatDuration(500)).toBe('500ms');
    });

    it('formats ms >= 1000', () => {
      expect(formatDuration(1500)).toBe('1.5s');
      expect(formatDuration(2000)).toBe('2.0s');
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-02T12:00:00.000Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns Just now for < 1 min', () => {
      expect(formatRelativeTime('2024-01-02T11:59:30.000Z')).toBe('Just now');
    });

    it('returns minutes ago', () => {
      expect(formatRelativeTime('2024-01-02T11:55:00.000Z')).toBe('5m ago');
    });

    it('returns hours ago', () => {
      expect(formatRelativeTime('2024-01-02T10:00:00.000Z')).toBe('2h ago');
    });

    it('returns days ago', () => {
      expect(formatRelativeTime('2024-01-01T12:00:00.000Z')).toBe('1d ago');
    });
  });
});

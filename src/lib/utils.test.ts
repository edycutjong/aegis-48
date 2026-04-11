import { cn, v4Style, truncateAddress, formatDuration, formatRelativeTime } from './utils';

describe('utils', () => {
  it('cn', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('v4Style', () => {
    expect(v4Style(1)).toBeDefined();
  });

  it('truncateAddress', () => {
    expect(truncateAddress('0x1234567890123456789012345678901234567890')).toBe('0x123456...567890');
    expect(truncateAddress('0x123', 6)).toBe('0x123');
  });

  it('formatDuration', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(1500)).toBe('1.5s');
  });

  it('formatRelativeTime', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-02T00:00:00Z'));
    
    expect(formatRelativeTime('2023-01-01T23:59:30Z')).toBe('Just now');
    expect(formatRelativeTime('2023-01-01T23:50:00Z')).toBe('10m ago');
    expect(formatRelativeTime('2023-01-01T22:00:00Z')).toBe('2h ago');
    expect(formatRelativeTime('2022-12-30T00:00:00Z')).toBe('3d ago');
    
    jest.useRealTimers();
  });
});

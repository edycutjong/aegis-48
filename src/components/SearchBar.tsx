'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Shield, ChevronDown } from 'lucide-react';
import { CHAINS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSubmit: (address: string, chainId: string) => void;
  isLoading?: boolean;
  initialAddress?: string;
  initialChainId?: string;
}

export function SearchBar({ onSubmit, isLoading, initialAddress = '', initialChainId = 'ethereum' }: SearchBarProps) {
  const [address, setAddress] = useState(initialAddress);
  const [chainId, setChainId] = useState(initialChainId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialAddress) setAddress(initialAddress);
    if (initialChainId) setChainId(initialChainId);
  }, [initialAddress, initialChainId]);

  const selectedChain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || isLoading) return;

    // Basic heuristic validation for EVM (0x + 40 chars), SVM (Base58 ~32-44 chars), Move (0x + 64 chars)
    // Blocks completely malformed inputs gracefully.
    const trimmed = address.trim();
    if (trimmed.length < 32 || trimmed.length > 66 || trimmed.includes(' ')) {
      setError('Please enter a valid wallet or contract address.');
      return;
    }
    
    setError('');
    onSubmit(trimmed, chainId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[680px] mx-auto">
      <div
        className={cn(
          'relative flex items-center rounded-2xl transition-all duration-300',
          'glass border border-border',
          isFocused && 'border-primary/50 glow-primary',
          isLoading && 'opacity-80 pointer-events-none'
        )}
      >
        {/* Chain Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={cn(
              'flex items-center gap-2 px-4 py-4 rounded-l-2xl',
              'text-text-secondary hover:text-text-primary transition-colors',
              'border-r border-border/50 min-w-[140px]'
            )}
          >
            {selectedChain.iconUrl ? <img src={selectedChain.iconUrl} alt={selectedChain.name} className="w-5 h-5 pointer-events-none rounded-full" /> : <span className="text-lg">🔗</span>}
            <span className="text-sm font-medium">{selectedChain.name}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto" />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-52 glass-elevated rounded-xl overflow-hidden z-50 shadow-2xl">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => {
                    setChainId(chain.id);
                    setShowDropdown(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 text-left',
                    'hover:bg-surface-elevated transition-colors text-sm',
                    chain.id === chainId && 'bg-primary/10 text-primary'
                  )}
                >
                  {chain.iconUrl ? <img src={chain.iconUrl} alt={chain.name} className="w-5 h-5 pointer-events-none rounded-full" /> : <span className="text-lg">🔗</span>}
                  <div>
                    <div className="font-medium text-text-primary">{chain.name}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">
                      {chain.chainType}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Address Input */}
        <input
          suppressHydrationWarning
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (error) setError('');
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste any contract address..."
          className={cn(
            'flex-1 bg-transparent px-4 py-4 text-sm font-mono',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none'
          )}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!address.trim() || isLoading}
          className={cn(
            'flex items-center gap-2 px-5 py-3 mr-1.5 rounded-xl',
            'bg-primary hover:bg-primary-glow text-white font-semibold text-sm',
            'transition-all duration-200',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            !isLoading && address.trim() && 'glow-primary'
          )}
        >
          {isLoading ? (
            <Shield className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Scan</span>
        </button>
      </div>

      {/* Glow Line */}
      <div className={cn('glow-line mt-1 rounded-full transition-opacity', isFocused ? 'opacity-100' : 'opacity-40')} />
      
      {/* Error Message */}
      {error && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center text-xs text-red-400 font-medium tracking-wide">
          {error}
        </div>
      )}
    </form>
  );
}

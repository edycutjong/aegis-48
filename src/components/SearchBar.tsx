'use client';

import { useState, useRef } from 'react';
import { Search, Shield, ChevronDown } from 'lucide-react';
import { CHAINS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSubmit: (address: string, chainId: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSubmit, isLoading }: SearchBarProps) {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('ethereum');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedChain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || isLoading) return;
    onSubmit(address.trim(), chainId);
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
            <span className="text-lg">{selectedChain.iconEmoji}</span>
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
                  <span className="text-lg">{chain.iconEmoji}</span>
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
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
    </form>
  );
}

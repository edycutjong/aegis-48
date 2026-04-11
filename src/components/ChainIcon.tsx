import React from 'react';
import * as Web3Icons from '@web3icons/react';

// Maps chain names to the exported name in @web3icons/react
const ICON_MAP: Record<string, string> = {
  'Ethereum': 'NetworkEthereum',
  'Arbitrum': 'NetworkArbitrumOne',
  'Polygon': 'NetworkPolygon',
  'Base': 'NetworkBase',
  'Solana': 'NetworkSolana',
  'Aptos': 'NetworkAptos',
  'Optimism': 'NetworkOptimism',
  'Avalanche': 'NetworkAvalanche',
  'Fantom': 'NetworkFantom',
  'Cronos': 'TokenCRO',
  'BSC': 'NetworkBinanceSmartChain',
  'Celestia': 'TokenTIA',
  'Sui': 'NetworkSui',
  'Sei': 'TokenSEI',
  'Tron': 'NetworkTron',
  'Near': 'NetworkNearProtocol',
  'Cosmos': 'NetworkCosmos',
  'Polkadot': 'NetworkPolkadot',
  'Kava': 'NetworkKava',
  'Canto': 'TokenCANTO',
  'Scroll': 'NetworkScroll',
  'zkSync': 'NetworkZksync',
  'Starknet': 'NetworkStarknet',
  'Linear': 'TokenLINA',
  'Mantle': 'NetworkMantle',
  'Linea': 'NetworkLinea',
  'Acala': 'NetworkAcala',
  'Moonbeam': 'NetworkMoonbeam',
  'Gnosis': 'NetworkGnosis',
  'Evmos': 'TokenEVMOS',
  'Klaytn': 'TokenKLAY',
  'ImmutableX': 'NetworkImmutable',
  'Ronin': 'NetworkRonin',
  'Oasis': 'TokenROSE',
  'Aurora': 'NetworkAurora',
  'Harmony': 'NetworkHarmony',
  'Metis': 'TokenMETIS',
  'Boba': 'NetworkBoba',
  'Astar': 'NetworkAstar',
  'Blast': 'NetworkBlast',
  'Zora': 'NetworkZora',
  'Viction': 'NetworkViction',
  'Core': 'TokenCORE',
  'Osmosis': 'NetworkOsmosis',
  'Injective': 'NetworkInjective',
  'Ton': 'NetworkTon',
  'Aptos Testnet': 'NetworkAptos',
  'Solana Devnet': 'NetworkSolana'
};

export function ChainIcon({ name, className }: { name: string; className?: string }) {
  const componentName = ICON_MAP[name];
  
  // @ts-ignore - dynamic index lookup into module
  const IconComponent = componentName ? Web3Icons[componentName] : null;

  if (IconComponent) {
    // The "background" variant wraps every raw logo in a perfectly circular, 
    // unified badge (similar to Uniswap or RainbowKit)!
    return <IconComponent variant="background" className={className} />;
  }

  // Fallback to text initials if icon isn't found
  return (
    <div className={`flex items-center justify-center bg-white/10 rounded-full font-bold text-white/50 text-[10px] ${className}`}>
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

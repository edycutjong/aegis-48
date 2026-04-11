'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ExampleChip } from '@/components/ExampleChip';
import { ChainGridModal } from '@/components/ChainGridModal';
import { ScanAnimation } from '@/components/ScanAnimation';
import { ChainIcon } from '@/components/ChainIcon';
import { DEMO_CONTRACTS, getDemoContract } from '@/data/demo-contracts';
import { CHAINS, MOCK_STATS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type AppState = 'idle' | 'scanning';

// Animation variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg flex-col gap-4">
        <Shield className="w-12 h-12 text-primary/30 animate-pulse" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<AppState>('idle');
  const [scanAddress, setScanAddress] = useState('');
  const [scanChainId, setScanChainId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const demoParam = searchParams.get('demo');
  const scanParam = searchParams.get('scan') === 'true';

  const demoContract = (() => {
    if (!demoParam) return null;
    const byAddress = getDemoContract(demoParam);
    if (byAddress) return byAddress;
    const index = parseInt(demoParam, 10);
    if (!isNaN(index) && DEMO_CONTRACTS[index]) return DEMO_CONTRACTS[index];
    return null;
  })();

  const handleSubmit = useCallback(
    (address: string, chainId: string) => {
      setScanAddress(address);
      setScanChainId(chainId);

      // For demo contracts, check if we need to resolve chainId
      const demo = getDemoContract(address);
      const resolvedChainId = demo ? demo.chainId : chainId;
      setScanChainId(resolvedChainId);
      setState('scanning');
    },
    []
  );

  useEffect(() => {
    if (demoContract && scanParam && state === 'idle') {
      handleSubmit(demoContract.address, demoContract.chainId);
    }
  }, [demoContract, scanParam, state, handleSubmit]);

  const handleScanComplete = useCallback(() => {
    const demo = getDemoContract(scanAddress);
    const chainId = demo ? demo.chainId : scanChainId;
    router.push(`/audit/${chainId}/${encodeURIComponent(scanAddress)}`);
  }, [scanAddress, scanChainId, router]);

  const chainName =
    CHAINS.find((c) => c.id === scanChainId)?.name || 'Unknown';

  return (
    <AnimatePresence mode="wait">
      {state === 'scanning' ? (
        <motion.main
          key="scanning"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen flex items-center justify-center p-6 relative w-full"
        >
          <ScanAnimation
            chainName={chainName}
            address={scanAddress}
            onComplete={handleScanComplete}
          />
        </motion.main>
      ) : (
        <motion.main
          key="idle"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
          variants={containerVariants}
          className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        >
          {/* Background gradient with pulsing breathing effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
          </motion.div>

          <div className="relative z-10 w-full max-w-3xl mx-auto space-y-8 text-center">
            {/* Shield Logo with floating effect */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className={cn(
                  'relative w-24 h-24 rounded-3xl flex items-center justify-center',
                  'bg-surface/50 border border-primary/30 backdrop-blur-xl',
                  'shadow-[0_0_40px_-10px_rgba(124,92,252,0.4)]'
                )}
              >
                <div className="absolute inset-0 border border-primary/20 rounded-3xl animate-ping opacity-20" />
                <Shield className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(124,92,252,0.8)]" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                AEGIS-48
              </h1>
              <p className="text-lg text-primary font-mono tracking-widest uppercase">
                Cross-Chain Security Oracle
              </p>
              <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                Paste any contract address from any blockchain. Get an instant
                AI-powered security audit with vulnerability line references.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="relative z-20">
              <SearchBar 
                onSubmit={handleSubmit} 
                initialAddress={demoContract?.address} 
                initialChainId={demoContract?.chainId} 
              />
            </motion.div>

            {/* Example Chips */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
              {DEMO_CONTRACTS.map((demo) => (
                <ExampleChip
                  key={demo.address}
                  emoji={demo.emoji}
                  label={demo.label}
                  address={demo.address}
                  chainId={demo.chainId}
                  onClick={handleSubmit}
                />
              ))}
            </motion.div>

            {/* Chain Support Icons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-4">
              {CHAINS.slice(0, 6).map((chain) => (
                <motion.div
                  key={chain.id}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors cursor-default"
                  title={chain.name}
                >
                  <ChainIcon name={chain.name} className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] grayscale group-hover:grayscale-0" />
                </motion.div>
              ))}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-text-muted font-mono tracking-wider hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-primary/10"
              >
                +42 more
              </button>
            </motion.div>

            {/* Floating Counter */}
            <motion.div variants={itemVariants}>
              <CounterStat value={MOCK_STATS.totalAudits} />
            </motion.div>
          </div>
          
          <ChainGridModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.main>
      )}
    </AnimatePresence>
  );
}

function CounterStat({ value }: { value: number }) {
  return (
    <div className="pt-8 flex items-center justify-center">
      <p className="text-xs text-text-muted flex items-center justify-center">
        <span className="font-mono text-primary font-bold drop-shadow-[0_0_8px_rgba(124,92,252,0.5)] text-sm tabular-nums">
          {value.toLocaleString()}
        </span>
        <span className="tracking-widest uppercase opacity-70 ml-1.5">contracts audited</span>
      </p>
    </div>
  );
}

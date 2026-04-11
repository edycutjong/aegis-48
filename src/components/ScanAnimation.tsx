'use client';

import { useEffect, useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any;
    }
  }
}

interface ScanAnimationProps {
  chainName: string;
  address: string;
  onComplete?: () => void;
}

const STAGES = [
  { label: 'Fetching bytecode', duration: 600 },
  { label: 'Decompiling contract', duration: 1000 },
  { label: 'Running AI security analysis', duration: 3000 },
  { label: 'Generating report', duration: 500 },
];

export function ScanAnimation({ chainName, address, onComplete }: ScanAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stagesComplete, setStagesComplete] = useState<boolean[]>(
    new Array(STAGES.length).fill(false)
  );

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    let totalDelay = 0;

    STAGES.forEach((stage, i) => {
      totalDelay += stage.duration;
      const timeout = setTimeout(() => {
        setStagesComplete((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setCurrentStage(i + 1);

        if (i === STAGES.length - 1 && onComplete) {
          const completionTimeout = setTimeout(onComplete, 800); // 800ms to allow final animations
          timeouts.push(completionTimeout);
        }
      }, totalDelay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 w-full max-w-md mx-auto relative z-10">
      {/* Sonar Rings & Shield */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Pulsing Backlight */}
        <motion.div 
          className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Sonar Rings in Framer Motion */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-ai/50 pointer-events-none"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.5
            }}
          />
        ))}

        {/* The Shield Core */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-surface border border-ai flex items-center justify-center shadow-[0_0_30px_rgba(0,200,255,0.5)] overflow-hidden">
          {/* Scanning Beam Inner */}
          <motion.div 
            className="absolute w-full h-1 bg-white/50 shadow-[0_0_10px_#fff]"
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <Shield className="w-10 h-10 text-ai drop-shadow-[0_0_8px_currentColor]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Address & Chain info with fade in */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <p className="font-mono text-lg text-white font-bold tracking-wide break-all drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
          {address.length > 20
            ? `${address.slice(0, 10)}...${address.slice(-8)}`
            : address}
        </p>
        <p className="text-sm text-text-secondary">
          Analyzing contract on <span className="text-ai font-semibold drop-shadow-[0_0_5px_rgba(0,200,255,0.8)]">{chainName}</span>
        </p>
      </motion.div>

      {/* Progress Stages with Staggered layout animations */}
        <div className="space-y-4 w-full">
          {STAGES.map((stage, i) => {
            const isComplete = stagesComplete[i];
            const isCurrent = currentStage === i;
            const isPending = currentStage < i;
            
            return (
              <motion.div
                key={stage.label}
                className={cn(
                  'flex items-center gap-4 text-sm font-medium transition-all duration-300 p-3 rounded-lg border',
                  isComplete
                    ? 'border-safe/30 bg-safe/10 text-safe shadow-[0_0_15px_rgba(0,230,118,0.1)]'
                    : isCurrent
                    ? 'border-ai/50 bg-ai/10 text-ai shadow-[0_0_15px_rgba(0,200,255,0.15)] scale-[1.02]'
                    : 'border-white/5 bg-white/5 text-text-muted/50'
                )}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isComplete ? (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="text-safe flex items-center justify-center"
                    >
                      <Check className="w-5 h-5" />
                    </motion.span>
                  ) : isCurrent ? (
                    <motion.span 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-ai border-t-transparent rounded-full"
                    />
                  ) : (
                    <span className="opacity-30 border border-current rounded-full w-3 h-3 block" />
                  )}
                </div>
                <span className={cn(isComplete ? 'opacity-90' : isCurrent ? 'opacity-100' : 'opacity-50')}>
                  {stage.label}...
                </span>
                
                {/* Right side check icon when complete */}
                {isComplete && (
                   <motion.div 
                     initial={{ width: 0, opacity: 0 }} 
                     animate={{ width: 'auto', opacity: 1 }}
                     className="ml-auto text-xs opacity-70 font-mono tracking-wider overflow-hidden text-safe"
                   >
                     DONE
                   </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPCounterProps {
  xp: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function XPCounter({
  xp,
  showLabel = true,
  size = 'md',
  className,
  animate = false
}: XPCounterProps) {
  const sizes = {
    sm: { icon: 14, text: 'text-sm', padding: 'px-2 py-1' },
    md: { icon: 18, text: 'text-base', padding: 'px-3 py-1.5' },
    lg: { icon: 24, text: 'text-lg', padding: 'px-4 py-2' }
  };

  const { icon, text, padding } = sizes[size];

  return (
    <motion.div
      className={cn(
        "flex items-center gap-1.5 bg-amber-500/10 rounded-full",
        padding,
        className
      )}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      whileHover={{ scale: 1.05 }}
    >
      <Zap
        size={icon}
        className="text-amber-400 fill-amber-400"
      />
      <span className={cn("font-bold text-amber-400", text)}>
        {xp.toLocaleString()}
      </span>
      {showLabel && (
        <span className={cn("text-amber-400/70", text)}>XP</span>
      )}
    </motion.div>
  );
}

// XP kazanım animasyonu için ayrı component
interface XPGainProps {
  amount: number;
  onComplete?: () => void;
}

export function XPGain({ amount, onComplete }: XPGainProps) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -50, opacity: 0, scale: 1.5 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div className="flex items-center gap-2 text-amber-400 font-bold text-3xl">
        <Zap size={32} className="fill-amber-400" />
        <span>+{amount}</span>
      </div>
    </motion.div>
  );
}

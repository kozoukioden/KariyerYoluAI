'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakFlameProps {
  streak: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function StreakFlame({
  streak,
  showLabel = true,
  size = 'md',
  className,
  animate = true
}: StreakFlameProps) {
  const sizes = {
    sm: { icon: 16, text: 'text-sm', padding: 'px-2 py-1' },
    md: { icon: 20, text: 'text-base', padding: 'px-3 py-1.5' },
    lg: { icon: 28, text: 'text-xl', padding: 'px-4 py-2' }
  };

  const { icon, text, padding } = sizes[size];

  // Streak seviyesine göre renk
  const getColor = () => {
    if (streak >= 30) return { bg: 'bg-purple-500/10', text: 'text-purple-400', fill: 'fill-purple-400' };
    if (streak >= 14) return { bg: 'bg-red-500/10', text: 'text-red-400', fill: 'fill-red-400' };
    if (streak >= 7) return { bg: 'bg-orange-500/10', text: 'text-orange-400', fill: 'fill-orange-400' };
    return { bg: 'bg-orange-500/10', text: 'text-orange-300', fill: 'fill-orange-300' };
  };

  const colors = getColor();

  if (streak === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 bg-slate-700/50 rounded-full",
          padding,
          className
        )}
      >
        <Flame size={icon} className="text-slate-500" />
        <span className={cn("font-bold text-slate-500", text)}>0</span>
        {showLabel && <span className={cn("text-slate-600", text)}>gün</span>}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "flex items-center gap-1.5 rounded-full",
        colors.bg,
        padding,
        className
      )}
      initial={animate ? { scale: 0.8 } : false}
      animate={animate ? { scale: 1 } : false}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={animate ? {
          scale: [1, 1.2, 1],
          rotate: [-5, 5, -5]
        } : {}}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut'
        }}
      >
        <Flame
          size={icon}
          className={cn(colors.text, colors.fill)}
        />
      </motion.div>
      <span className={cn("font-bold", colors.text, text)}>
        {streak}
      </span>
      {showLabel && (
        <span className={cn(colors.text, "opacity-70", text)}>
          gün
        </span>
      )}
    </motion.div>
  );
}

// Büyük streak gösterimi (profil sayfası için)
interface StreakDisplayProps {
  streak: number;
  maxStreak?: number;
}

export function StreakDisplay({ streak, maxStreak = 0 }: StreakDisplayProps) {
  const currentMax = Math.max(streak, maxStreak);

  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 text-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [-3, 3, -3]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut'
        }}
        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center"
      >
        <Flame size={40} className="text-white fill-white" />
      </motion.div>

      <div className="text-4xl font-bold text-orange-400 mb-1">
        {streak}
      </div>
      <div className="text-slate-400 text-sm mb-4">
        günlük seri
      </div>

      {currentMax > 0 && (
        <div className="text-xs text-slate-500">
          En yüksek: <span className="text-orange-400 font-bold">{currentMax}</span> gün
        </div>
      )}
    </div>
  );
}

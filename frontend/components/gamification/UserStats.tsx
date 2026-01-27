'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XPCounter } from './XPCounter';
import { StreakFlame } from './StreakFlame';
import { LevelBadge } from './LevelBadge';
import { cn } from '@/lib/utils';

interface UserStatsProps {
  xp: number;
  streak: number;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function UserStats({
  xp,
  streak,
  className,
  layout = 'horizontal',
  size = 'md'
}: UserStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center",
        layout === 'horizontal' ? 'flex-row gap-3' : 'flex-col gap-2',
        className
      )}
    >
      <LevelBadge xp={xp} size={size} showName={false} />
      <XPCounter xp={xp} size={size} />
      <StreakFlame streak={streak} size={size} />
    </motion.div>
  );
}

// Üst bar için kompakt versiyon
interface StatsBarProps {
  xp: number;
  streak: number;
  className?: string;
}

export function StatsBar({ xp, streak, className }: StatsBarProps) {
  return (
    <div className={cn(
      "flex items-center justify-between bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl",
      className
    )}>
      <div className="flex items-center gap-4">
        <LevelBadge xp={xp} size="sm" showName showProgress />
      </div>
      <div className="flex items-center gap-3">
        <XPCounter xp={xp} size="sm" />
        <StreakFlame streak={streak} size="sm" />
      </div>
    </div>
  );
}

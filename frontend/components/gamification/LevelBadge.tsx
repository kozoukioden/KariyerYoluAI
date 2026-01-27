'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, Sparkles, Shield, Zap, Award, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

// Level tanımları
const levels = [
  { level: 1, name: 'Acemi', minXP: 0, maxXP: 100, color: 'slate', icon: Star },
  { level: 2, name: 'Çırak', minXP: 100, maxXP: 300, color: 'green', icon: Shield },
  { level: 3, name: 'Kalfa', minXP: 300, maxXP: 600, color: 'blue', icon: Zap },
  { level: 4, name: 'Uzman', minXP: 600, maxXP: 1000, color: 'purple', icon: Award },
  { level: 5, name: 'Usta', minXP: 1000, maxXP: 1500, color: 'amber', icon: Crown },
  { level: 6, name: 'Guru', minXP: 1500, maxXP: 2500, color: 'rose', icon: Gem },
  { level: 7, name: 'Efsane', minXP: 2500, maxXP: Infinity, color: 'gradient', icon: Sparkles }
];

// XP'den level hesapla
export function getLevelFromXP(xp: number) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return levels[i];
    }
  }
  return levels[0];
}

// Sonraki level'a ilerleme yüzdesi
export function getProgressToNextLevel(xp: number) {
  const currentLevel = getLevelFromXP(xp);
  if (currentLevel.level === 7) return 100;

  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNextLevel = currentLevel.maxXP - currentLevel.minXP;
  return Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
}

interface LevelBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showProgress?: boolean;
  className?: string;
}

const colorClasses: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  slate: { bg: 'bg-slate-600', text: 'text-slate-300', border: 'border-slate-500', ring: 'ring-slate-400/30' },
  green: { bg: 'bg-green-600', text: 'text-green-300', border: 'border-green-500', ring: 'ring-green-400/30' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-300', border: 'border-blue-500', ring: 'ring-blue-400/30' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-300', border: 'border-purple-500', ring: 'ring-purple-400/30' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-300', border: 'border-amber-500', ring: 'ring-amber-400/30' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-300', border: 'border-rose-500', ring: 'ring-rose-400/30' },
  gradient: { bg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600', text: 'text-white', border: 'border-pink-500', ring: 'ring-pink-400/30' }
};

export function LevelBadge({
  xp,
  size = 'md',
  showName = true,
  showProgress = false,
  className
}: LevelBadgeProps) {
  const level = getLevelFromXP(xp);
  const progress = getProgressToNextLevel(xp);
  const colors = colorClasses[level.color];
  const Icon = level.icon;

  const sizes = {
    sm: { badge: 'w-8 h-8', icon: 14, text: 'text-xs', gap: 'gap-1.5' },
    md: { badge: 'w-10 h-10', icon: 18, text: 'text-sm', gap: 'gap-2' },
    lg: { badge: 'w-14 h-14', icon: 24, text: 'text-base', gap: 'gap-3' }
  };

  const { badge, icon, text, gap } = sizes[size];

  return (
    <div className={cn("flex items-center", gap, className)}>
      {/* Badge */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={cn(
          "rounded-full flex items-center justify-center border-2 ring-2",
          badge,
          colors.bg,
          colors.border,
          colors.ring,
          level.color === 'gradient' && 'animate-pulse'
        )}
      >
        <Icon size={icon} className="text-white" />
      </motion.div>

      {/* Name and Progress */}
      {(showName || showProgress) && (
        <div className="flex flex-col">
          {showName && (
            <span className={cn("font-bold", colors.text, text)}>
              {level.name}
            </span>
          )}
          {showProgress && level.level < 7 && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", colors.bg)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-slate-500">{progress}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Büyük level kartı (profil sayfası için)
interface LevelCardProps {
  xp: number;
}

export function LevelCard({ xp }: LevelCardProps) {
  const level = getLevelFromXP(xp);
  const progress = getProgressToNextLevel(xp);
  const nextLevel = levels.find(l => l.level === level.level + 1);
  const colors = colorClasses[level.color];
  const Icon = level.icon;

  const xpForNextLevel = nextLevel ? nextLevel.minXP - xp : 0;

  return (
    <div className={cn(
      "rounded-2xl p-6 border",
      level.color === 'gradient'
        ? 'bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-amber-900/50 border-pink-500/30'
        : `${colors.bg}/10 ${colors.border}/30`
    )}>
      {/* Level Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        className={cn(
          "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-4",
          colors.bg,
          colors.border
        )}
      >
        <Icon size={40} className="text-white" />
      </motion.div>

      {/* Level Info */}
      <div className="text-center mb-6">
        <div className={cn("text-3xl font-bold", colors.text)}>
          Level {level.level}
        </div>
        <div className="text-slate-400">
          {level.name}
        </div>
      </div>

      {/* Progress to Next Level */}
      {level.level < 7 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Sonraki seviye</span>
            <span className={colors.text}>{xpForNextLevel} XP kaldı</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", colors.bg)}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="text-center text-xs text-slate-500">
            {level.minXP} / {level.maxXP} XP
          </div>
        </div>
      )}

      {/* Max Level */}
      {level.level === 7 && (
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-amber-400 font-bold"
          >
            Maksimum seviyeye ulaştın!
          </motion.div>
        </div>
      )}
    </div>
  );
}

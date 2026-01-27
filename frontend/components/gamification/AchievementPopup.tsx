'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Zap,
  Flame,
  Target,
  Crown,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Rozet tanımları
export const achievements = {
  first_step: {
    id: 'first_step',
    name: 'İlk Adım',
    description: 'İlk dersini tamamladın',
    icon: Star,
    color: 'green',
    xp: 10
  },
  quick_learner: {
    id: 'quick_learner',
    name: 'Hızlı Öğrenci',
    description: '5 dersi bir günde tamamladın',
    icon: Zap,
    color: 'blue',
    xp: 25
  },
  perfect_quiz: {
    id: 'perfect_quiz',
    name: 'Kusursuz',
    description: 'Bir quiz\'i %100 doğru tamamladın',
    icon: Target,
    color: 'purple',
    xp: 50
  },
  streak_7: {
    id: 'streak_7',
    name: 'Tutarlı',
    description: '7 gün üst üste çalıştın',
    icon: Flame,
    color: 'orange',
    xp: 30
  },
  streak_30: {
    id: 'streak_30',
    name: 'Bağımlı',
    description: '30 gün üst üste çalıştın',
    icon: Flame,
    color: 'red',
    xp: 100
  },
  track_complete: {
    id: 'track_complete',
    name: 'Uzman',
    description: 'Bir kariyer yolunu tamamladın',
    icon: Trophy,
    color: 'amber',
    xp: 200
  },
  quiz_master: {
    id: 'quiz_master',
    name: 'Quiz Ustası',
    description: '10 quiz\'i geçtin',
    icon: Award,
    color: 'pink',
    xp: 75
  },
  bookworm: {
    id: 'bookworm',
    name: 'Kitap Kurdu',
    description: '50 ders tamamladın',
    icon: BookOpen,
    color: 'cyan',
    xp: 100
  },
  multi_track: {
    id: 'multi_track',
    name: 'Çok Yönlü',
    description: '3 farklı kariyer yolunda ilerleme kaydettın',
    icon: Crown,
    color: 'gradient',
    xp: 150
  },
  early_bird: {
    id: 'early_bird',
    name: 'Erken Kuş',
    description: 'Sabah 6-8 arasında ders tamamladın',
    icon: Sparkles,
    color: 'yellow',
    xp: 15
  }
};

export type AchievementId = keyof typeof achievements;

interface AchievementPopupProps {
  achievementId: AchievementId;
  isOpen: boolean;
  onClose: () => void;
}

const colorClasses: Record<string, { bg: string; text: string; glow: string }> = {
  green: { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500/50' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
  red: { bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-400', glow: 'shadow-pink-500/50' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' },
  gradient: { bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500', text: 'text-pink-400', glow: 'shadow-pink-500/50' }
};

export function AchievementPopup({ achievementId, isOpen, onClose }: AchievementPopupProps) {
  const achievement = achievements[achievementId];
  const colors = colorClasses[achievement.color];
  const Icon = achievement.icon;

  useEffect(() => {
    if (isOpen) {
      // Konfeti efekti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706']
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={cn(
              "absolute inset-0 opacity-20 blur-3xl",
              colors.bg
            )} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {/* Badge Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={cn(
                  "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg",
                  colors.bg,
                  colors.glow
                )}
              >
                <Icon size={48} className="text-white" />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                  Yeni Başarı!
                </div>
                <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>
                  {achievement.name}
                </h2>
                <p className="text-slate-400 mb-6">
                  {achievement.description}
                </p>
              </motion.div>

              {/* XP Reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-6"
              >
                <Zap size={20} className="text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-bold">+{achievement.xp} XP</span>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90",
                  colors.bg
                )}
              >
                Harika!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Küçük rozet gösterimi (liste için)
interface AchievementBadgeProps {
  achievementId: AchievementId;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  achievementId,
  earned = false,
  size = 'md',
  showName = false,
  onClick
}: AchievementBadgeProps) {
  const achievement = achievements[achievementId];
  const colors = colorClasses[achievement.color];
  const Icon = achievement.icon;

  const sizes = {
    sm: { badge: 'w-10 h-10', icon: 20 },
    md: { badge: 'w-14 h-14', icon: 28 },
    lg: { badge: 'w-20 h-20', icon: 40 }
  };

  const { badge, icon } = sizes[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <motion.div
        whileHover={earned ? { scale: 1.1 } : {}}
        className={cn(
          "rounded-full flex items-center justify-center transition-all",
          badge,
          earned
            ? cn(colors.bg, "shadow-lg", colors.glow)
            : "bg-slate-700 opacity-40"
        )}
      >
        <Icon
          size={icon}
          className={earned ? "text-white" : "text-slate-500"}
        />
      </motion.div>
      {showName && (
        <span className={cn(
          "text-xs text-center",
          earned ? colors.text : "text-slate-500"
        )}>
          {achievement.name}
        </span>
      )}
    </div>
  );
}

// Başarılar listesi
interface AchievementsListProps {
  earnedAchievements: AchievementId[];
  onAchievementClick?: (id: AchievementId) => void;
}

export function AchievementsList({ earnedAchievements, onAchievementClick }: AchievementsListProps) {
  const allAchievements = Object.keys(achievements) as AchievementId[];

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
      {allAchievements.map((id) => (
        <AchievementBadge
          key={id}
          achievementId={id}
          earned={earnedAchievements.includes(id)}
          showName
          onClick={() => earnedAchievements.includes(id) && onAchievementClick?.(id)}
        />
      ))}
    </div>
  );
}

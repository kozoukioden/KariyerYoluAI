'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, CheckCircle2, BookOpen, Trophy, Play, Crown, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapNode {
  id: string;
  type: 'lesson' | 'quiz' | 'boss';
  title: string;
  description: string;
  difficulty?: string;
  estimated_time?: string;
  status: 'locked' | 'unlocked' | 'completed' | 'in_progress';
}

interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  nodes: RoadmapNode[];
}

interface RoadmapViewProps {
  units: Unit[];
  onNodeClick: (nodeId: string) => void;
  userProgress?: {
    currentNodeId?: string;
    completedNodes: string[];
    xp: number;
    streak: number;
  };
}

const colorVariants: Record<string, { bg: string; border: string; ring: string; gradient: string }> = {
  blue: { bg: 'bg-blue-500', border: 'border-blue-600', ring: 'ring-blue-400/30', gradient: 'from-blue-500 to-blue-600' },
  yellow: { bg: 'bg-yellow-500', border: 'border-yellow-600', ring: 'ring-yellow-400/30', gradient: 'from-yellow-500 to-yellow-600' },
  cyan: { bg: 'bg-cyan-500', border: 'border-cyan-600', ring: 'ring-cyan-400/30', gradient: 'from-cyan-500 to-cyan-600' },
  green: { bg: 'bg-green-500', border: 'border-green-600', ring: 'ring-green-400/30', gradient: 'from-green-500 to-green-600' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-600', ring: 'ring-purple-400/30', gradient: 'from-purple-500 to-purple-600' },
  red: { bg: 'bg-red-500', border: 'border-red-600', ring: 'ring-red-400/30', gradient: 'from-red-500 to-red-600' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-600', ring: 'ring-orange-400/30', gradient: 'from-orange-500 to-orange-600' },
  pink: { bg: 'bg-pink-500', border: 'border-pink-600', ring: 'ring-pink-400/30', gradient: 'from-pink-500 to-pink-600' },
  gold: { bg: 'bg-amber-500', border: 'border-amber-600', ring: 'ring-amber-400/30', gradient: 'from-amber-500 to-amber-600' },
};

function NodeButton({
  node,
  color,
  onClick,
  index
}: {
  node: RoadmapNode;
  color: string;
  onClick: () => void;
  index: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isInteractive = node.status !== 'locked';
  const colors = colorVariants[color] || colorVariants.blue;

  const isQuiz = node.type === 'quiz';
  const isBoss = node.type === 'boss';
  const isCompleted = node.status === 'completed';
  const isLocked = node.status === 'locked';
  const isCurrent = node.status === 'unlocked' || node.status === 'in_progress';

  const getIcon = () => {
    if (isCompleted) return <CheckCircle2 size={28} className="text-white" />;
    if (isLocked) return <Lock size={24} className="text-slate-500" />;
    if (isBoss) return <Crown size={28} className="text-white fill-white" />;
    if (isQuiz) return <Trophy size={26} className="text-white" />;
    return <Star size={26} className="text-white fill-white" />;
  };

  const nodeSize = isBoss ? 'w-24 h-24' : isQuiz ? 'w-20 h-20' : 'w-18 h-18';

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl min-w-[200px] max-w-[280px]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-white text-sm">{node.title}</h4>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-3">{node.description}</p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                {node.estimated_time && <span>⏱️ {node.estimated_time}</span>}
                {node.difficulty && <span>📊 {node.difficulty}</span>}
              </div>

              {isInteractive && (
                <button
                  onClick={onClick}
                  className={cn(
                    "w-full py-2 rounded-lg font-bold text-sm text-white transition-all",
                    isCompleted
                      ? "bg-slate-600 hover:bg-slate-500"
                      : `bg-gradient-to-r ${colors.gradient} hover:opacity-90`
                  )}
                >
                  {isCompleted ? 'Tekrar Et' : isCurrent ? 'Başla' : 'Devam Et'}
                </button>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Effect for Current Node */}
      {isCurrent && (
        <motion.div
          className={cn("absolute inset-0 rounded-full", colors.bg)}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ filter: 'blur(15px)' }}
        />
      )}

      {/* Main Button */}
      <motion.button
        whileHover={isInteractive ? { scale: 1.1 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        onClick={() => isInteractive && setShowTooltip(!showTooltip)}
        className={cn(
          "relative rounded-full flex items-center justify-center border-b-4 shadow-lg transition-all",
          nodeSize,
          isLocked && "bg-slate-700 border-slate-800 cursor-not-allowed opacity-60",
          isCompleted && "bg-gradient-to-br from-amber-400 to-amber-500 border-amber-600",
          isCurrent && cn("bg-gradient-to-br", colors.gradient, colors.border, "ring-4", colors.ring, "cursor-pointer"),
        )}
        disabled={isLocked}
      >
        {/* Progress ring for current node */}
        {isCurrent && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
          </svg>
        )}

        {getIcon()}

        {/* Crown badge for boss levels */}
        {isBoss && !isLocked && (
          <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-lg">
            <Zap size={14} className="text-amber-900" />
          </div>
        )}
      </motion.button>

      {/* XP indicator for completed */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
        >
          ✓
        </motion.div>
      )}
    </div>
  );
}

export function RoadmapView({ units, onNodeClick, userProgress }: RoadmapViewProps) {
  // Calculate path positions for winding effect
  const getNodePosition = (index: number): number => {
    const pattern = [0, -70, 0, 70]; // center, left, center, right
    return pattern[index % 4];
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-32 px-4">
      {units.map((unit, unitIdx) => {
        const colors = colorVariants[unit.color] || colorVariants.blue;
        const completedInUnit = unit.nodes.filter(n => n.status === 'completed').length;
        const totalInUnit = unit.nodes.length;
        const progress = (completedInUnit / totalInUnit) * 100;

        return (
          <motion.div
            key={unit.id}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.1 }}
          >
            {/* Unit Header */}
            <div className={cn(
              "relative p-5 rounded-2xl text-white mb-10 shadow-xl overflow-hidden",
              "bg-gradient-to-r", colors.gradient
            )}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl">{unit.title}</h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {completedInUnit}/{totalInUnit}
                  </span>
                </div>
                <p className="opacity-90 text-sm mb-3">{unit.description}</p>

                {/* Progress Bar */}
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Nodes Path */}
            <div className="relative flex flex-col items-center">
              {/* SVG Path Connector */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {unit.nodes.slice(0, -1).map((node, idx) => {
                  const currentX = 50 + (getNodePosition(idx) / 70) * 20;
                  const nextX = 50 + (getNodePosition(idx + 1) / 70) * 20;
                  const currentY = idx * 120 + 40;
                  const nextY = (idx + 1) * 120 + 40;
                  const isCompleted = node.status === 'completed';

                  return (
                    <path
                      key={`path-${idx}`}
                      d={`M ${currentX}% ${currentY} Q ${(currentX + nextX) / 2}% ${(currentY + nextY) / 2} ${nextX}% ${nextY}`}
                      fill="none"
                      stroke={isCompleted ? '#fbbf24' : '#334155'}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={isCompleted ? "0" : "8 8"}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {unit.nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="relative z-10 mb-16"
                  style={{ transform: `translateX(${getNodePosition(idx)}px)` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <NodeButton
                    node={node}
                    color={unit.color}
                    onClick={() => onNodeClick(node.id)}
                    index={idx}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* End Trophy */}
      <motion.div
        className="flex flex-col items-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl mb-4">
          <Trophy size={40} className="text-white" />
        </div>
        <p className="text-slate-400 text-center">
          Tüm dersleri tamamla ve<br />
          <span className="text-amber-400 font-bold">sertifikanı kazan!</span>
        </p>
      </motion.div>
    </div>
  );
}

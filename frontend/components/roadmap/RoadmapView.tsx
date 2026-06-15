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
  dependsOn?: string[];
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
  return (
    <div className="w-full max-w-2xl mx-auto pb-32 px-4 relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-[100px]" />
      </div>
      {units.map((unit, unitIdx) => {
        const colors = colorVariants[unit.color] || colorVariants.blue;
        const completedInUnit = unit.nodes.filter(n => n.status === 'completed').length;
        const totalInUnit = unit.nodes.length;
        const progress = (completedInUnit / totalInUnit) * 100;

        // Calculate levels for DAG
        const nodeLevels: Record<string, number> = {};
        unit.nodes.forEach(node => {
          if (!node.dependsOn || node.dependsOn.length === 0) {
            nodeLevels[node.id] = 0;
          } else {
            let maxDepLevel = -1;
            node.dependsOn.forEach(depId => {
              if (nodeLevels[depId] !== undefined) {
                maxDepLevel = Math.max(maxDepLevel, nodeLevels[depId]);
              }
            });
            nodeLevels[node.id] = maxDepLevel === -1 ? 0 : maxDepLevel + 1;
          }
        });

        // Group by level
        const levels: RoadmapNode[][] = [];
        unit.nodes.forEach(node => {
          const l = nodeLevels[node.id] || 0;
          if (!levels[l]) levels[l] = [];
          levels[l].push(node);
        });

        // Calculate explicit X and Y positions
        const LEVEL_HEIGHT = 140;
        const totalLevels = levels.length;
        const nodePositions: Record<string, { x: number, y: number }> = {};
        
        levels.forEach((levelNodes, levelIdx) => {
          const count = levelNodes.length;
          levelNodes.forEach((node, nodeIdx) => {
            const xPos = ((nodeIdx + 1) / (count + 1)) * 100; // Percentage
            const yPos = (levelIdx * LEVEL_HEIGHT) + (LEVEL_HEIGHT / 2); // Pixels
            nodePositions[node.id] = { x: xPos, y: yPos };
          });
        });

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
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl">{unit.title}</h3>
                  </div>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-bold">
                    {completedInUnit}/{totalInUnit}
                  </span>
                </div>
                <p className="opacity-90 text-sm mb-4">{unit.description}</p>

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

            {/* Nodes Path - True DAG Tree */}
            <div className="relative w-full" style={{ height: `${totalLevels * LEVEL_HEIGHT}px`, marginTop: '2rem' }}>
              {/* SVG Path Connector */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {unit.nodes.map((node) => {
                  const deps = node.dependsOn || [];
                  return deps.map(depId => {
                    const start = nodePositions[depId];
                    const end = nodePositions[node.id];
                    if (!start || !end) return null;

                    const isCompleted = node.status === 'completed' || node.status === 'unlocked' || node.status === 'in_progress';
                    // We draw a nice curved bezier path
                    const d = `M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y) / 2}, ${end.x} ${(start.y + end.y) / 2}, ${end.x} ${end.y}`;

                    return (
                      <path
                        key={`path-${depId}-${node.id}`}
                        d={d}
                        fill="none"
                        stroke={isCompleted ? '#10b981' : '#334155'}
                        strokeWidth={isCompleted ? "3" : "2"}
                        strokeLinecap="round"
                        strokeDasharray={isCompleted ? "0" : "4 4"}
                        className={isCompleted ? "animate-pulse" : ""}
                      />
                    );
                  });
                })}
              </svg>

              {/* Nodes */}
              {unit.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                
                return (
                  <motion.div
                    key={node.id}
                    className="absolute z-10"
                    style={{ left: `${pos.x}%`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <NodeButton
                      node={node}
                      color={unit.color}
                      onClick={() => onNodeClick(node.id)}
                      index={0}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            {/* Level Transition Milestone */}
            {unitIdx < units.length - 1 && (
              <div className="flex flex-col items-center justify-center my-12 relative z-10">
                <div className="w-1 bg-slate-700 h-12 mb-4" />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "px-8 py-4 rounded-2xl border-2 flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md",
                    progress === 100 
                      ? "border-green-500 bg-green-500/10 text-green-400" 
                      : "border-slate-700 bg-slate-800/80 text-slate-500"
                  )}
                >
                  <Lock size={24} className={cn("mb-2", progress === 100 ? "hidden" : "block")} />
                  <CheckCircle2 size={24} className={cn("mb-2", progress === 100 ? "block" : "hidden")} />
                  <span className="text-xs uppercase tracking-[0.2em] mb-1 font-bold">KİLİT AÇILDI</span>
                  <span className="text-xl font-black text-white">
                    {unitIdx === 0 ? 'Orta Seviyeye' : 'İleri Seviyeye'} Geçiş
                  </span>
                </motion.div>
                <div className="w-1 bg-slate-700 h-12 mt-4" />
              </div>
            )}
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

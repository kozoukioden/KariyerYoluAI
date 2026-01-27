'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { RoadmapView } from '@/components/roadmap/RoadmapView';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { ChatWidget } from '@/components/chat/ChatWidget';
import {
  UserStats,
  StatsBar,
  XPGain,
  AchievementPopup,
  AchievementId
} from '@/components/gamification';
import { storage, type UserData } from '@/lib/storage';
import tracksData from '@/data/tracks.json';
import quizzesData from '@/data/quizzes.json';
import {
  BookOpen,
  Trophy,
  UserCircle,
  LogOut,
  ChevronLeft,
  Home as HomeIcon,
  Settings,
  Zap,
  Target,
  Award,
  Flame,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

type View = 'onboarding' | 'dashboard' | 'lesson' | 'quiz' | 'profile';

interface LessonData {
  id: string;
  title: string;
  content: string;
  nodeType: 'lesson' | 'quiz' | 'boss';
}

export default function HomePage() {
  const [view, setView] = useState<View>('onboarding');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<{ id: string; questions: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showXPGain, setShowXPGain] = useState<number | null>(null);
  const [showAchievement, setShowAchievement] = useState<AchievementId | null>(null);

  // Load user data on mount
  useEffect(() => {
    const data = storage.load();
    setUserData(data);

    // If user has a recommended track, load it
    if (data.recommendedTrack) {
      const track = (tracksData as any)[data.recommendedTrack];
      if (track) {
        setCurrentTrack({ id: data.recommendedTrack, ...track });
        setView('dashboard');
      }
    }

    setIsLoading(false);
  }, []);

  // Refresh user data
  const refreshUserData = useCallback(() => {
    setUserData(storage.load());
  }, []);

  // Handle onboarding complete
  const handleOnboardingComplete = async (recommendation: { trackId: string; trackTitle: string; confidence: number; reasons: string[] }) => {
    storage.setRecommendedTrack(recommendation.trackId);

    const track = (tracksData as any)[recommendation.trackId];
    if (track) {
      setCurrentTrack({ id: recommendation.trackId, ...track });
      setView('dashboard');
      refreshUserData();
    }
  };

  // Process units with completion status
  const getProcessedUnits = useCallback(() => {
    if (!currentTrack || !userData) return [];

    const completedNodes = userData.progress.completedNodes;
    let lastCompletedInUnit = true;

    return currentTrack.units.map((unit: any) => ({
      ...unit,
      nodes: unit.nodes.map((node: any, idx: number) => {
        const isCompleted = completedNodes.includes(node.id);
        let status: 'locked' | 'unlocked' | 'completed' | 'in_progress' = 'locked';

        if (isCompleted) {
          status = 'completed';
        } else if (lastCompletedInUnit || idx === 0) {
          status = 'unlocked';
          lastCompletedInUnit = false;
        }

        // Check if previous node in this unit was completed
        if (idx > 0) {
          const prevNode = unit.nodes[idx - 1];
          if (!completedNodes.includes(prevNode.id)) {
            status = 'locked';
          }
        }

        return { ...node, status };
      })
    }));
  }, [currentTrack, userData]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!currentTrack) return;

    // Find node
    for (const unit of currentTrack.units) {
      for (const node of unit.nodes) {
        if (node.id === nodeId) {
          if (node.type === 'quiz' || node.type === 'boss') {
            // Load quiz
            const questions = (quizzesData as any)[nodeId];
            if (questions && questions.length > 0) {
              setActiveQuiz({ id: nodeId, questions });
              setView('quiz');
            } else {
              alert('Quiz soruları henüz hazır değil.');
            }
          } else {
            // Load lesson
            setActiveLesson({
              id: node.id,
              title: node.title,
              content: node.content || 'Bu ders içeriği henüz hazır değil.',
              nodeType: node.type
            });
            setView('lesson');
          }
          return;
        }
      }
    }
  };

  // Handle lesson complete
  const handleLessonComplete = () => {
    if (!activeLesson) return;

    const { xpGained, newAchievements } = storage.completeNode(activeLesson.id, false);

    if (xpGained > 0) {
      setShowXPGain(xpGained);
      setTimeout(() => setShowXPGain(null), 1500);
    }

    if (newAchievements.length > 0) {
      setTimeout(() => {
        setShowAchievement(newAchievements[0].id as AchievementId);
      }, 500);
    }

    refreshUserData();
    setActiveLesson(null);
    setView('dashboard');
  };

  // Handle quiz complete
  const handleQuizComplete = (result: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    xpEarned: number;
    passed: boolean;
  }) => {
    if (!activeQuiz) return;

    const score = Math.round((result.correctAnswers / result.totalQuestions) * 100);

    if (result.passed) {
      const isPerfect = result.wrongAnswers === 0;
      const { xpGained, newAchievements } = storage.completeNode(activeQuiz.id, true, score);

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      if (xpGained > 0) {
        setShowXPGain(xpGained);
        setTimeout(() => setShowXPGain(null), 1500);
      }

      if (newAchievements.length > 0) {
        setTimeout(() => {
          setShowAchievement(newAchievements[0].id as AchievementId);
        }, 500);
      }
    } else {
      storage.addQuizAttempt(activeQuiz.id, score, false);
    }

    refreshUserData();
    setActiveQuiz(null);
    setView('dashboard');
  };

  // Handle logout/reset
  const handleReset = () => {
    if (confirm('Tüm ilerlemeniz silinecek. Emin misiniz?')) {
      storage.reset();
      setUserData(storage.load());
      setCurrentTrack(null);
      setView('onboarding');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Onboarding view
  if (view === 'onboarding') {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // Quiz view
  if (view === 'quiz' && activeQuiz) {
    return (
      <QuizRunner
        questions={activeQuiz.questions}
        onComplete={handleQuizComplete}
        onExit={() => {
          setActiveQuiz(null);
          setView('dashboard');
        }}
      />
    );
  }

  // Lesson view
  if (view === 'lesson' && activeLesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveLesson(null);
                setView('dashboard');
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Geri</span>
            </button>

            {userData && (
              <UserStats xp={userData.stats.xp} streak={userData.stats.streak} size="sm" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-6">{activeLesson.title}</h1>

            <div className="prose prose-invert prose-lg max-w-none">
              {activeLesson.content.split('\n\n').map((paragraph, idx) => {
                // Code block detection
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const lang = lines[0].replace('```', '');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <pre key={idx} className="bg-slate-800 p-4 rounded-xl overflow-x-auto my-4">
                      <code className="text-green-300 text-sm">{code}</code>
                    </pre>
                  );
                }

                // Header detection
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-white">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }

                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-white">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }

                // List detection
                if (paragraph.includes('\n- ')) {
                  const items = paragraph.split('\n- ').filter(Boolean);
                  return (
                    <ul key={idx} className="list-disc pl-6 my-4 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-slate-300">{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="text-slate-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Complete button */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <button
                onClick={handleLessonComplete}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Star size={20} />
                Dersi Tamamla (+10 XP)
              </button>
            </div>
          </motion.div>
        </div>

        <ChatWidget currentTrackId={currentTrack?.id} />
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex">
      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXPGain && <XPGain amount={showXPGain} />}
      </AnimatePresence>

      {/* Achievement Popup */}
      {showAchievement && (
        <AchievementPopup
          achievementId={showAchievement}
          isOpen={true}
          onClose={() => setShowAchievement(null)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-72 border-r border-slate-800 flex-col sticky top-0 h-screen bg-slate-900/50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            KariyerYolu AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Yazılım Kariyer Rehberin</p>
        </div>

        {/* Stats */}
        {userData && (
          <div className="p-4 border-b border-slate-800">
            <StatsBar xp={userData.stats.xp} streak={userData.stats.streak} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarBtn
            icon={<HomeIcon size={20} />}
            label="Ana Sayfa"
            active={view === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <SidebarBtn
            icon={<Target size={20} />}
            label="Hedeflerim"
            active={false}
            onClick={() => {}}
            badge={userData?.progress.completedNodes.length}
          />
          <SidebarBtn
            icon={<Award size={20} />}
            label="Rozetler"
            active={false}
            onClick={() => {}}
            badge={userData?.achievements.length}
          />
          <SidebarBtn
            icon={<UserCircle size={20} />}
            label="Profil"
            active={view === 'profile'}
            onClick={() => setView('profile')}
          />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-slate-500 text-sm hover:text-red-400 transition-colors py-2"
          >
            <LogOut size={16} />
            Sıfırla
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              KariyerYolu AI
            </h1>
            {userData && (
              <UserStats xp={userData.stats.xp} streak={userData.stats.streak} size="sm" />
            )}
          </div>
        </div>

        {/* Profile View */}
        {view === 'profile' && userData && (
          <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Profilim</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard
                icon={<Zap className="text-amber-400" />}
                label="Toplam XP"
                value={userData.stats.xp}
                color="amber"
              />
              <StatCard
                icon={<Flame className="text-orange-400" />}
                label="Günlük Seri"
                value={`${userData.stats.streak} gün`}
                color="orange"
              />
              <StatCard
                icon={<BookOpen className="text-blue-400" />}
                label="Tamamlanan Ders"
                value={userData.stats.totalLessonsCompleted}
                color="blue"
              />
              <StatCard
                icon={<Trophy className="text-green-400" />}
                label="Geçilen Quiz"
                value={userData.stats.totalQuizzesPassed}
                color="green"
              />
            </div>

            {/* Achievements */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Rozetlerim ({userData.achievements.length})</h3>
              {userData.achievements.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {userData.achievements.map((a) => (
                    <div key={a.id} className="text-center">
                      <div className="text-3xl mb-1">{a.icon}</div>
                      <div className="text-xs text-slate-400">{a.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Henüz rozet kazanmadın. Ders tamamlayarak rozet kazan!</p>
              )}
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {view === 'dashboard' && currentTrack && (
          <div className="p-4 md:p-8">
            {/* Track Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentTrack.title}</h2>
              <p className="text-slate-400">{currentTrack.description}</p>
            </motion.div>

            {/* Roadmap */}
            <RoadmapView
              units={getProcessedUnits()}
              onNodeClick={handleNodeClick}
              userProgress={{
                currentNodeId: undefined,
                completedNodes: userData?.progress.completedNodes || [],
                xp: userData?.stats.xp || 0,
                streak: userData?.stats.streak || 0
              }}
            />
          </div>
        )}
      </div>

      {/* Chat Widget */}
      <ChatWidget currentTrackId={currentTrack?.id} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 safe-area-bottom">
        <div className="flex items-center justify-around py-3">
          <MobileNavBtn
            icon={<HomeIcon size={24} />}
            label="Ana Sayfa"
            active={view === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <MobileNavBtn
            icon={<Target size={24} />}
            label="Hedefler"
            active={false}
            onClick={() => {}}
          />
          <MobileNavBtn
            icon={<UserCircle size={24} />}
            label="Profil"
            active={view === 'profile'}
            onClick={() => setView('profile')}
          />
        </div>
      </div>
    </div>
  );
}

// Sidebar Button Component
function SidebarBtn({
  icon,
  label,
  active,
  onClick,
  badge
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all relative",
        active
          ? "bg-slate-800 border border-slate-700 text-green-400"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
      )}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// Mobile Navigation Button
function MobileNavBtn({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
        active ? "text-green-400" : "text-slate-500"
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={cn(
      "bg-slate-800 rounded-xl p-4 border",
      `border-${color}-500/20`
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          `bg-${color}-500/20`
        )}>
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

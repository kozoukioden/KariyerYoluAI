// localStorage yönetimi - Kullanıcı ilerlemesi, XP, streak ve gamification

export interface UserProgress {
  completedNodes: string[];
  currentTrackId: string | null;
  quizAttempts: Record<string, { score: number; passed: boolean; attemptedAt: string }[]>;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalLessonsCompleted: number;
  totalQuizzesPassed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserData {
  progress: UserProgress;
  stats: UserStats;
  achievements: Achievement[];
  surveyAnswers: Record<string, string> | null;
  recommendedTrack: string | null;
}

const STORAGE_KEY = 'kariyeryolu_user_data';

// XP ödülleri
export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 25,
  QUIZ_PERFECT: 40,
  UNIT_COMPLETE: 50,
  BOSS_LEVEL: 100,
  STREAK_BONUS: 5, // per day
};

// Level eşikleri
export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, title: 'Acemi' },
  { level: 2, minXP: 100, title: 'Çırak' },
  { level: 3, minXP: 300, title: 'Kalfa' },
  { level: 4, minXP: 600, title: 'Uzman' },
  { level: 5, minXP: 1000, title: 'Usta' },
  { level: 6, minXP: 1500, title: 'Guru' },
  { level: 7, minXP: 2500, title: 'Efsane' },
];

// Başarılar
export const ACHIEVEMENTS_CONFIG = [
  { id: 'first_step', name: 'İlk Adım', description: 'İlk dersini tamamla', icon: '🎯' },
  { id: 'fast_learner', name: 'Hızlı Öğrenci', description: '5 dersi bir günde tamamla', icon: '⚡' },
  { id: 'perfect_quiz', name: 'Kusursuz', description: 'Bir quizi %100 doğru bitir', icon: '💯' },
  { id: 'streak_7', name: 'Tutarlı', description: '7 gün streak yap', icon: '🔥' },
  { id: 'streak_30', name: 'Kararlı', description: '30 gün streak yap', icon: '🏆' },
  { id: 'track_complete', name: 'Uzman', description: 'Bir track\'i tamamen bitir', icon: '🎓' },
  { id: 'quiz_master', name: 'Quiz Ustası', description: '10 quiz geç', icon: '📝' },
  { id: 'night_owl', name: 'Gece Kuşu', description: 'Gece 12\'den sonra ders tamamla', icon: '🦉' },
];

// Varsayılan kullanıcı verisi
const getDefaultUserData = (): UserData => ({
  progress: {
    completedNodes: [],
    currentTrackId: null,
    quizAttempts: {},
  },
  stats: {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    totalLessonsCompleted: 0,
    totalQuizzesPassed: 0,
  },
  achievements: [],
  surveyAnswers: null,
  recommendedTrack: null,
});

// Storage işlemleri
export const storage = {
  // Tüm veriyi yükle
  load(): UserData {
    if (typeof window === 'undefined') return getDefaultUserData();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return getDefaultUserData();
      return JSON.parse(data);
    } catch {
      return getDefaultUserData();
    }
  },

  // Tüm veriyi kaydet
  save(data: UserData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Veriyi sıfırla
  reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  // Node tamamlama
  completeNode(nodeId: string, isQuiz: boolean = false, quizScore?: number): { xpGained: number; newAchievements: Achievement[] } {
    const data = this.load();
    const today = new Date().toISOString().split('T')[0];
    let xpGained = 0;
    const newAchievements: Achievement[] = [];

    // Node'u tamamlanmış olarak işaretle
    if (!data.progress.completedNodes.includes(nodeId)) {
      data.progress.completedNodes.push(nodeId);

      if (isQuiz) {
        // Quiz tamamlama
        const isPerfect = quizScore === 100;
        xpGained = isPerfect ? XP_REWARDS.QUIZ_PERFECT : XP_REWARDS.QUIZ_PASS;
        data.stats.totalQuizzesPassed++;

        // Quiz attempt kaydet
        if (!data.progress.quizAttempts[nodeId]) {
          data.progress.quizAttempts[nodeId] = [];
        }
        data.progress.quizAttempts[nodeId].push({
          score: quizScore || 0,
          passed: true,
          attemptedAt: new Date().toISOString(),
        });

        // Perfect quiz achievement
        if (isPerfect && !data.achievements.find(a => a.id === 'perfect_quiz')) {
          const achievement = this.unlockAchievement('perfect_quiz');
          if (achievement) newAchievements.push(achievement);
        }

        // Quiz master achievement
        if (data.stats.totalQuizzesPassed >= 10 && !data.achievements.find(a => a.id === 'quiz_master')) {
          const achievement = this.unlockAchievement('quiz_master');
          if (achievement) newAchievements.push(achievement);
        }
      } else {
        // Ders tamamlama
        xpGained = XP_REWARDS.LESSON_COMPLETE;
        data.stats.totalLessonsCompleted++;
      }
    }

    // Streak güncelle
    const lastDate = data.stats.lastActivityDate;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        // Streak devam ediyor
        data.stats.streak++;
        xpGained += XP_REWARDS.STREAK_BONUS * data.stats.streak;
      } else if (lastDate !== today) {
        // Streak kırıldı veya yeni başlıyor
        data.stats.streak = 1;
      }

      data.stats.lastActivityDate = today;
      data.stats.longestStreak = Math.max(data.stats.longestStreak, data.stats.streak);

      // Streak achievements
      if (data.stats.streak >= 7 && !data.achievements.find(a => a.id === 'streak_7')) {
        const achievement = this.unlockAchievement('streak_7');
        if (achievement) newAchievements.push(achievement);
      }
      if (data.stats.streak >= 30 && !data.achievements.find(a => a.id === 'streak_30')) {
        const achievement = this.unlockAchievement('streak_30');
        if (achievement) newAchievements.push(achievement);
      }
    }

    // First step achievement
    if (data.progress.completedNodes.length === 1 && !data.achievements.find(a => a.id === 'first_step')) {
      const achievement = this.unlockAchievement('first_step');
      if (achievement) newAchievements.push(achievement);
    }

    // Night owl achievement
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6 && !data.achievements.find(a => a.id === 'night_owl')) {
      const achievement = this.unlockAchievement('night_owl');
      if (achievement) newAchievements.push(achievement);
    }

    // XP ekle ve level güncelle
    data.stats.xp += xpGained;
    data.stats.level = this.calculateLevel(data.stats.xp);

    // Kaydet
    this.save(data);

    return { xpGained, newAchievements };
  },

  // Level hesapla
  calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i].minXP) {
        return LEVEL_THRESHOLDS[i].level;
      }
    }
    return 1;
  },

  // Level bilgisi al
  getLevelInfo(level: number) {
    return LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
  },

  // Sonraki level için gereken XP
  getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
    const currentLevel = this.calculateLevel(currentXP);
    const nextThreshold = LEVEL_THRESHOLDS.find(l => l.level === currentLevel + 1);

    if (!nextThreshold) {
      return { current: currentXP, needed: currentXP, progress: 100 };
    }

    const currentThreshold = LEVEL_THRESHOLDS.find(l => l.level === currentLevel);
    const baseXP = currentThreshold?.minXP || 0;
    const neededXP = nextThreshold.minXP - baseXP;
    const progressXP = currentXP - baseXP;

    return {
      current: progressXP,
      needed: neededXP,
      progress: Math.min((progressXP / neededXP) * 100, 100),
    };
  },

  // Achievement aç
  unlockAchievement(achievementId: string): Achievement | null {
    const data = this.load();
    const config = ACHIEVEMENTS_CONFIG.find(a => a.id === achievementId);

    if (!config || data.achievements.find(a => a.id === achievementId)) {
      return null;
    }

    const achievement: Achievement = {
      ...config,
      earnedAt: new Date().toISOString(),
    };

    data.achievements.push(achievement);
    this.save(data);

    return achievement;
  },

  // Survey cevaplarını kaydet
  saveSurveyAnswers(answers: Record<string, string>): void {
    const data = this.load();
    data.surveyAnswers = answers;
    this.save(data);
  },

  // Önerilen track'i kaydet
  setRecommendedTrack(trackId: string): void {
    const data = this.load();
    data.recommendedTrack = trackId;
    data.progress.currentTrackId = trackId;
    this.save(data);
  },

  // Node durumunu kontrol et
  isNodeCompleted(nodeId: string): boolean {
    const data = this.load();
    return data.progress.completedNodes.includes(nodeId);
  },

  // Tamamlanan node listesi
  getCompletedNodes(): string[] {
    return this.load().progress.completedNodes;
  },

  // İstatistikleri al
  getStats(): UserStats {
    return this.load().stats;
  },

  // Başarıları al
  getAchievements(): Achievement[] {
    return this.load().achievements;
  },

  // Bugünkü aktivite var mı?
  hasActivityToday(): boolean {
    const data = this.load();
    const today = new Date().toISOString().split('T')[0];
    return data.stats.lastActivityDate === today;
  },

  // Quiz attempt ekle (başarısız olsa bile)
  addQuizAttempt(nodeId: string, score: number, passed: boolean): void {
    const data = this.load();

    if (!data.progress.quizAttempts[nodeId]) {
      data.progress.quizAttempts[nodeId] = [];
    }

    data.progress.quizAttempts[nodeId].push({
      score,
      passed,
      attemptedAt: new Date().toISOString(),
    });

    this.save(data);
  },

  // Belirli bir quiz'in geçmişini al
  getQuizHistory(nodeId: string) {
    const data = this.load();
    return data.progress.quizAttempts[nodeId] || [];
  },
};

export const authStorage = {
  login(username: string, password: string) {
    if (typeof window === 'undefined') return { success: false, error: 'Sunucu hatası' };
    const users = JSON.parse(localStorage.getItem('kariyeryolu_mock_users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('kariyeryolu_auth_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Kullanıcı adı veya şifre hatalı' };
  },
  register(username: string, email: string, password: string) {
    if (typeof window === 'undefined') return { success: false, error: 'Sunucu hatası' };
    const users = JSON.parse(localStorage.getItem('kariyeryolu_mock_users') || '[]');
    if (users.find((u: any) => u.username === username)) {
      return { success: false, error: 'Bu kullanıcı adı zaten alınmış' };
    }
    if (email && users.find((u: any) => u.email === email)) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
    }
    const newUser = { id: Date.now().toString(), username, email, password };
    users.push(newUser);
    localStorage.setItem('kariyeryolu_mock_users', JSON.stringify(users));
    localStorage.setItem('kariyeryolu_auth_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  },
  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('kariyeryolu_auth_user');
  },
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem('kariyeryolu_auth_user') || 'null');
  }
};

export default storage;

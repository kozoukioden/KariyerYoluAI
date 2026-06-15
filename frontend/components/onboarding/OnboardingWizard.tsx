'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';

interface TrackRecommendation {
  trackId: string;
  trackTitle: string;
  confidence: number;
  reasons: string[];
}

export function OnboardingWizard({ onComplete }: { onComplete: (result: TrackRecommendation) => void }) {
  const [history, setHistory] = useState<string[]>(['experience']);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const currentStepId = history[history.length - 1];

  const questions: Record<string, any> = {
    experience: {
      text: 'Programlama deneyimin ne düzeyde?',
      options: [
        { value: 'beginner', label: 'Yeni başlıyorum', icon: '🌱', description: 'Hiç kod yazmadım' },
        { value: 'intermediate', label: 'Orta seviye', icon: '💪', description: 'Temel kavramları biliyorum' },
        { value: 'advanced', label: 'İleri seviye', icon: '🚀', description: 'Kendi projelerimi yapabiliyorum' }
      ],
      next: (val: string) => val === 'beginner' ? 'motivation' : 'current_tech'
    },
    // ---- BEGINNER PATH ----
    motivation: {
      text: 'Yazılım öğrenme hedefin nedir?',
      options: [
        { value: 'career', label: 'Kariyer & İş Bulmak', icon: '💼', description: 'Profesyonel bir yazılımcı olmak' },
        { value: 'startup', label: 'Kendi İşimi Kurmak', icon: '🚀', description: 'Kendi fikirlerimi hayata geçirmek' },
        { value: 'hobby', label: 'Hobi / Merak', icon: '🎨', description: 'Eğlence ve kişisel gelişim' }
      ],
      next: () => 'platform'
    },
    platform: {
      text: 'Hangi alanda ürün geliştirmek istersin?',
      options: [
        { value: 'web', label: 'Web Siteleri (Önerilen)', icon: '🌐', description: 'Tarayıcıda çalışan kullanıcı arayüzleri' },
        { value: 'mobile', label: 'Mobil Uygulamalar', icon: '📱', description: 'Telefonda çalışan uygulamalar' },
        { value: 'game', label: 'Oyunlar', icon: '🎮', description: 'Eğlenceli oyun projeleri' }
      ],
      next: () => 'learning_style'
    },
    learning_style: {
      text: 'Nasıl bir çalışma temposu sana uygun?',
      options: [
        { value: 'chill', label: 'Rahat (Günde 30dk)', icon: '☕', description: 'Yavaş ama istikrarlı adımlar' },
        { value: 'normal', label: 'Normal (Günde 1-2 Saat)', icon: '📚', description: 'Dengeli bir tempo' },
        { value: 'hardcore', label: 'Yoğun (Günde 3+ Saat)', icon: '🔥', description: 'Hızlı gelişim ve sonuç' }
      ],
      next: () => null // End of beginner wizard
    },

    // ---- ADVANCED/INTERMEDIATE PATH ----
    current_tech: {
      text: 'Şu an hangi alana daha yakınsın?',
      options: [
        { value: 'frontend', label: 'Görsel Arayüz (Frontend)', icon: '🎨', description: 'React, Vue, UI Geliştirme' },
        { value: 'backend', label: 'Arka Plan (Backend)', icon: '⚙️', description: 'Sunucular, API, Veritabanı' },
        { value: 'data', label: 'Veri & Yapay Zeka', icon: '🤖', description: 'Python, Makine Öğrenmesi, Veri Analizi' }
      ],
      next: () => 'career_goal'
    },
    career_goal: {
      text: 'Mevcut yetkinliklerini nereye taşımak istersin?',
      options: [
        { value: 'enterprise', label: 'Kurumsal Kariyer', icon: '🏢', description: 'Büyük şirketlerde uzmanlaşmak' },
        { value: 'freelance', label: 'Freelance & Uzaktan', icon: '🌍', description: 'Özgür çalışıp global projeler almak' },
        { value: 'fullstack', label: 'Full-Stack Olmak', icon: '🦄', description: 'Baştan uca tüm sisteme hakim olmak' }
      ],
      next: () => 'deep_dive'
    },
    deep_dive: {
      text: 'Seni en çok hangi konu heyecanlandırıyor?',
      options: [
        { value: 'architecture', label: 'Sistem Mimarisi & Ölçeklenebilirlik', icon: '🏗️', description: 'Büyük sistemler tasarlamak' },
        { value: 'performance', label: 'Performans & Optimizasyon', icon: '⚡', description: 'Hızlı ve pürüzsüz uygulamalar' },
        { value: 'devops', label: 'DevOps & Otomasyon', icon: '🔄', description: 'Süreçleri otomatize etmek ve bulut' }
      ],
      next: () => null // End of advanced wizard
    }
  };

  const currentQ = questions[currentStepId];

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [currentStepId]: value };
    setAnswers(newAnswers);

    const nextStep = currentQ.next(value);

    if (nextStep) {
      setHistory([...history, nextStep]);
    } else {
      // Bitiş
      setLoading(true);

      try {
        // Recommend track based on answers
        let recommendedTrackId = 'frontend_developer';
        
        if (newAnswers.experience === 'beginner') {
          if (newAnswers.platform === 'mobile') recommendedTrackId = 'mobile_cross_developer';
          else if (newAnswers.platform === 'game') recommendedTrackId = 'game_developer';
          else recommendedTrackId = 'frontend_developer';
        } else {
          if (newAnswers.current_tech === 'data') recommendedTrackId = 'ml_engineer';
          else if (newAnswers.current_tech === 'backend') recommendedTrackId = 'backend_developer';
          else if (newAnswers.career_goal === 'fullstack') recommendedTrackId = 'fullstack_developer';
          else recommendedTrackId = 'frontend_developer';
        }

        const recommendation = {
          trackId: recommendedTrackId,
          trackTitle: 'Kişiselleştirilmiş Yol Haritan',
          confidence: 95,
          reasons: ['Verdiğin cevaplara en uygun teknoloji yığını']
        };

        storage.saveSurveyAnswers(newAnswers);
        storage.setRecommendedTrack(recommendation.trackId);

        setTimeout(() => {
          onComplete(recommendation);
        }, 2000);
      } catch (e) {
        console.error("Recommendation failed", e);
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl w-full relative z-10">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Yol Haritan Çiziliyor
            </h2>
            <p className="text-slate-400 text-lg">Cevaplarına en uygun özel müfredat hazırlanıyor...</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepId}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full text-sm text-slate-400 mb-4">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>Kariyer Keşfi</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-relaxed">
                {currentQ.text}
              </h1>

              <div className="grid gap-3">
                {currentQ.options.map((opt: any, idx: number) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSelect(opt.value)}
                    className="flex items-center gap-4 bg-slate-800/70 hover:bg-slate-700/70 p-4 md:p-5 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-all text-left group backdrop-blur-sm"
                  >
                    <span className="text-3xl md:text-4xl bg-slate-900/50 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      {opt.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base md:text-lg">{opt.label}</h3>
                      {opt.description && (
                        <p className="text-slate-400 text-sm mt-1 truncate">{opt.description}</p>
                      )}
                    </div>
                    <ArrowRight className="text-slate-500 group-hover:text-green-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                  </motion.button>
                ))}
              </div>

              {history.length > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleBack}
                  className="mt-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Önceki soru</span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

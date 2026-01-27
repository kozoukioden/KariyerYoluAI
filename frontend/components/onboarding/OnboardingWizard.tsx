'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Code, Palette, Shield, Gamepad2, Database, Cloud, Smartphone } from 'lucide-react';
import { storage } from '@/lib/storage';

interface Question {
  id: string;
  text: string;
  type: 'choice' | 'multi';
  options: { value: string; label: string; icon?: string; description?: string }[];
}

const questions: Question[] = [
  {
    id: 'experience',
    text: 'Programlama deneyimin ne düzeyde?',
    type: 'choice',
    options: [
      { value: 'beginner', label: 'Yeni başlıyorum', icon: '🌱', description: 'Hiç kod yazmadım veya çok az deneyimim var' },
      { value: 'some', label: 'Biraz biliyorum', icon: '📚', description: 'Temel kavramları öğrendim, projeler yaptım' },
      { value: 'intermediate', label: 'Orta seviye', icon: '💪', description: 'Kendi projelerimi geliştirebiliyorum' },
      { value: 'advanced', label: 'İleri seviye', icon: '🚀', description: 'Profesyonel deneyimim var' }
    ]
  },
  {
    id: 'motivation',
    text: 'Yazılım öğrenme motivasyonun ne?',
    type: 'choice',
    options: [
      { value: 'career', label: 'Kariyer değişikliği', icon: '💼', description: 'Yazılım alanında iş bulmak istiyorum' },
      { value: 'startup', label: 'Kendi işimi kurmak', icon: '🎯', description: 'Startup veya freelance çalışmak' },
      { value: 'hobby', label: 'Hobi olarak', icon: '🎨', description: 'Eğlence için öğrenmek istiyorum' },
      { value: 'upgrade', label: 'Mevcut işimi geliştirmek', icon: '📈', description: 'Şu anki işimde yazılım kullanmak' }
    ]
  },
  {
    id: 'interest_core',
    text: 'Seni en çok ne heyecanlandırır?',
    type: 'choice',
    options: [
      { value: 'visual', label: 'Görsel tasarım ve arayüz', icon: '🎨', description: 'Güzel ve kullanışlı arayüzler tasarlamak' },
      { value: 'logic', label: 'Problem çözme ve algoritmalar', icon: '🧠', description: 'Karmaşık mantık problemleri çözmek' },
      { value: 'data', label: 'Veri analizi ve yapay zeka', icon: '📊', description: 'Verilerden anlam çıkarmak' },
      { value: 'security', label: 'Güvenlik ve koruma', icon: '🛡️', description: 'Sistemleri korumak, açık bulmak' }
    ]
  },
  {
    id: 'platform',
    text: 'Hangi platformda geliştirmek istersin?',
    type: 'choice',
    options: [
      { value: 'web', label: 'Web Uygulamaları', icon: '🌐', description: 'Tarayıcıda çalışan siteler ve uygulamalar' },
      { value: 'mobile', label: 'Mobil Uygulamalar', icon: '📱', description: 'iOS ve Android uygulamaları' },
      { value: 'game', label: 'Oyunlar', icon: '🎮', description: 'Bilgisayar, konsol veya mobil oyunlar' },
      { value: 'backend', label: 'Sunucu Sistemleri', icon: '⚙️', description: 'API, veritabanı, altyapı' }
    ]
  },
  {
    id: 'work_preference',
    text: 'Nasıl çalışmayı tercih edersin?',
    type: 'choice',
    options: [
      { value: 'frontend', label: 'Kullanıcıyla etkileşim', icon: '👁️', description: 'Görünen kısım, arayüz, deneyim' },
      { value: 'backend', label: 'Arka plan sistemleri', icon: '🔧', description: 'Görünmeyen mantık, veritabanı' },
      { value: 'fullstack', label: 'Her ikisi de', icon: '🔄', description: 'Hem ön hem arka uç' },
      { value: 'devops', label: 'Altyapı ve operasyonlar', icon: '☁️', description: 'Sunucu, deployment, CI/CD' }
    ]
  },
  {
    id: 'project_type',
    text: 'Hangi tür projeler seni daha çok cezbediyor?',
    type: 'choice',
    options: [
      { value: 'social', label: 'Sosyal medya ve topluluk', icon: '👥', description: 'İnsanları bir araya getiren platformlar' },
      { value: 'ecommerce', label: 'E-ticaret', icon: '🛒', description: 'Online mağaza ve ödeme sistemleri' },
      { value: 'productivity', label: 'Verimlilik araçları', icon: '✅', description: 'Task manager, not uygulamaları' },
      { value: 'entertainment', label: 'Eğlence', icon: '🎬', description: 'Oyun, video, müzik platformları' }
    ]
  },
  {
    id: 'tech_interest',
    text: 'Hangi teknolojiler ilgini çekiyor?',
    type: 'choice',
    options: [
      { value: 'ai_ml', label: 'Yapay Zeka / ML', icon: '🤖', description: 'Makine öğrenmesi, derin öğrenme' },
      { value: 'blockchain', label: 'Blockchain / Web3', icon: '⛓️', description: 'Kripto, akıllı kontratlar' },
      { value: 'cloud', label: 'Cloud / DevOps', icon: '☁️', description: 'AWS, Docker, Kubernetes' },
      { value: 'traditional', label: 'Geleneksel Web/Mobil', icon: '💻', description: 'Web siteleri, mobil uygulamalar' }
    ]
  },
  {
    id: 'learning_style',
    text: 'Nasıl öğrenmeyi tercih edersin?',
    type: 'choice',
    options: [
      { value: 'structured', label: 'Adım adım, yapılandırılmış', icon: '📋', description: 'Sıralı dersler, net yol haritası' },
      { value: 'project', label: 'Proje yaparak', icon: '🛠️', description: 'Gerçek projeler üzerinde çalışarak' },
      { value: 'theory', label: 'Önce teori', icon: '📖', description: 'Kavramları anla, sonra uygula' },
      { value: 'trial', label: 'Deneme yanılma', icon: '🧪', description: 'Hata yaparak öğren' }
    ]
  },
  {
    id: 'time_commitment',
    text: 'Günde ne kadar zaman ayırabilirsin?',
    type: 'choice',
    options: [
      { value: 'minimal', label: '30 dakika', icon: '⏰', description: 'Günde yarım saat' },
      { value: 'moderate', label: '1-2 saat', icon: '🕐', description: 'Orta düzey bağlılık' },
      { value: 'dedicated', label: '3-4 saat', icon: '🕒', description: 'Ciddi çalışma' },
      { value: 'fulltime', label: '5+ saat', icon: '🕔', description: 'Tam zamanlı öğrenme' }
    ]
  },
  {
    id: 'goal_timeline',
    text: 'Hedefine ne kadar sürede ulaşmak istersin?',
    type: 'choice',
    options: [
      { value: 'fast', label: '3 ay içinde', icon: '🏃', description: 'Hızlı öğrenme, yoğun tempo' },
      { value: 'medium', label: '6 ay içinde', icon: '🚶', description: 'Dengeli bir hız' },
      { value: 'slow', label: '1 yıl içinde', icon: '🐢', description: 'Yavaş ve sağlam' },
      { value: 'flexible', label: 'Esnek', icon: '🌊', description: 'Zaman baskısı yok' }
    ]
  },
  {
    id: 'work_environment',
    text: 'Hangi çalışma ortamı sana daha uygun?',
    type: 'choice',
    options: [
      { value: 'startup', label: 'Startup', icon: '🚀', description: 'Hızlı, dinamik, çok şapkalı' },
      { value: 'corporate', label: 'Kurumsal şirket', icon: '🏢', description: 'Stabil, yapılandırılmış' },
      { value: 'freelance', label: 'Freelance', icon: '🏠', description: 'Bağımsız, kendi işin' },
      { value: 'remote', label: 'Uzaktan çalışma', icon: '🌍', description: 'Lokasyondan bağımsız' }
    ]
  },
  {
    id: 'team_preference',
    text: 'Takımda nasıl çalışmayı seversin?',
    type: 'choice',
    options: [
      { value: 'solo', label: 'Bireysel çalışma', icon: '🧘', description: 'Kendi başıma odaklanarak' },
      { value: 'pair', label: 'Eşli programlama', icon: '👥', description: 'Biriyle beraber kod yazma' },
      { value: 'small_team', label: 'Küçük takım', icon: '👨‍👩‍👧', description: '3-5 kişilik grup' },
      { value: 'large_team', label: 'Büyük takım', icon: '🏟️', description: 'Geniş ekip, farklı roller' }
    ]
  }
];

interface TrackRecommendation {
  trackId: string;
  trackTitle: string;
  confidence: number;
  reasons: string[];
}

export function OnboardingWizard({ onComplete }: { onComplete: (result: TrackRecommendation) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);

      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers)
        });
        const recommendation = await res.json();

        // Save to localStorage
        storage.saveSurveyAnswers(newAnswers);
        storage.setRecommendedTrack(recommendation.trackId);

        // Delay for effect
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
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Yapay Zeka Analiz Ediyor
              </h2>
              <p className="text-slate-400 text-lg">
                Cevaplarını değerlendirip sana en uygun kariyer yolunu çiziyoruz...
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['🎯', '📊', '🧠', '✨'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full text-sm text-slate-400 mb-4">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>Kariyer Keşfi</span>
                </div>
                <p className="text-slate-500">
                  Soru {currentStep + 1} / {questions.length}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-slate-700 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  initial={{ width: `${((currentStep) / questions.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question */}
              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-relaxed">
                {questions[currentStep].text}
              </h1>

              {/* Options */}
              <div className="grid gap-3">
                {questions[currentStep].options.map((opt, idx) => (
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

              {/* Back Button */}
              {currentStep > 0 && (
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

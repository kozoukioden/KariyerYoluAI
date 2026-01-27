'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Heart,
  X,
  Zap,
  Trophy,
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  passed: boolean;
}

interface QuizRunnerProps {
  questions: Question[];
  quizTitle?: string;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

// Motivasyon mesajları
const correctMessages = [
  'Harika!',
  'Mükemmel!',
  'Doğru!',
  'Süpersin!',
  'Bravo!',
  'Muhteşem!',
  'Tam isabet!',
  'Aferin!'
];

const wrongMessages = [
  'Yanlış',
  'Olmadı',
  'Tekrar dene',
  'Üzülme',
  'Bir dahakine'
];

export function QuizRunner({ questions, quizTitle, onComplete, onExit }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  // XP hesaplama
  const calculateXP = useCallback(() => {
    const baseXP = correctCount * 10;
    const streakBonus = Math.floor(streak / 3) * 5;
    const perfectBonus = wrongCount === 0 ? 25 : 0;
    return baseXP + streakBonus + perfectBonus;
  }, [correctCount, streak, wrongCount]);

  // Konfeti efekti
  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Mini konfeti (doğru cevap için)
  const miniConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#4ade80', '#86efac']
    });
  };

  // Cevabı kontrol et
  const handleCheck = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQ.correct_answer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedbackMessage(correctMessages[Math.floor(Math.random() * correctMessages.length)]);
      miniConfetti();
    } else {
      setWrongCount(prev => prev + 1);
      setStreak(0);
      setHearts(prev => prev - 1);
      setFeedbackMessage(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
    }
  };

  // Sonraki soruya geç veya bitir
  const handleNext = () => {
    // Can bittiyse quiz'i bitir
    if (hearts <= 0) {
      finishQuiz(false);
      return;
    }

    if (isLastQuestion) {
      finishQuiz(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  // Quiz'i bitir
  const finishQuiz = (completed: boolean) => {
    const passed = correctCount >= Math.ceil(questions.length * 0.6); // %60 geçme notu

    if (passed && completed) {
      fireConfetti();
    }

    setShowResult(true);
  };

  // Sonuç ekranından çık
  const handleFinish = () => {
    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      xpEarned: calculateXP(),
      passed: correctCount >= Math.ceil(questions.length * 0.6)
    };
    onComplete(result);
  };

  // Sonuç Ekranı
  if (showResult) {
    const passed = correctCount >= Math.ceil(questions.length * 0.6);
    const percentage = Math.round((correctCount / questions.length) * 100);
    const xp = calculateXP();

    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          {/* Başarı/Başarısızlık İkonu */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={cn(
              "w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center",
              passed
                ? "bg-gradient-to-br from-amber-400 to-amber-600"
                : "bg-gradient-to-br from-slate-600 to-slate-700"
            )}
          >
            {passed ? (
              <Trophy size={64} className="text-white" />
            ) : (
              <XCircle size={64} className="text-slate-400" />
            )}
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-3xl font-bold mb-2",
              passed ? "text-amber-400" : "text-slate-400"
            )}
          >
            {passed ? 'Tebrikler!' : 'Tekrar Dene'}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mb-8"
          >
            {passed
              ? 'Quiz\'i başarıyla tamamladın!'
              : 'Geçmek için %60 doğru gerekli'}
          </motion.p>

          {/* İstatistikler */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-2xl p-6 mb-6"
          >
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                <div className="text-xs text-slate-500">Doğru</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{wrongCount}</div>
                <div className="text-xs text-slate-500">Yanlış</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-xs text-slate-500">Başarı</div>
              </div>
            </div>

            {/* XP Kazanımı */}
            {passed && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-700">
                <Zap className="text-amber-400 fill-amber-400" size={24} />
                <span className="text-xl font-bold text-amber-400">+{xp} XP</span>
              </div>
            )}
          </motion.div>

          {/* Butonlar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={handleFinish}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-lg transition-all",
                passed
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
              )}
            >
              {passed ? 'Devam Et' : 'Tekrar Dene'}
            </button>

            <button
              onClick={onExit}
              className="w-full py-3 rounded-xl font-medium text-slate-400 hover:text-white transition-all"
            >
              Ana Sayfaya Dön
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col text-white">
      {/* Top Bar */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <button
          onClick={onExit}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={i < hearts ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
            >
              <Heart
                size={24}
                className={cn(
                  "transition-colors",
                  i < hearts ? "text-red-500 fill-red-500" : "text-slate-600"
                )}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Question Counter */}
      <div className="text-center py-3 text-sm text-slate-500">
        {currentIndex + 1} / {questions.length}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            {/* Question */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 leading-tight text-center">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = opt === currentQ.correct_answer;
                const showCorrect = isAnswered && isCorrectOption;
                const showWrong = isAnswered && isSelected && !isCorrectOption;

                return (
                  <motion.button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(opt)}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all text-base md:text-lg font-medium flex items-center gap-4",
                      // Default state
                      !isAnswered && !isSelected && "border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600",
                      // Selected but not answered
                      !isAnswered && isSelected && "border-blue-500 bg-blue-500/20 text-blue-200",
                      // Correct answer (after answering)
                      showCorrect && "border-green-500 bg-green-500/20 text-green-200",
                      // Wrong answer (after answering)
                      showWrong && "border-red-500 bg-red-500/20 text-red-200",
                      // Disabled look for non-selected options after answering
                      isAnswered && !isSelected && !isCorrectOption && "opacity-50"
                    )}
                  >
                    {/* Option Number */}
                    <span className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                      !isAnswered && !isSelected && "bg-slate-700/50 text-slate-400",
                      !isAnswered && isSelected && "bg-blue-500 text-white",
                      showCorrect && "bg-green-500 text-white",
                      showWrong && "bg-red-500 text-white",
                      isAnswered && !isSelected && !isCorrectOption && "bg-slate-700/30 text-slate-500"
                    )}>
                      {showCorrect ? <CheckCircle2 size={20} /> : showWrong ? <XCircle size={20} /> : idx + 1}
                    </span>

                    {/* Option Text */}
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Feedback */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isAnswered ? 'feedback' : 'check'}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={cn(
            "p-4 md:p-6 border-t transition-colors duration-300",
            isAnswered
              ? isCorrect
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
              : "bg-slate-900 border-slate-800"
          )}
        >
          <div className="max-w-2xl mx-auto">
            {isAnswered ? (
              <div className="space-y-4">
                {/* Feedback Header */}
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-green-400">{feedbackMessage}</div>
                        {streak >= 3 && (
                          <div className="flex items-center gap-1 text-amber-400 text-sm">
                            <Sparkles size={14} />
                            <span>{streak} seri!</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <XCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-red-400">{feedbackMessage}</div>
                        <div className="text-sm text-slate-400">
                          Doğru cevap: <span className="text-green-400">{currentQ.correct_answer}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Explanation */}
                <div className={cn(
                  "p-4 rounded-xl text-sm",
                  isCorrect ? "bg-green-500/10 text-green-200" : "bg-red-500/10 text-red-200"
                )}>
                  <p>{currentQ.explanation}</p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleNext}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wide",
                    isCorrect
                      ? "bg-green-500 hover:bg-green-400 text-white"
                      : "bg-red-500 hover:bg-red-400 text-white"
                  )}
                >
                  {hearts <= 0 ? 'Sonuçları Gör' : isLastQuestion ? 'Bitir' : 'Devam Et'}
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg transition-all uppercase tracking-wide",
                  selectedOption
                    ? "bg-green-500 hover:bg-green-400 text-white"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                Kontrol Et
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

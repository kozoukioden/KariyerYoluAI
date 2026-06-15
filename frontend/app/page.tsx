'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Sparkles, Terminal } from 'lucide-react';
import { authStorage } from '@/lib/storage';

export default function LoginPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if already logged in (we still check it but we DO NOT auto-redirect to bypass login screen)
  useEffect(() => {
    if (authStorage.getCurrentUser()) {
      setIsLoggedIn(true);
    }
  }, []);

  // Auto transition from welcome screen to login
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      let result;
      if (isLogin) {
        result = authStorage.login(username, password);
      } else {
        result = authStorage.register(username, email, password);
      }

      if (result.success) {
        router.push('/home');
      } else {
        setErrorMsg(result.error || 'Bir hata oluştu');
        setIsLoading(false);
      }
    }, 800); // simulate network delay
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]" />

      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center z-10"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Terminal className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                KariyerYolu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
              </h1>
              <p className="text-xl text-blue-200">
                Geleceğin Yazılımcısı, Hoş Geldin!
              </p>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setShowWelcome(false)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all backdrop-blur-md flex items-center gap-2 mx-auto"
            >
              Başlamak İçin Tıkla <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full max-w-md z-10"
          >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <User className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  KariyerYolu AI
                </h2>
                <p className="text-blue-200/60 text-sm mt-2">
                  Hesabınıza giriş yapın veya yeni kayıt olun
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isForgotPassword ? (
                  <motion.form
                    key="forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                  >
                    <div className="mb-6 text-center">
                      <h2 className="text-lg font-semibold text-white mb-2">Şifremi Unuttum</h2>
                      <p className="text-sm text-slate-400">E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.</p>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="E-posta Adresi"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl py-3 transition-all transform active:scale-[0.98]"
                    >
                      Gönder
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm py-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Geri Dön
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="auth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleAuth}
                    className="space-y-4"
                  >
                    <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
                      <button
                        type="button"
                        onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                          isLogin ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Giriş Yap
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                          !isLogin ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Kayıt Ol
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                        {errorMsg}
                      </div>
                    )}

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Kullanıcı Adı"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {!isLogin && (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="E-posta Adresi"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Şifre"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {isLogin && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Şifremi Unuttum
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl py-3 mt-4 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            <p className="text-center text-slate-500 text-xs mt-6">
              © 2026 KariyerYolu AI. Tüm hakları saklıdır.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

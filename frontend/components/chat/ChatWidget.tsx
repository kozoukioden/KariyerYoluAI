'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  Code,
  BookOpen,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: 'ai' | 'rag' | 'fallback' | 'error';
}

interface ChatWidgetProps {
  currentTrackId?: string;
}

// Hızlı soru önerileri
const quickQuestions = [
  { icon: Code, text: 'Kod örneği göster', color: 'text-blue-400' },
  { icon: Lightbulb, text: 'Bu konuyu açıklar mısın?', color: 'text-amber-400' },
  { icon: BookOpen, text: 'Hangi dersi önerirsin?', color: 'text-green-400' },
];

export function ChatWidget({ currentTrackId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Ben KariyerYolu AI asistanıyım. Yazılım öğrenme yolculuğunda sana yardımcı olmak için buradayım. Ne sormak istersin?',
      timestamp: new Date(),
      source: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Mesaj gönder
  const handleSend = useCallback(async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          })),
          current_track_id: currentTrackId
        })
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'Bir hata oluştu.',
        timestamp: new Date(),
        source: data.source
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
        source: 'error'
      }]);
    }

    setLoading(false);
  }, [input, loading, messages, currentTrackId]);

  // Sohbeti temizle
  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: 'Sohbet temizlendi. Nasıl yardımcı olabilirim?',
      timestamp: new Date(),
      source: 'ai'
    }]);
  };

  const widgetSize = isExpanded
    ? 'w-[500px] h-[700px]'
    : 'w-[380px] md:w-[420px] h-[550px]';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col mb-4 overflow-hidden",
              widgetSize
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Mentor</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Çevrimiçi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Sohbeti temizle"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title={isExpanded ? 'Küçült' : 'Genişlet'}
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    m.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    m.role === 'assistant'
                      ? "bg-gradient-to-br from-blue-500 to-purple-600"
                      : "bg-slate-700"
                  )}>
                    {m.role === 'assistant' ? (
                      <Bot size={16} className="text-white" />
                    ) : (
                      <User size={16} className="text-slate-300" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed",
                    m.role === 'user'
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                  )}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ children, className }) {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-slate-700 px-1.5 py-0.5 rounded text-blue-300 text-xs">
                                  {children}
                                </code>
                              ) : (
                                <pre className="bg-slate-950 p-3 rounded-lg overflow-x-auto my-2">
                                  <code className="text-xs text-green-300">{children}</code>
                                </pre>
                              );
                            },
                            p({ children }) {
                              return <p className="mb-2 last:mb-0">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
                            },
                            strong({ children }) {
                              return <strong className="text-white font-semibold">{children}</strong>;
                            }
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}

                    {/* Source indicator */}
                    {m.role === 'assistant' && m.source === 'ai' && (
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-700 text-xs text-slate-500">
                        <Sparkles size={12} />
                        <span>AI tarafından oluşturuldu</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                    <div className="flex gap-1.5">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && !loading && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors border border-slate-700"
                    >
                      <q.icon size={12} className={q.color} />
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder:text-slate-500"
                  placeholder="Bir soru sor..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    input.trim() && !loading
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 text-center">
                Groq + Llama 3.3 70B ile desteklenmektedir
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden",
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          "ring-4 ring-blue-500/20"
        )}
      >
        {/* Pulse animation */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-blue-400 rounded-full"
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </motion.div>
        </AnimatePresence>

        {/* Notification badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
          />
        )}
      </motion.button>
    </div>
  );
}

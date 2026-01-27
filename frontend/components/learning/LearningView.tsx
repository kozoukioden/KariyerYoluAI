'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LearningViewProps {
    title: string;
    content: string; // Markdown supported
    onStartQuiz: () => void;
    onClose: () => void;
}

export function LearningView({ title, content, onStartQuiz, onClose }: LearningViewProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/95 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700"
                >
                    {/* Header */}
                    <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative flex items-end p-8">
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/20 rounded-full hover:bg-black/40 text-white transition-opacity">
                            <XCircle size={32} />
                        </button>
                        <div>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md mb-4 inline-block">
                                DERS İÇERİĞİ
                            </span>
                            <h1 className="text-4xl font-bold text-white">{title}</h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 bg-slate-800 text-slate-300 leading-8 text-lg">
                        <article className="prose prose-invert prose-lg max-w-none">
                            <ReactMarkdown>{content || "İçerik yükleniyor..."}</ReactMarkdown>
                        </article>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-900 border-t border-slate-700 flex justify-end sticky bottom-0 z-10">
                        <button
                            onClick={onStartQuiz}
                            className="bg-green-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-400 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                        >
                            <PlayCircle size={28} />
                            Teste Başla
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

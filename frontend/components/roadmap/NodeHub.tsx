'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, PenTool, Layout, PlayCircle } from 'lucide-react';

interface NodeHubProps {
    nodeTitle: string;
    nodeDescription: string;
    onClose: () => void;
    onOpenLesson: () => void;
    onOpenQuiz: () => void;
}

export function NodeHub({ nodeTitle, nodeDescription, onClose, onOpenLesson, onOpenQuiz }: NodeHubProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-slate-700 overflow-hidden relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>

                <div className="p-8 text-center border-b border-slate-700 bg-gradient-to-b from-slate-700/50 to-slate-800">
                    <div className="w-20 h-20 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Layout size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{nodeTitle}</h2>
                    <p className="text-slate-400">{nodeDescription}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Adım 1: Öğren</h3>
                        <button onClick={onOpenLesson} className="w-full flex items-center justify-between bg-slate-600 hover:bg-slate-500 p-4 rounded-xl transition-colors font-bold text-white group">
                            <span className="flex items-center gap-3"><BookOpen size={20} /> Ders İçeriği</span>
                            <PlayCircle size={20} className="opacity-0 group-hover:opacity-100 transition-all text-green-400" />
                        </button>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Adım 2: Uygula</h3>
                        <button onClick={onOpenQuiz} className="w-full flex items-center justify-between bg-green-600 hover:bg-green-500 p-4 rounded-xl transition-colors font-bold text-white shadow-lg shadow-green-600/20">
                            <span className="flex items-center gap-3"><PenTool size={20} /> Sınavı Başlat</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

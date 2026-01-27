'use client';
import React from 'react';
import { User, Trophy, Flame } from 'lucide-react';

export function LeaderboardView() {
    const users = [
        { name: "Ahmet Y.", score: 1250, streak: 12 },
        { name: "Selin K.", score: 1100, streak: 8 },
        { name: "Mehmet T.", score: 950, streak: 5 },
        { name: "Sen", score: 450, streak: 3, isMe: true },
        { name: "Ayşe B.", score: 300, streak: 1 },
    ];

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Trophy className="text-yellow-400" size={32} /> Haftalık Lider Tablosu
            </h2>
            <div className="space-y-4">
                {users.map((u, idx) => (
                    <div key={idx} className={`p-4 rounded-xl flex items-center justify-between border ${u.isMe ? 'bg-slate-700 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-400 w-6">{idx + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <span className={`font-bold ${u.isMe ? 'text-green-400' : 'text-white'}`}>{u.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1 text-orange-400">
                                <Flame size={16} fill="currentColor" /> {u.streak}
                            </div>
                            <div className="font-bold text-blue-400">{u.score} XP</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

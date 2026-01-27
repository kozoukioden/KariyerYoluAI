'use client';
import React from 'react';
import { UserCircle, Shield, Award } from 'lucide-react';

export function ProfileView() {
    return (
        <div className="p-8 max-w-2xl mx-auto text-white">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <UserCircle size={64} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Kullanıcı</h1>
                    <p className="text-slate-400">Junior Developer</p>
                    <div className="flex gap-2 mt-2">
                        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/50">Level 5</span>
                        <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full border border-yellow-500/50">Pro</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <Shield className="text-purple-400 mb-2" size={32} />
                    <h3 className="font-bold text-xl">450 XP</h3>
                    <p className="text-slate-400 text-sm">Toplam Puan</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <Award className="text-green-400 mb-2" size={32} />
                    <h3 className="font-bold text-xl">3 Rozet</h3>
                    <p className="text-slate-400 text-sm">Kazanılan Başarılar</p>
                </div>
            </div>
        </div>
    );
}

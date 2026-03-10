import React from 'react';
import { User, Mail, Shield, BookOpen, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType, Video } from '../types';
import { cn } from '../lib/utils';

interface UserProfileProps {
  user: UserType;
  videos: Video[];
}

export const UserProfile = ({ user, videos }: UserProfileProps) => {
  const progress = Math.round((user.completedLessons.length / videos.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-orange-600 flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl shadow-orange-100">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-serif font-bold text-zinc-900">{user.name}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Shield className="w-4 h-4" />
              {user.role}
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-center md:justify-start">
            <button className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
              Profili Düzenle
            </button>
            <button className="px-6 py-2 border border-zinc-200 text-zinc-600 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all">
              Sertifikalarım
            </button>
          </div>
        </div>

        <div className="w-full md:w-64 bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Genel İlerleme</span>
            <span className="text-lg font-serif font-bold text-orange-600">%{progress}</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-orange-600"
            />
          </div>
          <p className="text-[10px] text-zinc-500 text-center">
            {user.completedLessons.length} / {videos.length} ders tamamlandı
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-serif font-bold text-zinc-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-orange-600" />
            Kayıtlı Kurslarım
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {videos.map((video) => {
              const isCompleted = user.completedLessons.includes(video.id);
              return (
                <div key={video.id} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 group hover:border-orange-200 transition-all">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 truncate group-hover:text-orange-600 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-zinc-500">{video.instructor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        Tamamlandı
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-zinc-400 uppercase">
                        Devam Ediyor
                      </div>
                    )}
                    <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-zinc-900 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-500" />
            Başarımlar
          </h3>
          
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            {[
              { id: '1', title: 'Hızlı Başlangıç', desc: 'İlk dersini tamamladın', icon: '🚀', active: true },
              { id: '2', title: 'Bilgi Küpü', desc: '5 testi başarıyla geçtin', icon: '🧠', active: user.completedLessons.length >= 5 },
              { id: '3', title: 'Sadık Öğrenci', desc: '7 gün üst üste giriş yaptın', icon: '🔥', active: false },
            ].map(badge => (
              <div key={badge.id} className={cn(
                "flex items-center gap-4 p-3 rounded-2xl border transition-all",
                badge.active ? "bg-zinc-50 border-zinc-100" : "opacity-40 grayscale border-transparent"
              )}>
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">{badge.title}</p>
                  <p className="text-[10px] text-zinc-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

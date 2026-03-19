import React, { useState } from 'react';
import { User, Mail, Shield, BookOpen, CheckCircle2, Trophy, ArrowRight, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, Video } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface UserProfileProps {
  user: UserType;
  videos: Video[];
  lang: Language;
  onEdit?: () => void;
}

export const UserProfile = ({ user, videos, lang, onEdit }: UserProfileProps) => {
  const t = translations[lang];
  const [showCertificates, setShowCertificates] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);
  const isInstructor = user.role === 'Eğitmen';
  const progress = Math.round((user.completedLessons.length / videos.length) * 100);

  const instructorVideos = videos.filter(v => v.instructor === user.name);
  const displayVideos = isInstructor ? instructorVideos : videos;

  const certificates = [
    { id: '1', title: lang === 'tr' ? 'Temel Yer Hizmetleri Sertifikası' : 'Basic Ground Services Certificate', date: '15.01.2026', issuer: 'Pegasus Academy' },
    { id: '2', title: lang === 'tr' ? 'DCS Operatör Yetkinliği' : 'DCS Operator Competency', date: '02.02.2026', issuer: 'Pegasus Academy' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-orange-600 flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl shadow-orange-100 dark:shadow-none">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white dark:border-zinc-900 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{user.name}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
              <Shield className="w-4 h-4" />
              {user.role}
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-center md:justify-start">
            <button 
              onClick={onEdit}
              className="px-6 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
            >
              {lang === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}
            </button>
            {!isInstructor && (
              <button 
                onClick={() => setShowCertificates(true)}
                className="px-6 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                {lang === 'tr' ? 'Sertifikalarım' : 'My Certificates'}
              </button>
            )}
          </div>
        </div>

        {!isInstructor && (
          <div className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.progress}</span>
              <span className="text-lg font-serif font-bold text-orange-600">%{progress}</span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-orange-600"
              />
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center">
              {user.completedLessons.length} / {videos.length} {lang === 'tr' ? 'ders tamamlandı' : 'lessons completed'}
            </p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn("space-y-6", isInstructor ? "lg:col-span-3" : "lg:col-span-2")}>
          <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-orange-600" />
            {isInstructor 
              ? (lang === 'tr' ? 'Son Yüklediğim Videolar' : 'My Recently Uploaded Videos')
              : (lang === 'tr' ? 'Kayıtlı Kurslarım' : 'My Enrolled Courses')}
          </h3>
          
          <div className={cn("grid gap-4", isInstructor ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {displayVideos.map((video) => {
              const isCompleted = user.completedLessons.includes(video.id);
              return (
                <div key={video.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 group hover:border-orange-200 dark:hover:border-orange-900 transition-all">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-2xl">{video.emoji || '📺'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-orange-600 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{video.instructor}</p>
                  </div>
                  {!isInstructor && (
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.completed}
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">
                          {lang === 'tr' ? 'Devam Ediyor' : 'In Progress'}
                        </div>
                      )}
                      <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-400">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isInstructor && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              {lang === 'tr' ? 'Başarımlar' : 'Achievements'}
            </h3>
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              {[
                { 
                  id: '1', 
                  title: lang === 'tr' ? 'Hızlı Başlangıç' : 'Fast Start', 
                  desc: lang === 'tr' ? 'İlk dersini tamamladın' : 'Completed your first lesson', 
                  icon: '🚀', 
                  active: user.completedLessons.length > 0,
                  progress: user.completedLessons.length > 0 ? 100 : 0
                },
                { 
                  id: '2', 
                  title: lang === 'tr' ? 'Bilgi Küpü' : 'Knowledge Cube', 
                  desc: lang === 'tr' 
                    ? `${user.completedLessons.length}/5 testi başarıyla geçtin` 
                    : `Passed ${user.completedLessons.length}/5 quizzes successfully`, 
                  icon: '🧠', 
                  active: user.completedLessons.length >= 5,
                  progress: Math.min((user.completedLessons.length / 5) * 100, 100)
                },
                { 
                  id: '3', 
                  title: lang === 'tr' ? 'Sadık Öğrenci' : 'Loyal Student', 
                  desc: lang === 'tr' 
                    ? `${user.loginStreak}/7 gün üst üste giriş yaptın` 
                    : `Logged in for ${user.loginStreak}/7 consecutive days`, 
                  icon: '🔥', 
                  active: user.loginStreak >= 7,
                  progress: Math.min((user.loginStreak / 7) * 100, 100)
                },
              ].map(badge => (
                <div key={badge.id} className={cn(
                  "p-4 rounded-2xl border transition-all space-y-3",
                  badge.active ? "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800" : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 opacity-60"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn("text-2xl", !badge.active && "grayscale")}>{badge.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{badge.title}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{badge.desc}</p>
                    </div>
                    {badge.active && (
                      <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${badge.progress}%` }}
                      className={cn(
                        "h-full transition-all",
                        badge.active ? "bg-emerald-500" : "bg-orange-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              className="relative w-full max-w-4xl aspect-[1.414/1] bg-white dark:bg-zinc-50 rounded-sm shadow-2xl overflow-hidden p-12 flex flex-col items-center justify-between border-[16px] border-double border-orange-600/20"
            >
              {/* Certificate Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {/* Header */}
              <div className="text-center space-y-4 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">P</div>
                  <span className="text-xl font-serif font-bold text-zinc-900 tracking-widest uppercase">Pegasus Edu</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-zinc-900 uppercase tracking-[0.2em] border-b-2 border-orange-600 pb-4 inline-block">
                  {lang === 'tr' ? 'Başarı Sertifikası' : 'Certificate of Achievement'}
                </h2>
              </div>

              {/* Body */}
              <div className="text-center space-y-8 relative z-10">
                <p className="text-zinc-500 italic font-serif text-xl">
                  {lang === 'tr' ? 'Bu belge ile teyit edilir ki' : 'This is to certify that'}
                </p>
                <h1 className="text-6xl font-serif font-bold text-zinc-900 border-b border-zinc-200 pb-4 px-12">
                  {user.name}
                </h1>
                <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed text-lg">
                  {lang === 'tr' 
                    ? `"${selectedCertificate.title}" eğitimini başarıyla tamamlayarak bu sertifikayı almaya hak kazanmıştır.`
                    : `has successfully completed the "${selectedCertificate.title}" training and is hereby awarded this certificate.`}
                </p>
              </div>

              {/* Footer */}
              <div className="w-full flex items-end justify-between px-12 relative z-10">
                <div className="text-center space-y-2">
                  <div className="w-48 border-b border-zinc-300 pb-2">
                    <p className="font-serif italic text-zinc-800 text-lg">Pegasus Academy</p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {lang === 'tr' ? 'DÜZENLEYEN KURUM' : 'ISSUING INSTITUTION'}
                  </p>
                </div>

                <div className="relative">
                  <div className="w-24 h-24 border-4 border-orange-600/20 rounded-full flex items-center justify-center rotate-12">
                    <div className="w-20 h-20 border-2 border-orange-600/40 rounded-full flex items-center justify-center">
                      <Shield className="w-10 h-10 text-orange-600/60" />
                    </div>
                  </div>
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                    {lang === 'tr' ? 'RESMİ MÜHÜR' : 'OFFICIAL SEAL'}
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-48 border-b border-zinc-300 pb-2">
                    <p className="font-serif text-zinc-800 text-lg">{selectedCertificate.date}</p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {lang === 'tr' ? 'TARİH' : 'DATE'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}

        {showCertificates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificates(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                        {lang === 'tr' ? 'Sertifikalarım' : 'My Certificates'}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {lang === 'tr' ? 'Kazandığınız tüm yetkinlik belgeleri' : 'All competency documents you have earned'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCertificates(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {certificates.map(cert => (
                    <div key={cert.id} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Shield className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{cert.title}</h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{cert.issuer} • {cert.date}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedCertificate(cert)}
                        className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider"
                      >
                        {lang === 'tr' ? 'Görüntüle' : 'View'}
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowCertificates(false)}
                  className="mt-8 w-full py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
                >
                  {lang === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { Play, Clock, User, Star, CheckCircle2, HelpCircle, RefreshCw, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Quiz } from '../types';
import { QuizModal } from './QuizModal';
import { VideoPlayerModal } from './VideoPlayerModal';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface VideoGalleryProps {
  videos: Video[];
  completedLessons: string[];
  onComplete: (id: string) => void;
  onUpdateThumbnail?: (id: string, url: string) => void;
  isInstructor?: boolean;
  lang: Language;
}

export const VideoGallery = ({ videos, completedLessons, onComplete, onUpdateThumbnail, isInstructor, lang }: VideoGalleryProps) => {
  const t = translations[lang];
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ title: string; emoji?: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const handleQuizComplete = (videoId: string) => {
    onComplete(videoId);
  };

  const handleStartEdit = (video: Video) => {
    setEditingId(video.id);
    setEditUrl(video.thumbnail);
  };

  const handleSaveEdit = (id: string) => {
    if (onUpdateThumbnail) {
      onUpdateThumbnail(id, editUrl);
    }
    setEditingId(null);
  };

  const recentUpdates = [
    { id: '1', title: lang === 'tr' ? 'Bagaj Ücretleri Güncellendi' : 'Baggage Fees Updated', desc: lang === 'tr' ? '2026 yılı yeni bagaj ücretleri ve uygulama esasları.' : 'Detailed training on 2026 new baggage fees.', date: '18.03.2026', type: 'update', emoji: '🧳' },
    { id: '2', title: lang === 'tr' ? 'Çoklu Dil Desteği' : 'Multi-language Support', desc: lang === 'tr' ? 'Platform artık İngilizce ve Türkçe olarak kullanılabilir.' : 'Platform can now be used in English and Turkish.', date: '17.03.2026', type: 'feature', emoji: '🌐' },
    { id: '3', title: lang === 'tr' ? 'DCS Hata Kütüphanesi' : 'DCS Error Library', desc: lang === 'tr' ? 'Sık karşılaşılan DCS hata kodları ve çözümleri.' : 'Common DCS error codes and solutions.', date: '16.03.2026', type: 'update', emoji: '📚' },
  ];

  return (
    <div className="space-y-12">
      {/* ... existing New Features Section ... */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.newFeature}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold leading-tight">{t.newFeatures}</h2>
            <p className="text-orange-50/80 max-w-lg">{t.newFeaturesDesc}</p>
            <button 
              onClick={() => setShowAllUpdates(!showAllUpdates)}
              className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", showAllUpdates && "animate-spin")} />
              {t.updateContent}
            </button>
          </div>
          
          <div className="w-full lg:w-[450px] space-y-4">
            <AnimatePresence mode="wait">
              {!showAllUpdates ? (
                <motion.div 
                  key="featured"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-8xl">🧳</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-orange-600 fill-orange-600 ml-1" />
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-md">15:00</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:translate-x-1 transition-transform">{t.baggageFeesUpdated}</h3>
                    <p className="text-xs text-orange-50/70 leading-relaxed mb-4">{t.baggageFeesUpdatedDesc}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVideo({ title: t.baggageFeesUpdated, emoji: '🧳' });
                      }}
                      className="w-full py-2.5 bg-white text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors"
                    >
                      {t.viewContent}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3"
                >
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                          update.type === 'feature' ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"
                        )}>
                          {update.type === 'feature' ? t.newFeature : t.update}
                        </span>
                        <span className="text-[8px] text-white/40">{update.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{update.title}</h4>
                      <p className="text-[10px] text-white/60 line-clamp-1">{update.desc}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo({ title: update.title, emoji: update.emoji });
                        }}
                        className="mt-2 text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1"
                      >
                        {t.viewContent}
                        <Play className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{t.courseVideos}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">{t.continueWhereLeft}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{t.progress}</p>
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">%{Math.round((completedLessons.length / videos.length) * 100)}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="24" cy="24" r="20"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                className="text-orange-600"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - completedLessons.length / videos.length)}
              />
            </svg>
            <CheckCircle2 className="absolute w-4 h-4 text-orange-600" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => {
          const isCompleted = completedLessons.includes(video.id);
          const hasQuiz = !!video.quiz;
          const isEditing = editingId === video.id;

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border transition-all shadow-sm hover:shadow-md",
                isCompleted ? "border-emerald-100 dark:border-emerald-900/30" : "border-zinc-200 dark:border-zinc-800"
              )}
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                  {video.emoji || '📺'}
                </span>
                
                {isInstructor && !isEditing && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(video);
                    }}
                    className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm z-20 transition-colors"
                    title={t.editThumbnail}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                <div 
                  onClick={() => setActiveVideo({ title: video.title, emoji: video.emoji })}
                  className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-zinc-900 dark:text-white fill-current ml-1" />
                  </div>
                </div>
                {isCompleted && (
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                {isEditing ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{t.thumbnailUrl}</label>
                      <input 
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                        placeholder="https://..."
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSaveEdit(video.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {t.save}
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        {lang === 'tr' ? video.category : (video.category === 'Operasyon' ? 'Operation' : video.category === 'Sistem' ? 'System' : 'Service')}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{video.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-zinc-900 dark:text-white leading-tight group-hover:text-orange-600 transition-colors">
                      {lang === 'tr' ? video.title : (
                        video.id === '1' ? 'Baggage Acceptance Procedures' :
                        video.id === '2' ? 'Dangerous Goods (DGR) Awareness' :
                        video.id === '3' ? 'Advanced DCS Check-in' :
                        video.id === '4' ? 'Passenger Boarding Rules' :
                        video.id === '5' ? 'Special Passenger Services' :
                        video.id === '6' ? 'Emergency Procedures' :
                        video.id === '7' ? 'Flight Irregularity Management' :
                        'Security Awareness'
                      )}
                    </h3>
                    
                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-xs">{video.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{video.duration}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      {hasQuiz && (
                        <button 
                          onClick={() => setActiveQuiz(video.quiz!)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold transition-colors border border-zinc-100 dark:border-zinc-700"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          {t.takeQuiz}
                        </button>
                      )}
                      {isCompleted ? (
                        <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.completed}
                        </div>
                      ) : (
                        <button 
                          onClick={() => onComplete(video.id)}
                          className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-100 dark:shadow-none"
                        >
                          {t.finish}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeQuiz && (
          <QuizModal 
            quiz={activeQuiz} 
            onClose={() => setActiveQuiz(null)} 
            onComplete={() => handleQuizComplete(activeQuiz.videoId)}
          />
        )}
        {activeVideo && (
          <VideoPlayerModal 
            video={activeVideo} 
            onClose={() => setActiveVideo(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

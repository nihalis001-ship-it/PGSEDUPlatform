import React, { useState } from 'react';
import { Play, Clock, User, Star, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Quiz } from '../types';
import { QuizModal } from './QuizModal';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

const QUIZZES: Record<string, Quiz> = {
  '1': {
    id: 'q1',
    videoId: '1',
    questions: [
      { id: '1', text: 'React hangi şirket tarafından geliştirilmiştir?', options: ['Google', 'Meta (Facebook)', 'Microsoft', 'Amazon'], correctAnswer: 1 },
      { id: '2', text: 'Hangisi bir React Hook\'udur?', options: ['useEffect', 'useAction', 'useEvent', 'useStore'], correctAnswer: 0 },
    ]
  },
  '2': {
    id: 'q2',
    videoId: '2',
    questions: [
      { id: '1', text: 'UX neyin kısaltmasıdır?', options: ['User Experience', 'User Extension', 'Universal X-platform', 'User Example'], correctAnswer: 0 },
    ]
  }
};

interface VideoGalleryProps {
  videos: Video[];
  completedLessons: string[];
  onComplete: (id: string) => void;
  lang: Language;
}

export const VideoGallery = ({ videos, completedLessons, onComplete, lang }: VideoGalleryProps) => {
  const t = translations[lang];
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleQuizComplete = (videoId: string) => {
    onComplete(videoId);
  };

  return (
    <div className="space-y-12">
      {/* New Features Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.newFeature}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold leading-tight">{t.newFeatures}</h2>
            <p className="text-orange-50/80 max-w-lg">{t.newFeaturesDesc}</p>
          </div>
          
          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-orange-600 fill-orange-600 ml-1" />
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-md">15:00</span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:translate-x-1 transition-transform">{t.baggageFeesUpdated}</h3>
            <p className="text-xs text-orange-50/70 leading-relaxed mb-4">{t.baggageFeesUpdatedDesc}</p>
            <button className="w-full py-2.5 bg-white text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors">
              {t.viewContent}
            </button>
          </div>
        </div>
      </section>

      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900">{t.courseVideos}</h2>
          <p className="text-zinc-500 mt-2">{t.continueWhereLeft}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">{t.progress}</p>
            <p className="text-sm font-bold text-orange-600">%{Math.round((completedLessons.length / videos.length) * 100)}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-zinc-100 flex items-center justify-center relative">
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
          const hasQuiz = !!QUIZZES[video.id];

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group bg-white rounded-2xl overflow-hidden border transition-all shadow-sm hover:shadow-md",
                isCompleted ? "border-emerald-100" : "border-zinc-200"
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-zinc-900 fill-zinc-900 ml-1" />
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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {lang === 'tr' ? video.category : (video.category === 'Operasyon' ? 'Operation' : video.category === 'Sistem' ? 'System' : 'Service')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-zinc-600">{video.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors">
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
                
                <div className="flex items-center gap-4 pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs">{video.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{video.duration}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  {hasQuiz && (
                    <button 
                      onClick={() => setActiveQuiz(QUIZZES[video.id])}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold transition-colors border border-zinc-100"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {t.takeQuiz}
                    </button>
                  )}
                  {isCompleted ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.completed}
                    </div>
                  ) : (
                    <button 
                      onClick={() => onComplete(video.id)}
                      className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-100"
                    >
                      {t.finish}
                    </button>
                  )}
                </div>
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
      </AnimatePresence>
    </div>
  );
};

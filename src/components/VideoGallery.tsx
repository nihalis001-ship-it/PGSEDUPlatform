import React, { useState } from 'react';
import { Play, Clock, User, Star, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Quiz } from '../types';
import { QuizModal } from './QuizModal';
import { cn } from '../lib/utils';

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
}

export const VideoGallery = ({ videos, completedLessons, onComplete }: VideoGalleryProps) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleQuizComplete = (videoId: string) => {
    onComplete(videoId);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900">Eğitim Videoları</h2>
          <p className="text-zinc-500 mt-2">Kaldığın yerden devam et veya yeni bir şeyler öğren.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">İlerleme</p>
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
                    {video.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-zinc-600">{video.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors">
                  {video.title}
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
                      Testi Çöz
                    </button>
                  )}
                  {isCompleted ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tamamlandı
                    </div>
                  ) : (
                    <button 
                      onClick={() => onComplete(video.id)}
                      className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-100"
                    >
                      Bitir
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

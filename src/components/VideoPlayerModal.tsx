import React from 'react';
import { X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerModalProps {
  video: {
    title: string;
    url?: string;
    emoji?: string;
  };
  onClose: () => void;
}

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 hover:opacity-100 transition-opacity">
          <h3 className="text-white font-bold text-lg">{video.title}</h3>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Placeholder / Player */}
        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white/60 font-medium">Video yükleniyor...</p>
          </div>
          
          {/* In a real app, this would be an <iframe /> or <video /> tag */}
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-[200px]">{video.emoji || '📺'}</span>
             </div>
             <div className="relative z-10 text-center px-6">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{video.title}</h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">Bu eğitim videosu şu an hazırlık aşamasındadır. Simülasyon gereği görselleştirme yapılmaktadır.</p>
             </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-6 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div className="w-1/3 h-full bg-orange-600 rounded-full" />
          </div>
          <div className="flex items-center gap-4 text-white">
            <Volume2 className="w-5 h-5 cursor-pointer" />
            <Maximize2 className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

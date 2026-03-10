import React from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../i18n';

interface MandatoryNotificationProps {
  lang: Language;
  onClose: () => void;
}

export const MandatoryNotification = ({ lang, onClose }: MandatoryNotificationProps) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200"
      >
        <div className="bg-orange-600 p-8 flex flex-col items-center text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold">{t.mandatoryNotification}</h2>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-zinc-600 leading-relaxed text-center font-medium">
            {t.mandatoryNotificationDesc}
          </p>
          
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-tight">
              {lang === 'tr' 
                ? 'Bu bildirimi onaylayarak güncel prosedürleri okuduğunuzu ve anladığınızı beyan etmiş olursunuz.' 
                : 'By confirming this notification, you declare that you have read and understood the current procedures.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-zinc-200 flex items-center justify-center gap-2"
          >
            {t.understand}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

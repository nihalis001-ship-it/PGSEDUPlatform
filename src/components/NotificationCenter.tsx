import React from 'react';
import { Bell, Info, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../i18n';

interface Notification {
  id: string;
  type: 'feature' | 'update';
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  date: string;
  link?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'feature',
    title: { tr: 'Çoklu Dil Desteği Eklendi', en: 'Multi-language Support Added' },
    description: { tr: 'Artık EduPlan\'ı İngilizce ve Türkçe olarak kullanabilirsiniz.', en: 'You can now use EduPlan in English and Turkish.' },
    date: 'Bugün',
  },
  {
    id: '2',
    type: 'update',
    title: { tr: 'DCS Hata Kütüphanesi', en: 'DCS Error Library' },
    description: { tr: 'Sık karşılaşılan DCS hata kodları ve çözümleri sisteme eklendi.', en: 'Common DCS error codes and solutions added to the system.' },
    date: 'Dün',
  }
];

interface NotificationCenterProps {
  lang: Language;
  onClose: () => void;
}

export const NotificationCenter = ({ lang, onClose }: NotificationCenterProps) => {
  const t = translations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 z-50 overflow-hidden"
    >
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <h3 className="font-serif font-bold text-zinc-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-600" />
          {t.notifications}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded-full transition-colors">
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {NOTIFICATIONS.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="p-5 hover:bg-zinc-50 transition-colors space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {notif.type === 'feature' ? (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {notif.type === 'feature' ? t.newFeature : t.update}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{notif.date}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900">{notif.title[lang]}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{notif.description[lang]}</p>
                <button className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wider">
                  {t.viewContent}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-zinc-200 mx-auto" />
            <p className="text-sm text-zinc-400">{t.noNotifications}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

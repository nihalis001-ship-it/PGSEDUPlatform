import { Bell, Info, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../i18n';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  lang: Language;
  notifications: AppNotification[];
  onClose: () => void;
  onNavigate: (tab: any) => void;
}

export const NotificationCenter = ({ lang, notifications, onClose, onNavigate }: NotificationCenterProps) => {
  const t = translations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
    >
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
        <h3 className="font-serif font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-600" />
          {t.notifications}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {notif.type === 'feature' ? (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      {notif.type === 'feature' ? t.newFeature : t.update}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{notif.date}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{notif.title[lang]}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{notif.description[lang]}</p>
                {notif.targetTab && (
                  <button 
                    onClick={() => {
                      onNavigate(notif.targetTab);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wider"
                  >
                    {t.viewContent}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
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

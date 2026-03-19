import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bell, 
  Lock, 
  Globe, 
  Eye, 
  Shield,
  Smartphone,
  HelpCircle,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  lang: Language;
  user: User;
  onUpdateUser: (user: User) => void;
  onUpdateLang: (lang: Language) => void;
}

type SettingsSection = 'profile' | 'password' | 'notifications' | 'preferences' | null;

export const Settings = ({ lang, user, onUpdateUser, onUpdateLang }: SettingsProps) => {
  const t = translations[lang];
  const [activeSection, setActiveSection] = useState<SettingsSection>(null);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSave = () => {
    if (activeSection === 'profile') {
      if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert(lang === 'tr' ? 'Yeni şifreler eşleşmiyor!' : 'New passwords do not match!');
          return;
        }
        if (formData.newPassword.length < 6) {
          alert(lang === 'tr' ? 'Şifre en az 6 karakter olmalıdır!' : 'Password must be at least 6 characters!');
          return;
        }
      }

      setSaveStatus('saving');
      setTimeout(() => {
        onUpdateUser({
          ...user,
          name: formData.name,
          email: formData.email
        });
        setSaveStatus('success');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    } else {
      setSaveStatus('saving');
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    }
  };

  const toggleTheme = () => {
    onUpdateUser({
      ...user,
      preferences: {
        ...user.preferences,
        theme: user.preferences.theme === 'light' ? 'dark' : 'light'
      }
    });
  };

  const toggleNotifications = () => {
    onUpdateUser({
      ...user,
      preferences: {
        ...user.preferences,
        emailNotifications: !user.preferences.emailNotifications
      }
    });
  };

  const sections = [
    {
      id: 'profile',
      title: t.accountSettings,
      icon: UserIcon,
      items: [
        { id: 'profile', label: t.profileInfo, desc: lang === 'tr' ? 'Ad, soyad ve e-posta adresini güncelle' : 'Update name, surname and email' },
        { id: 'password', label: t.changePassword, desc: lang === 'tr' ? 'Hesap güvenliğini sağla' : 'Ensure account security' },
      ]
    },
    {
      id: 'notifications',
      title: t.notifications,
      icon: Bell,
      items: [
        { id: 'notifications', label: t.emailNotifications, desc: lang === 'tr' ? 'Eğitim güncellemelerini e-posta ile al' : 'Receive course updates via email' },
      ]
    },
    {
      id: 'preferences',
      title: t.preferences,
      icon: Globe,
      items: [
        { id: 'lang', label: t.language, desc: lang === 'tr' ? 'Uygulama dilini değiştir' : 'Change application language' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{t.settings}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {lang === 'tr' ? 'Uygulama tercihlerini ve hesap ayarlarını buradan yönetebilirsin.' : 'Manage your application preferences and account settings here.'}
          </p>
        </div>
        <AnimatePresence>
          {saveStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800"
            >
              <Check className="w-4 h-4" />
              {t.saved}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as SettingsSection)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group",
                activeSection === section.id 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-none" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-orange-200 dark:hover:border-orange-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              )}
            >
              <section.icon className={cn(
                "w-5 h-5",
                activeSection === section.id ? "text-white" : "text-zinc-400 group-hover:text-orange-600 transition-colors"
              )} />
              <span className="font-bold text-sm">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
                {!activeSection ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                  <SettingsIcon className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white">
                  {lang === 'tr' ? 'Bir bölüm seçin' : 'Select a section'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  {lang === 'tr' ? 'Düzenlemek istediğiniz ayar kategorisini soldan seçebilirsiniz.' : 'Select a setting category from the left to edit.'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-8"
              >
                {activeSection === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                          {t.fullName}
                        </label>
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                          {t.email}
                        </label>
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                      <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-orange-600" />
                        {t.changePassword}
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                            {t.currentPassword}
                          </label>
                          <input 
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                              {t.newPassword}
                            </label>
                            <input 
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                              {t.confirmNewPassword}
                            </label>
                            <input 
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-700">
                          <Mail className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {lang === 'tr' ? 'E-posta Bildirimleri' : 'Email Notifications'}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {lang === 'tr' ? 'Önemli güncellemeleri mail ile al' : 'Get important updates via mail'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleNotifications}
                        className={cn(
                          "w-14 h-7 rounded-full transition-all relative",
                          user.preferences.emailNotifications ? "bg-orange-600" : "bg-zinc-300 dark:bg-zinc-700"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm",
                          user.preferences.emailNotifications ? "left-8" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'preferences' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">
                        {lang === 'tr' ? 'Uygulama Dili' : 'Application Language'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => onUpdateLang('tr')}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold",
                            lang === 'tr' 
                              ? "border-orange-600 bg-orange-50 dark:bg-orange-900/10 text-orange-600" 
                              : "border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-200 dark:hover:border-zinc-700"
                          )}
                        >
                          <span className="text-2xl">🇹🇷</span>
                          Türkçe
                        </button>
                        <button 
                          onClick={() => onUpdateLang('en')}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold",
                            lang === 'en' 
                              ? "border-orange-600 bg-orange-50 dark:bg-orange-900/10 text-orange-600" 
                              : "border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-200 dark:hover:border-zinc-700"
                          )}
                        >
                          <span className="text-2xl">🇬🇧</span>
                          English
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                  <button 
                    onClick={() => setActiveSection(null)}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t.close}
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {saveStatus === 'saving' ? t.saving : t.saveChanges}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

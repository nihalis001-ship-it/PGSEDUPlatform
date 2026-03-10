import React from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Eye, 
  Shield,
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface SettingsProps {
  lang: Language;
}

export const Settings = ({ lang }: SettingsProps) => {
  const t = translations[lang];

  const sections = [
    {
      title: lang === 'tr' ? 'Hesap Ayarları' : 'Account Settings',
      icon: User,
      items: [
        { label: lang === 'tr' ? 'Profil Bilgileri' : 'Profile Information', desc: lang === 'tr' ? 'Ad, soyad ve e-posta adresini güncelle' : 'Update name, surname and email' },
        { label: lang === 'tr' ? 'Şifre Değiştir' : 'Change Password', desc: lang === 'tr' ? 'Hesap güvenliğini sağla' : 'Ensure account security' },
      ]
    },
    {
      title: lang === 'tr' ? 'Bildirimler' : 'Notifications',
      icon: Bell,
      items: [
        { label: lang === 'tr' ? 'E-posta Bildirimleri' : 'Email Notifications', desc: lang === 'tr' ? 'Eğitim güncellemelerini e-posta ile al' : 'Receive course updates via email' },
        { label: lang === 'tr' ? 'Anlık Bildirimler' : 'Push Notifications', desc: lang === 'tr' ? 'Mobil ve web üzerinden anlık bilgi al' : 'Get instant info via mobile and web' },
      ]
    },
    {
      title: lang === 'tr' ? 'Tercihler' : 'Preferences',
      icon: Globe,
      items: [
        { label: t.language, desc: lang === 'tr' ? 'Uygulama dilini değiştir' : 'Change application language' },
        { label: lang === 'tr' ? 'Görünüm' : 'Appearance', desc: lang === 'tr' ? 'Koyu veya açık tema seçimi' : 'Dark or light theme selection' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-zinc-900">{t.settings}</h2>
        <p className="text-zinc-500 mt-1">{lang === 'tr' ? 'Uygulama tercihlerini ve hesap ayarlarını buradan yönetebilirsin.' : 'Manage your application preferences and account settings here.'}</p>
      </header>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <section key={idx} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <section.icon className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-zinc-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left group"
                >
                  <div>
                    <p className="font-medium text-zinc-900 group-hover:text-orange-600 transition-colors">{item.label}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                  <HelpCircle className="w-5 h-5 text-zinc-300 group-hover:text-zinc-400" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-8 border-t border-zinc-200 flex justify-end gap-4">
        <button className="px-6 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors">
          {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
        </button>
        <button className="px-6 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200">
          {lang === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

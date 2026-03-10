import React, { useState } from 'react';
import { VideoGallery } from './components/VideoGallery';
import { LessonPlanner } from './components/LessonPlanner';
import { RequestTab } from './components/RequestTab';
import { UserProfile } from './components/UserProfile';
import { ErrorLibrary } from './components/ErrorLibrary';
import { Settings as SettingsTab } from './components/Settings';
import { NotificationCenter } from './components/NotificationCenter';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { 
  LayoutDashboard, 
  Video, 
  Calendar, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  GraduationCap,
  PlusCircle,
  User as UserIcon,
  AlertTriangle,
  Globe,
  Clock,
  Upload,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { User, Video as VideoType, LessonRequest } from './types';
import { Language, translations } from './i18n';

const INITIAL_REQUESTS: LessonRequest[] = [
  { id: '1', title: 'Bagaj Kabul Pratiği', instructorId: '1', studentName: 'Nihal Işık', dates: ['2026-03-12'], status: 'approved' },
  { id: '2', title: 'DCS Hata Çözümleri', instructorId: '2', studentName: 'Nihal Işık', dates: ['2026-03-15'], status: 'pending' }
];

type Tab = 'videos' | 'planner' | 'dashboard' | 'request' | 'profile' | 'errors' | 'settings' | 'ai' | 'upcoming' | 'upload' | 'stations';

const VIDEOS: VideoType[] = [
  { id: '1', title: 'SSR (Özel Hizmet Talebi) Ekleme', instructor: 'Simge Demir', duration: '15:20', thumbnail: 'https://picsum.photos/seed/ssr/800/450', category: 'Check-in', rating: 4.8 },
  { id: '2', title: 'Bagaj Ekleme ve Etiketleme', instructor: 'Cafer Yılmaz', duration: '12:15', thumbnail: 'https://picsum.photos/seed/baggage/800/450', category: 'Check-in', rating: 4.9 },
  { id: '3', title: 'Online Check-inli Yolcu Kabulü', instructor: 'Cemile Kaya', duration: '18:10', thumbnail: 'https://picsum.photos/seed/online/800/450', category: 'Boarding', rating: 4.7 },
  { id: '4', title: 'Boarding Süreçleri ve Kapı Yönetimi', instructor: 'Simge Demir', duration: '25:45', thumbnail: 'https://picsum.photos/seed/boarding/800/450', category: 'Boarding', rating: 4.6 },
  { id: '5', title: 'APIS Bilgileri ve Pasaport Kontrol', instructor: 'Cafer Yılmaz', duration: '22:30', thumbnail: 'https://picsum.photos/seed/passport/800/450', category: 'Check-in', rating: 5.0 },
  { id: '6', title: 'Engelli Yolcu (WCHC) Prosedürleri', instructor: 'Cemile Kaya', duration: '20:00', thumbnail: 'https://picsum.photos/seed/disabled/800/450', category: 'Özel Hizmet', rating: 4.8 },
  { id: '7', title: 'Etkili İletişim ve Beden Dili', instructor: 'Simge Demir', duration: '10:00', thumbnail: 'https://picsum.photos/seed/communication/800/450', category: 'Kişisel Gelişim', rating: 4.5 },
  { id: '8', title: 'Zaman Yönetimi ve Planlama', instructor: 'Cafer Yılmaz', duration: '08:30', thumbnail: 'https://picsum.photos/seed/time/800/450', category: 'Kişisel Gelişim', rating: 4.4 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<Language>('tr');
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<User>({
    name: 'Nihal Işık',
    email: 'nihalis001@gmail.com',
    role: 'Öğrenci',
    avatar: 'NS',
    enrolledCourses: ['1', '2', '3', '4', '5', '6', '7', '8'],
    completedLessons: ['1']
  });

  const [requests, setRequests] = useState<LessonRequest[]>(INITIAL_REQUESTS);

  const t = translations[lang];

  const handleCompleteLesson = (id: string) => {
    if (!user.completedLessons.includes(id)) {
      setUser(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, id]
      }));
    }
  };

  const handleAddRequest = (newRequest: LessonRequest) => {
    setRequests(prev => [...prev, newRequest]);
  };

  const handleUpdateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const toggleRole = () => {
    setUser(prev => {
      const newRole = prev.role === 'Öğrenci' ? 'Eğitmen' : 'Öğrenci';
      setActiveTab(newRole === 'Öğrenci' ? 'dashboard' : 'upcoming');
      return {
        ...prev,
        role: newRole,
        avatar: newRole === 'Öğrenci' ? 'NS' : 'ED',
        name: newRole === 'Öğrenci' ? 'Nihal Işık' : 'Simge Demir'
      };
    });
  };

  const navItems = user.role === 'Öğrenci' ? [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'videos', label: t.videos, icon: Video },
    { id: 'planner', label: t.planner, icon: Calendar },
    { id: 'request', label: 'Randevu Talebi', icon: Clock },
    { id: 'errors', label: t.errorLibrary, icon: AlertTriangle },
    { id: 'ai', label: t.aiAssistant, icon: Globe },
    { id: 'profile', label: t.profile, icon: UserIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ] : [
    { id: 'upcoming', label: t.upcomingLessons, icon: Calendar },
    { id: 'upload', label: t.uploadVideo, icon: Upload },
    { id: 'stations', label: t.assignedStations, icon: MapPin },
    { id: 'profile', label: t.profile, icon: UserIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-5 flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 overflow-hidden">
            <img 
              src="https://www.flypgs.com/assets/images/logo/pegasus-logo.svg" 
              alt="Pegasus" 
              className="w-8 h-8 object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/pegasus/100/100';
              }}
            />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-zinc-900">Pegasus Edu</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0 scrollbar-hide">
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.id 
                    ? "bg-orange-50 text-orange-600 shadow-sm" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  activeTab === item.id ? "text-orange-600" : "text-zinc-400 group-hover:text-zinc-600"
                )} />
                <span className="truncate">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-100 space-y-2 shrink-0 bg-white">
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <Globe className="w-3 h-3" />
              {t.language}
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setLang('tr')}
                className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lang === 'tr' ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-zinc-600")}
              >
                TR
              </button>
              <button 
                onClick={() => setLang('en')}
                className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lang === 'en' ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-zinc-600")}
              >
                EN
              </button>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full bg-zinc-50 rounded-xl p-3 space-y-2 transition-all hover:bg-zinc-100 text-left",
              activeTab === 'profile' && "ring-2 ring-orange-600 ring-offset-2"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.role}</p>
              </div>
            </div>
          </button>
          <button 
            onClick={toggleRole}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <UserIcon className="w-3 h-3" />
            Rol Değiştir
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-red-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-xl transition-colors relative",
                showNotifications ? "bg-orange-50 text-orange-600" : "text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationCenter lang={lang} onClose={() => setShowNotifications(false)} />
              )}
            </AnimatePresence>
            <div className="h-8 w-px bg-zinc-200 mx-2"></div>
            <button 
              onClick={() => setActiveTab('request')}
              className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200"
            >
              {t.newPlan}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  user={user} 
                  videos={VIDEOS} 
                  onNavigate={(tab) => setActiveTab(tab as Tab)} 
                />
              )}
              {activeTab === 'videos' && (
                <VideoGallery 
                  videos={VIDEOS} 
                  completedLessons={user.completedLessons}
                  onComplete={handleCompleteLesson}
                />
              )}
              {activeTab === 'planner' && <LessonPlanner />}
              {activeTab === 'request' && (
                <RequestTab 
                  lang={lang} 
                  user={user} 
                  requests={requests}
                  onAddRequest={handleAddRequest}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              )}
              {activeTab === 'profile' && <UserProfile user={user} videos={VIDEOS} />}
              {activeTab === 'errors' && <ErrorLibrary lang={lang} />}
              {activeTab === 'settings' && <SettingsTab lang={lang} />}
              {activeTab === 'ai' && <AIAssistant />}
              {activeTab === 'upcoming' && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">{t.upcomingLessons}</h2>
                  <p className="text-zinc-500">Henüz planlanmış bir eğitiminiz bulunmamaktadır.</p>
                </div>
              )}
              {activeTab === 'upload' && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">{t.uploadVideo}</h2>
                  <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400">
                    <Upload className="w-12 h-12 mb-4" />
                    <p className="font-medium">Video dosyasını buraya sürükleyin veya seçin</p>
                  </div>
                </div>
              )}
              {activeTab === 'stations' && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">{t.assignedStations}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['SAW', 'ESB', 'ADB'].map(code => (
                      <div key={code} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 font-bold text-zinc-700 text-center">
                        {code} İstasyonu
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

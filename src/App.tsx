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
import { QuickReference } from './components/QuickReference';
import { CheckInPerformance } from './components/CheckInPerformance';
import { Login } from './components/Login';
import { MandatoryNotification } from './components/MandatoryNotification';
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
  Briefcase,
  User as UserIcon,
  AlertTriangle,
  Globe,
  Clock,
  Upload,
  TrendingUp,
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

type Tab = 'videos' | 'planner' | 'dashboard' | 'request' | 'profile' | 'errors' | 'settings' | 'ai' | 'upcoming' | 'upload' | 'stations' | 'quick' | 'performance';

const INITIAL_VIDEOS: VideoType[] = [
  { id: '1', title: 'Bagaj Kabul ve Etiketleme Prosedürleri', instructor: 'Simge Demir', duration: '15:20', thumbnail: 'https://picsum.photos/seed/baggage/800/450', category: 'Check-in', rating: 4.8 },
  { id: '2', title: 'Fazla Bagaj ve Ücretlendirme Kuralları', instructor: 'Cafer Yılmaz', duration: '12:15', thumbnail: 'https://picsum.photos/seed/excess/800/450', category: 'Check-in', rating: 4.9 },
  { id: '3', title: 'Özel Yolcu ve Refakatçi Limitleri', instructor: 'Cemile Kaya', duration: '18:10', thumbnail: 'https://picsum.photos/seed/special/800/450', category: 'Özel Hizmet', rating: 4.7 },
  { id: '4', title: 'Canlı Hayvan (PETC/AVIH) Kabulü', instructor: 'Simge Demir', duration: '25:45', thumbnail: 'https://picsum.photos/seed/pets/800/450', category: 'Operasyon', rating: 4.6 },
  { id: '5', title: 'Tehlikeli Maddeler ve NOTOC Formu', instructor: 'Cafer Yılmaz', duration: '22:30', thumbnail: 'https://picsum.photos/seed/dgr/800/450', category: 'Operasyon', rating: 5.0 },
  { id: '6', title: 'Silah Taşıma ve Güvenlik Prosedürleri', instructor: 'Cemile Kaya', duration: '20:00', thumbnail: 'https://picsum.photos/seed/weapons/800/450', category: 'Güvenlik', rating: 4.8 },
  { id: '7', title: 'Check-in Zamanları ve Koltuk Atama', instructor: 'Simge Demir', duration: '10:00', thumbnail: 'https://picsum.photos/seed/seating/800/450', category: 'Check-in', rating: 4.5 },
  { id: '8', title: 'İnsani Yük (HUM) ve Özel Kargolar', instructor: 'Cafer Yılmaz', duration: '08:30', thumbnail: 'https://picsum.photos/seed/hum/800/450', category: 'Operasyon', rating: 4.4 },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMandatoryPopup, setShowMandatoryPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<Language>('tr');
  const [showNotifications, setShowNotifications] = useState(false);
  const [videos, setVideos] = useState<VideoType[]>(INITIAL_VIDEOS);
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

  const handleLogin = (name: string, role: 'Öğrenci' | 'Eğitmen') => {
    setUser(prev => ({
      ...prev,
      name,
      role,
      avatar: role === 'Öğrenci' ? 'NS' : 'ED',
      email: role === 'Öğrenci' ? 'nihalis001@gmail.com' : 'simge.demir@flypgs.com'
    }));
    setIsLoggedIn(true);
    setShowMandatoryPopup(true);
    setActiveTab(role === 'Öğrenci' ? 'dashboard' : 'upcoming');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

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

  const handleUpdateRequestStatus = (id: string, status: 'approved' | 'rejected', rejectionReason?: string, alternativeDate?: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status, rejectionReason, alternativeDate } : req));
  };

  const navItems = user.role === 'Öğrenci' ? [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'videos', label: t.videos, icon: Video },
    { id: 'quick', label: t.quickReference, icon: Briefcase },
    { id: 'planner', label: t.planner, icon: Calendar },
    { id: 'request', label: 'Randevu Talebi', icon: Clock },
    { id: 'errors', label: t.errorLibrary, icon: AlertTriangle },
    { id: 'ai', label: t.aiAssistant, icon: Globe },
    { id: 'profile', label: t.profile, icon: UserIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ] : [
    { id: 'upcoming', label: t.upcomingLessons, icon: Calendar },
    { id: 'performance', label: t.checkInPerformance, icon: TrendingUp },
    { id: 'upload', label: t.uploadVideo, icon: Upload },
    { id: 'stations', label: t.assignedStations, icon: MapPin },
    { id: 'profile', label: t.profile, icon: UserIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

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
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-red-600 transition-colors"
          >
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
                  videos={videos} 
                  onNavigate={(tab) => setActiveTab(tab as Tab)} 
                  lang={lang}
                />
              )}
              {activeTab === 'videos' && (
                <VideoGallery 
                  videos={videos} 
                  completedLessons={user.completedLessons}
                  onComplete={handleCompleteLesson}
                  lang={lang}
                />
              )}
              {activeTab === 'planner' && <LessonPlanner lang={lang} />}
              {activeTab === 'request' && (
                <RequestTab 
                  lang={lang} 
                  user={user} 
                  requests={requests}
                  onAddRequest={handleAddRequest}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              )}
              {activeTab === 'profile' && <UserProfile user={user} videos={videos} lang={lang} />}
              {activeTab === 'errors' && <ErrorLibrary lang={lang} />}
              {activeTab === 'settings' && <SettingsTab lang={lang} />}
              {activeTab === 'ai' && <AIAssistant lang={lang} />}
              {activeTab === 'quick' && <QuickReference lang={lang} />}
              {activeTab === 'performance' && <CheckInPerformance lang={lang} />}
              {activeTab === 'upcoming' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-6 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-orange-600" />
                      {t.upcomingLessons}
                    </h2>
                    <div className="space-y-4">
                      {requests.filter(r => r.status === 'approved' && (user.role === 'Eğitmen' ? true : r.studentName === user.name)).length === 0 ? (
                        <p className="text-zinc-500">Henüz planlanmış bir eğitiminiz bulunmamaktadır.</p>
                      ) : (
                        requests.filter(r => r.status === 'approved' && (user.role === 'Eğitmen' ? true : r.studentName === user.name)).map(req => (
                          <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                            <div className="space-y-2">
                              <h4 className="font-bold text-zinc-900">{req.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-zinc-500">
                                <div className="flex items-center gap-1.5">
                                  <UserIcon className="w-3.5 h-3.5" />
                                  {req.studentName}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {req.dates.join(', ')}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {req.time}
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Onaylandı</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {user.role === 'Eğitmen' && (
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                      <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6 flex items-center gap-3">
                        <Bell className="w-6 h-6 text-orange-600" />
                        Bekleyen Onay Talepleri
                      </h3>
                      <div className="space-y-4">
                        {requests.filter(r => r.status === 'pending').length === 0 ? (
                          <p className="text-zinc-500">Bekleyen onay talebi bulunmuyor.</p>
                        ) : (
                          requests.filter(r => r.status === 'pending').map(req => (
                            <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 bg-orange-50/30 flex items-center justify-between">
                              <div className="space-y-2">
                                <h4 className="font-bold text-zinc-900">{req.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                  <div className="flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5" />
                                    {req.studentName}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {req.dates.join(', ')}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {req.time}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => setActiveTab('request')}
                                className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-all"
                              >
                                Talebi Yönet
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'upload' && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-6">{t.uploadVideo}</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Video Başlığı</label>
                        <input 
                          id="upload-title"
                          type="text" 
                          placeholder="Örn: Yeni Bagaj Kuralları"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
                        <select 
                          id="upload-category"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="Check-in">Check-in</option>
                          <option value="Operasyon">Operasyon</option>
                          <option value="Güvenlik">Güvenlik</option>
                          <option value="Özel Hizmet">Özel Hizmet</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const title = (document.getElementById('upload-title') as HTMLInputElement).value || file.name;
                            const category = (document.getElementById('upload-category') as HTMLSelectElement).value;
                            
                            const newVideo: VideoType = {
                              id: Math.random().toString(36).substr(2, 9),
                              title: title,
                              instructor: user.name,
                              duration: '00:00', // In a real app, we'd calculate this
                              thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
                              category: category,
                              rating: 5.0
                            };
                            
                            setVideos(prev => [newVideo, ...prev]);
                            alert('Video başarıyla yüklendi ve yayına alındı!');
                            setActiveTab('upcoming');
                          }
                        }}
                      />
                      <Upload className="w-12 h-12 mb-4 text-orange-500" />
                      <p className="font-bold text-zinc-900">Video dosyasını buraya sürükleyin veya seçin</p>
                      <p className="text-xs mt-2">MP4, MOV veya AVI (Maks. 500MB)</p>
                    </div>
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

      {showMandatoryPopup && (
        <MandatoryNotification 
          lang={lang} 
          onClose={() => setShowMandatoryPopup(false)} 
        />
      )}
    </div>
  );
}

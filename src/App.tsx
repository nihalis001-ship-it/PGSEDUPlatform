import React, { useState, useRef, useEffect } from 'react';
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

type Tab = 'videos' | 'planner' | 'dashboard' | 'request' | 'profile' | 'errors' | 'settings' | 'ai' | 'upcoming' | 'upload' | 'quick' | 'performance';

const INITIAL_VIDEOS: VideoType[] = [
  { 
    id: '1', 
    title: 'Bagaj Kabul ve Etiketleme Prosedürleri', 
    instructor: 'Simge Demir', 
    duration: '15:20', 
    thumbnail: 'https://picsum.photos/seed/baggage-tag/800/450', 
    category: 'Check-in', 
    rating: 4.8, 
    emoji: '🧳',
    quiz: {
      id: 'q1',
      videoId: '1',
      questions: [
        { id: '1-1', text: 'DAA (Delivery at Aircraft) etiketi hangi ekipmanlar için kullanılır?', options: ['Sadece valizler', 'Bebek arabası ve tekerlekli sandalye', 'Sadece spor ekipmanları', 'Kabin bagajları'], correctAnswer: 1 },
        { id: '1-2', text: 'Heavy etiketi kaç kg üzerindeki bagajlar için zorunludur?', options: ['15kg', '20kg', '23kg', '32kg'], correctAnswer: 2 },
        { id: '1-3', text: 'BBAG etiketi ne anlama gelir?', options: ['Öncelikli bagaj', 'Ağır bagaj', 'Sınırlı sorumluluk (uygunsuz paketleme)', 'Kabin bagajı'], correctAnswer: 2 }
      ]
    }
  },
  { 
    id: '2', 
    title: 'Fazla Bagaj ve Ücretlendirme Kuralları', 
    instructor: 'Cafer Yılmaz', 
    duration: '12:15', 
    thumbnail: 'https://picsum.photos/seed/excess-baggage/800/450', 
    category: 'Check-in', 
    rating: 4.9, 
    emoji: '💰',
    quiz: {
      id: 'q2',
      videoId: '2',
      questions: [
        { id: '2-1', text: 'Bebekler için tüm uçuşlarda ücretsiz bagaj hakkı kaç kg\'dır?', options: ['5 kg', '10 kg', '15 kg', '20 kg'], correctAnswer: 1 },
        { id: '2-2', text: 'Toplamda (ücretsiz dahil) maksimum kaç kg bagaj satın alınabilir?', options: ['30 kg', '40 kg', '50 kg', '60 kg'], correctAnswer: 2 },
        { id: '2-3', text: 'Bagaj ağırlığı küsuratları nasıl işlenir?', options: ['Yukarı yuvarlanır', 'Aşağı yuvarlanır', 'Aynı bırakılır', 'En yakın tam sayıya yuvarlanır'], correctAnswer: 1 }
      ]
    }
  },
  { 
    id: '3', 
    title: 'Özel Yolcu ve Refakatçi Limitleri', 
    instructor: 'Cemile Kaya', 
    duration: '18:10', 
    thumbnail: 'https://picsum.photos/seed/special-assistance/800/450', 
    category: 'Özel Hizmet', 
    rating: 4.7, 
    emoji: '♿',
    quiz: {
      id: 'q3',
      videoId: '3',
      questions: [
        { id: '3-1', text: 'Görme Engelli (BLND) grubu için refakatçi limiti nedir?', options: ['10 kişiye 1', '5 kişiye 1', '2 kişiye 1', 'Her yolcuya 1'], correctAnswer: 2 },
        { id: '3-2', text: 'Çocuk grubu için refakatçi limiti nedir?', options: ['10 çocuğa 1', '12 çocuğa 1', '15 çocuğa 1', '20 çocuğa 1'], correctAnswer: 1 },
        { id: '3-3', text: 'Refakatçiler kaç yaşından büyük olmalıdır?', options: ['15', '18', '21', '25'], correctAnswer: 1 }
      ]
    }
  },
  { 
    id: '4', 
    title: 'Canlı Hayvan (PETC/AVIH) Kabulü', 
    instructor: 'Simge Demir', 
    duration: '25:45', 
    thumbnail: 'https://picsum.photos/seed/pet-travel/800/450', 
    category: 'Operasyon', 
    rating: 4.6, 
    emoji: '🐾',
    quiz: {
      id: 'q4',
      videoId: '4',
      questions: [
        { id: '4-1', text: 'PETC (Kabin içi) için maksimum ağırlık limiti nedir?', options: ['5 kg', '8 kg', '10 kg', '12 kg'], correctAnswer: 1 },
        { id: '4-2', text: 'Dış hat uçuşlarında hangi hayvanların PETC olarak kabulü yasaktır?', options: ['Kedi', 'Köpek', 'Kuş', 'Hiçbiri'], correctAnswer: 2 },
        { id: '4-3', text: 'AVIH (Ambar içi) hayvanlar uçağın hangi ambarına yüklenmelidir?', options: ['Ön ambar (Forward)', 'Arka ambar (Aft)', 'Bulk ambar', 'Fark etmez'], correctAnswer: 0 }
      ]
    }
  },
  { 
    id: '5', 
    title: 'Tehlikeli Maddeler ve NOTOC Formu', 
    instructor: 'Cafer Yılmaz', 
    duration: '22:30', 
    thumbnail: 'https://picsum.photos/seed/hazardous-materials/800/450', 
    category: 'Operasyon', 
    rating: 5.0, 
    emoji: '⚠️',
    quiz: {
      id: 'q5',
      videoId: '5',
      questions: [
        { id: '5-1', text: 'NOTOC formu hangi durumlarda doldurulur?', options: ['Sadece DGR için', 'Sadece AVI için', 'DGR, AVI, PER, HUM, COMAT ve silahlar için', 'Sadece VIP yolcular için'], correctAnswer: 2 },
        { id: '5-2', text: 'NOTOC formu ne zaman imzalatılmalıdır?', options: ['Uçuş sonrası', 'Operasyon öncesi kaptana', 'Check-in sırasında', 'Boarding bittiğinde'], correctAnswer: 1 },
        { id: '5-3', text: 'DGR Sınıf 1 (Patlayıcılar) yolcu uçağında taşınabilir mi?', options: ['Evet', 'Hayır, kesinlikle yasaktır', 'Sadece özel izinle', 'Sadece iç hatlarda'], correctAnswer: 1 }
      ]
    }
  },
  { 
    id: '6', 
    title: 'Silah Taşıma ve Güvenlik Prosedürleri', 
    instructor: 'Cemile Kaya', 
    duration: '20:00', 
    thumbnail: 'https://picsum.photos/seed/airport-security/800/450', 
    category: 'Güvenlik', 
    rating: 4.8, 
    emoji: '👮',
    quiz: {
      id: 'q6',
      videoId: '6',
      questions: [
        { id: '6-1', text: 'Şahsi silahlar hangi SSR kodu ile ücretlendirilir?', options: ['SPEQ', 'WPAY', 'WEAP', 'BULK'], correctAnswer: 1 },
        { id: '6-2', text: 'Kişi başı maksimum mühimmat (1.4S) limiti nedir?', options: ['2 kg', '5 kg', '10 kg', 'Sınırsız'], correctAnswer: 1 },
        { id: '6-3', text: 'Silah ve mühimmat uçağın neresinde taşınır?', options: ['Kabin içinde', 'Arka ambarda', 'Ön ambarda (Forward)', 'Kaptan yanında'], correctAnswer: 2 }
      ]
    }
  },
  { 
    id: '7', 
    title: 'Check-in Zamanları ve Koltuk Atama', 
    instructor: 'Simge Demir', 
    duration: '10:00', 
    thumbnail: 'https://picsum.photos/seed/check-in-counter/800/450', 
    category: 'Check-in', 
    rating: 4.5, 
    emoji: '💺',
    quiz: {
      id: 'q7',
      videoId: '7',
      questions: [
        { id: '7-1', text: 'Yurt içi uçuşlarda check-in kapanış süresi nedir?', options: ['STD-30 dk', 'STD-45 dk', 'STD-60 dk', 'STD-90 dk'], correctAnswer: 1 },
        { id: '7-2', text: 'Acil çıkış koltuklarına kimler oturamaz?', options: ['Sadece çocuklar', 'Sadece hamileler', 'PRM, hamile, <18 ve bebekli yolcular', 'Sadece yaşlılar'], correctAnswer: 2 },
        { id: '7-3', text: 'Bebekli yolcular için koltuk kuralı nedir?', options: ['Her sırada max 1 bebek', 'Her üçlü koltuk sırasında max 1 bebek', 'Sadece ön sıralar', 'Sadece arka sıralar'], correctAnswer: 1 }
      ]
    }
  },
  { 
    id: '8', 
    title: 'İnsani Yük (HUM) ve Özel Kargolar', 
    instructor: 'Cafer Yılmaz', 
    duration: '08:30', 
    thumbnail: 'https://picsum.photos/seed/air-cargo/800/450', 
    category: 'Operasyon', 
    rating: 4.4, 
    emoji: '📦',
    quiz: {
      id: 'q8',
      videoId: '8',
      questions: [
        { id: 'q8-1', text: 'HUM (Cenaze) taşıma limiti maksimum kaçtır?', options: ['2 adet', '4 adet', '6 adet', 'Sınırsız'], correctAnswer: 1 },
        { id: 'q8-2', text: 'Krematoryum küllerinin (Ashes) taşınması yasak mıdır?', options: ['Evet, yasaktır', 'Hayır, serbesttir', 'Sadece iç hatlarda serbesttir', 'Sadece kargo olarak serbesttir'], correctAnswer: 0 },
        { id: 'q8-3', text: 'HUM uçağın neresinde taşınır?', options: ['Kabin içinde', 'Sadece kargo olarak ambarlarda', 'Kaptan yanında', 'Fark etmez'], correctAnswer: 1 }
      ]
    }
  },
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
    completedLessons: ['1'],
    preferences: {
      theme: 'light',
      emailNotifications: true
    },
    loginStreak: 7
  });

  const [requests, setRequests] = useState<LessonRequest[]>(INITIAL_REQUESTS);
  const notificationRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  useEffect(() => {
    if (user.preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.preferences.theme]);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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

  const handleUpdateThumbnail = (id: string, newThumbnail: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, thumbnail: newThumbnail } : v));
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
    { id: 'profile', label: t.profile, icon: UserIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-5 flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none overflow-hidden">
            <span className="text-2xl">✈️</span>
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white">Pegasus Edu</h1>
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
                    ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600 shadow-sm" 
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  activeTab === item.id ? "text-orange-600" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
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

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 shrink-0 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <Globe className="w-3 h-3" />
              {t.language}
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setLang('tr')}
                className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lang === 'tr' ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                TR
              </button>
              <button 
                onClick={() => setLang('en')}
                className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lang === 'en' ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                EN
              </button>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 space-y-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left",
              activeTab === 'profile' && "ring-2 ring-orange-600 ring-offset-2 dark:ring-offset-zinc-900"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user.role}</p>
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
        <header className="h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
            />
          </div>

          <div className="flex items-center gap-4 relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-xl transition-colors relative",
                showNotifications ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationCenter 
                  lang={lang} 
                  onClose={() => setShowNotifications(false)} 
                  onNavigate={(tab) => setActiveTab(tab)}
                />
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
                  onUpdateThumbnail={handleUpdateThumbnail}
                  isInstructor={user.role === 'Eğitmen'}
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
              {activeTab === 'profile' && (
                <UserProfile 
                  user={user} 
                  videos={videos} 
                  lang={lang} 
                  onEdit={() => setActiveTab('settings')}
                />
              )}
              {activeTab === 'errors' && <ErrorLibrary lang={lang} />}
              {activeTab === 'settings' && (
                <SettingsTab 
                  lang={lang} 
                  user={user} 
                  onUpdateUser={handleUpdateUser}
                  onUpdateLang={setLang}
                />
              )}
              {activeTab === 'ai' && <AIAssistant lang={lang} />}
              {activeTab === 'quick' && <QuickReference lang={lang} />}
              {activeTab === 'performance' && <CheckInPerformance lang={lang} />}
              {activeTab === 'upcoming' && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-orange-600" />
                      {t.upcomingLessons}
                    </h2>
                    <div className="space-y-4">
                      {requests.filter(r => r.status === 'approved' && (user.role === 'Eğitmen' ? true : r.studentName === user.name)).length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">Henüz planlanmış bir eğitiminiz bulunmamaktadır.</p>
                      ) : (
                        requests.filter(r => r.status === 'approved' && (user.role === 'Eğitmen' ? true : r.studentName === user.name)).map(req => (
                          <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                            <div className="space-y-2">
                              <h4 className="font-bold text-zinc-900 dark:text-white">{req.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
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
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">Onaylandı</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {user.role === 'Eğitmen' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                        <Bell className="w-6 h-6 text-orange-600" />
                        Bekleyen Onay Talepleri
                      </h3>
                      <div className="space-y-4">
                        {requests.filter(r => r.status === 'pending').length === 0 ? (
                          <p className="text-zinc-500 dark:text-zinc-400">Bekleyen onay talebi bulunmuyor.</p>
                        ) : (
                          requests.filter(r => r.status === 'pending').map(req => (
                            <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-orange-50/30 dark:bg-orange-900/10 flex items-center justify-between">
                              <div className="space-y-2">
                                <h4 className="font-bold text-zinc-900 dark:text-white">{req.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
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
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6">{t.uploadVideo}</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Video Başlığı</label>
                        <input 
                          id="upload-title"
                          type="text" 
                          placeholder="Örn: Yeni Bagaj Kuralları"
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
                        <select 
                          id="upload-category"
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                        >
                          <option value="Check-in">Check-in</option>
                          <option value="Operasyon">Operasyon</option>
                          <option value="Güvenlik">Güvenlik</option>
                          <option value="Özel Hizmet">Özel Hizmet</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Emoji (Opsiyonel)</label>
                        <input 
                          id="upload-emoji"
                          type="text" 
                          placeholder="Örn: ✈️"
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-400 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const title = (document.getElementById('upload-title') as HTMLInputElement).value || file.name;
                            const category = (document.getElementById('upload-category') as HTMLSelectElement).value;
                            const emoji = (document.getElementById('upload-emoji') as HTMLInputElement).value;
                            
                            const newVideo: VideoType = {
                              id: Math.random().toString(36).substr(2, 9),
                              title: title,
                              instructor: user.name,
                              duration: '00:00', // In a real app, we'd calculate this
                              thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
                              category: category,
                              rating: 5.0,
                              emoji: emoji || undefined
                            };
                            
                            setVideos(prev => [newVideo, ...prev]);
                            alert('Video başarıyla yüklendi ve yayına alındı!');
                            setActiveTab('upcoming');
                          }
                        }}
                      />
                      <Upload className="w-12 h-12 mb-4 text-orange-500" />
                      <p className="font-bold text-zinc-900 dark:text-white">Video dosyasını buraya sürükleyin veya seçin</p>
                      <p className="text-xs mt-2">MP4, MOV veya AVI (Maks. 500MB)</p>
                    </div>
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

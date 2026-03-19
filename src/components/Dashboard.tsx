import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Calendar,
  MessageSquare,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Video, User } from '../types';
import { Language, translations } from '../i18n';

interface DashboardProps {
  user: User;
  videos: Video[];
  onNavigate: (tab: string) => void;
  lang: Language;
}

export const Dashboard = ({ user, videos, onNavigate, lang }: DashboardProps) => {
  const t = translations[lang];
  const completionRate = Math.round((user.completedLessons.length / videos.length) * 100);
  
  const quickActions = [
    { id: 'videos', label: t.browseCourses, icon: BookOpen, color: 'bg-blue-500' },
    { id: 'planner', label: t.viewCalendar, icon: Calendar, color: 'bg-purple-500' },
    { id: 'request', label: t.getAppointment, icon: Clock, color: 'bg-orange-500' },
    { id: 'errors', label: t.errorLibrary, icon: AlertCircle, color: 'bg-red-500' },
  ];

  const upcomingLessons = [
    { id: '1', title: lang === 'tr' ? 'Tehlikeli Maddeler (DGR) Eğitimi' : 'Dangerous Goods (DGR) Training', time: lang === 'tr' ? 'Yarın, 10:00' : 'Tomorrow, 10:00', type: 'critical', category: lang === 'tr' ? 'Operasyon' : 'Operation' },
    { id: '2', title: lang === 'tr' ? 'İleri Seviye DCS Kullanımı' : 'Advanced DCS Usage', time: lang === 'tr' ? '12 Mart, 14:30' : 'March 12, 14:30', type: 'advanced', category: lang === 'tr' ? 'Sistem' : 'System' },
    { id: '3', title: lang === 'tr' ? 'Müşteri İlişkileri Temelleri' : 'Customer Relations Basics', time: lang === 'tr' ? '15 Mart, 09:00' : 'March 15, 09:00', type: 'basic', category: lang === 'tr' ? 'Service' : 'Service' },
  ];

  const recentQuiz = {
    title: lang === 'tr' ? 'Bagaj Kabul Süreçleri' : 'Baggage Acceptance Processes',
    score: 85,
    date: lang === 'tr' ? '2 saat önce' : '2 hours ago',
    status: lang === 'tr' ? 'Başarılı' : 'Successful'
  };

  const feedback = [
    { id: '1', text: lang === 'tr' ? 'Tebrikler! Ortalama check-in süren geçtiğimiz aya göre %10 iyileşti.' : 'Congratulations! Your average check-in time has improved by 10% compared to last month.', type: 'success' },
    { id: '2', text: lang === 'tr' ? 'Quiz sonucunda %85 başarı sağladınız. Harika gidiyorsunuz!' : 'You achieved 85% success in the quiz. You are doing great!', type: 'success' },
    { id: '3', text: lang === 'tr' ? 'Bagaj ekleme videosunu tekrar izlemeniz önerilir.' : 'It is recommended to watch the baggage addition video again.', type: 'info' }
  ];

  return (
    <div className="space-y-8">
      <header className="relative h-64 rounded-3xl overflow-hidden group bg-gradient-to-br from-orange-500 to-orange-700">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform duration-700">
          <span className="text-[120px]">✈️</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white">{t.welcome}, {user.name.split(' ')[0]}!</h2>
            <p className="text-white/80 mt-2 text-lg font-light tracking-wide">{t.todayJourney}</p>
          </motion.div>
        </div>
      </header>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="group p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/50 transition-all text-left flex items-center gap-4"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-600 transition-colors">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={CheckCircle2} 
          label={t.completedLessons} 
          value={`${user.completedLessons.length}/${videos.length}`}
          subValue={`%${completionRate} ${t.progress}`}
          color="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          onClick={() => onNavigate('videos')}
        />
        <StatCard 
          icon={BookOpen} 
          label={t.activeTrainings} 
          value="3"
          subValue={t.ongoingModules}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => onNavigate('videos')}
        />
        {user.role !== 'Eğitmen' && (
          <StatCard 
            icon={Award} 
            label={t.certificates} 
            value="2"
            subValue={t.earnedCompetencies}
            color="text-amber-600 dark:text-amber-400"
            bgColor="bg-amber-50 dark:bg-amber-900/20"
            onClick={() => onNavigate('profile')}
          />
        )}
        <StatCard 
          icon={TrendingUp} 
          label={t.successScore} 
          value="88"
          subValue={t.generalAverage}
          color="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50 dark:bg-orange-900/20"
          onClick={() => onNavigate('profile')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Lessons */}
          <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">{t.upcomingLessonsTitle}</h3>
              <button className="text-sm font-medium text-orange-600 hover:underline">{t.viewAll}</button>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-12 rounded-full",
                      lesson.type === 'critical' ? "bg-red-500" : 
                      lesson.type === 'advanced' ? "bg-blue-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white">{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.time}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{lesson.category}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Quiz */}
          <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white mb-6">{t.recentQuiz}</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
                  <circle 
                    cx="48" cy="48" r="40" 
                    fill="transparent" 
                    stroke="#FDC43E" 
                    strokeWidth="8" 
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - recentQuiz.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-zinc-900 dark:text-white">%{recentQuiz.score}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{recentQuiz.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{recentQuiz.date} {lang === 'tr' ? 'tamamlandı' : 'completed'} • {recentQuiz.status}</p>
                <button 
                  onClick={() => onNavigate('videos')}
                  className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700"
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Feedback */}
          <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              {t.feedbacks}
            </h3>
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className={cn(
                  "p-4 rounded-xl border text-sm leading-relaxed",
                  item.type === 'success' 
                    ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-400" 
                    : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-800 dark:text-blue-400"
                )}>
                  {item.text}
                </div>
              ))}
            </div>
          </section>

          {/* Latest Plan */}
          <section className="bg-zinc-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 text-orange-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.latestPlan}</span>
            </div>
            <h4 className="text-lg font-bold mb-2">{lang === 'tr' ? 'Haftalık Check-in Uzmanlığı' : 'Weekly Check-in Expertise'}</h4>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              {lang === 'tr' ? 'Bu hafta SSR işlemleri ve özel yolcu hizmetleri üzerine odaklanacağız.' : 'This week we will focus on SSR processes and special passenger services.'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-700 flex items-center justify-center text-[10px] font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <button className="bg-white text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-400 transition-colors">
                {t.goToPlan}
              </button>
            </div>
          </section>

          {/* Leaderboard */}
          <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {t.leaderboard}
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Ayşe Yılmaz', score: 980, avatar: 'AY', rank: 1 },
                { name: 'Mehmet Can', score: 945, avatar: 'MC', rank: 2 },
                { name: 'Selin Kaya', score: 920, avatar: 'SK', rank: 3 },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <span className={cn(
                    "w-6 text-sm font-bold",
                    item.rank === 1 ? "text-amber-500" : "text-zinc-400 dark:text-zinc-600"
                  )}>#{item.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{item.score} {t.points}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-zinc-400 hover:text-orange-600 transition-colors">
              {t.viewFullRanking}
            </button>
          </section>

          {/* System Status */}
          <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.systemStatus}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.allSystemsOperational}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  subValue: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, label, value, subValue, color, bgColor, onClick }: StatCardProps) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left w-full group hover:border-orange-200 dark:hover:border-orange-500/50"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", bgColor)}>
      <Icon className={cn("w-6 h-6", color)} />
    </div>
    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
    <div className="flex items-baseline gap-2 mt-1">
      <h4 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{value}</h4>
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{subValue}</span>
    </div>
  </button>
);

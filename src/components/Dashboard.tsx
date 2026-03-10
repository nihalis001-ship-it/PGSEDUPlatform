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

interface DashboardProps {
  user: User;
  videos: Video[];
  onNavigate: (tab: string) => void;
}

export const Dashboard = ({ user, videos, onNavigate }: DashboardProps) => {
  const completionRate = Math.round((user.completedLessons.length / videos.length) * 100);
  
  const quickActions = [
    { id: 'videos', label: 'Eğitimlere Göz At', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'planner', label: 'Takvimimi Gör', icon: Calendar, color: 'bg-purple-500' },
    { id: 'request', label: 'Randevu Al', icon: Clock, color: 'bg-orange-500' },
    { id: 'errors', label: 'Hata Kütüphanesi', icon: AlertCircle, color: 'bg-red-500' },
  ];

  const upcomingLessons = [
    { id: '1', title: 'Tehlikeli Maddeler (DGR) Eğitimi', time: 'Yarın, 10:00', type: 'critical', category: 'Operasyon' },
    { id: '2', title: 'İleri Seviye DCS Kullanımı', time: '12 Mart, 14:30', type: 'advanced', category: 'Sistem' },
    { id: '3', title: 'Müşteri İlişkileri Temelleri', time: '15 Mart, 09:00', type: 'basic', category: 'Hizmet' },
  ];

  const recentQuiz = {
    title: 'Bagaj Kabul Süreçleri',
    score: 85,
    date: '2 saat önce',
    status: 'Başarılı'
  };

  const feedback = [
    { id: '1', text: 'Quiz sonucunda %85 başarı sağladınız. Harika gidiyorsunuz!', type: 'success' },
    { id: '2', text: 'Bagaj ekleme videosunu tekrar izlemeniz önerilir.', type: 'info' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-zinc-900">Hoş Geldin, {user.name.split(' ')[0]}!</h2>
        <p className="text-zinc-500 mt-1">Eğitim yolculuğunda bugün neler var?</p>
      </header>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="group p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex items-center gap-4"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-zinc-700 group-hover:text-orange-600 transition-colors">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={CheckCircle2} 
          label="Tamamlanan Dersler" 
          value={`${user.completedLessons.length}/${videos.length}`}
          subValue={`%${completionRate} İlerleme`}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          onClick={() => onNavigate('videos')}
        />
        <StatCard 
          icon={BookOpen} 
          label="Aktif Eğitimler" 
          value="3"
          subValue="Devam eden modüller"
          color="text-blue-600"
          bgColor="bg-blue-50"
          onClick={() => onNavigate('videos')}
        />
        <StatCard 
          icon={Award} 
          label="Sertifikalar" 
          value="2"
          subValue="Kazanılan yetkinlikler"
          color="text-amber-600"
          bgColor="bg-amber-50"
          onClick={() => onNavigate('profile')}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Başarı Puanı" 
          value="88"
          subValue="Genel ortalama"
          color="text-orange-600"
          bgColor="bg-orange-50"
          onClick={() => onNavigate('profile')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Lessons */}
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-zinc-900">Yaklaşan Dersler</h3>
              <button className="text-sm font-medium text-orange-600 hover:underline">Tümünü Gör</button>
            </div>
            <div className="divide-y divide-zinc-100">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-12 rounded-full",
                      lesson.type === 'critical' ? "bg-red-500" : 
                      lesson.type === 'advanced' ? "bg-blue-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <h4 className="font-semibold text-zinc-900">{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.time}
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">{lesson.category}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Quiz */}
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 mb-6">Son Yapılan Quiz</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="8" />
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
                <span className="absolute text-xl font-bold text-zinc-900">%{recentQuiz.score}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 text-lg">{recentQuiz.title}</h4>
                <p className="text-zinc-500 text-sm mt-1">{recentQuiz.date} tamamlandı • {recentQuiz.status}</p>
                <button className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700">Detayları İncele</button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Feedback */}
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Geri Bildirimler
            </h3>
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className={cn(
                  "p-4 rounded-xl border text-sm leading-relaxed",
                  item.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-blue-50 border-blue-100 text-blue-800"
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
              <span className="text-[10px] font-bold uppercase tracking-wider">Son Eklenen Plan</span>
            </div>
            <h4 className="text-lg font-bold mb-2">Haftalık Check-in Uzmanlığı</h4>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Bu hafta SSR işlemleri ve özel yolcu hizmetleri üzerine odaklanacağız.
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
                Plana Git
              </button>
            </div>
          </section>

          {/* Leaderboard */}
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Liderlik Tablosu
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Ayşe Yılmaz', score: 980, avatar: 'AY', rank: 1 },
                { name: 'Mehmet Can', score: 945, avatar: 'MC', rank: 2 },
                { name: 'Selin Kaya', score: 920, avatar: 'SK', rank: 3 },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                  <span className={cn(
                    "w-6 text-sm font-bold",
                    item.rank === 1 ? "text-amber-500" : "text-zinc-400"
                  )}>#{item.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">{item.score} Puan</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-zinc-400 hover:text-orange-600 transition-colors">
              Tüm Sıralamayı Gör
            </button>
          </section>

          {/* System Status */}
          <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sistem Durumu</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-zinc-700">Tüm sistemler çalışıyor</span>
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
    className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all text-left w-full group hover:border-orange-200"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", bgColor)}>
      <Icon className={cn("w-6 h-6", color)} />
    </div>
    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
    <div className="flex items-baseline gap-2 mt-1">
      <h4 className="text-2xl font-serif font-bold text-zinc-900">{value}</h4>
      <span className="text-[10px] text-zinc-500 font-medium">{subValue}</span>
    </div>
  </button>
);

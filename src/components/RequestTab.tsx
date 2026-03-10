import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Send, Clock, Info, CheckCircle2, ChevronLeft, ChevronRight, Plus, Sparkles, Check, X, User as UserIcon } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { LessonRequest, User } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface RequestTabProps {
  lang: Language;
  user: User;
  requests: LessonRequest[];
  onAddRequest: (req: LessonRequest) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export const RequestTab = ({ lang, user, requests, onAddRequest, onUpdateStatus }: RequestTabProps) => {
  const t = translations[lang];
  const locale = lang === 'tr' ? tr : enUS;

  const [title, setTitle] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState('');

  const instructors = [
    { id: '1', name: 'Simge Demir', role: 'Kıdemli Eğitmen', avatar: 'SD' },
    { id: '2', name: 'Cafer Yılmaz', role: 'Sistem Uzmanı', avatar: 'CY' },
    { id: '3', name: 'Cemile Kaya', role: 'Operasyon Şefi', avatar: 'CK' },
  ];

  const isInstructor = user.role === 'Eğitmen';

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const toggleDate = (day: Date) => {
    const exists = selectedDates.find(d => isSameDay(d, day));
    if (exists) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, day)));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0 || !selectedInstructor) return;
    
    const newRequest: LessonRequest = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      instructorId: selectedInstructor,
      studentName: user.name,
      dates: selectedDates.map(d => format(d, 'yyyy-MM-dd')),
      status: 'pending'
    };

    onAddRequest(newRequest);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setTitle('');
    setSelectedDates([]);
    setSelectedInstructor('');
  };

  if (isInstructor) {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const historyRequests = requests.filter(r => r.status !== 'pending');

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900">Eğitmen Paneli</h2>
            <p className="text-zinc-500 mt-2">Öğrencilerden gelen randevu taleplerini yönetin.</p>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Aktif Oturum: {user.name}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Bekleyen Talepler ({pendingRequests.length})
              </h3>
              
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="text-zinc-500 text-sm">Bekleyen randevu talebi bulunmuyor.</p>
                  </div>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full uppercase">Yeni Talep</span>
                          <h4 className="font-bold text-zinc-900">{req.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5" />
                            {req.studentName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {req.dates.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onUpdateStatus(req.id, 'rejected')}
                          className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all"
                          title="Reddet"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(req.id, 'approved')}
                          className="p-3 bg-orange-600 text-white hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          <span className="text-xs font-bold">Onayla</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900">Geçmiş Talepler</h3>
              <div className="space-y-4">
                {historyRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-2xl border border-zinc-50 bg-white flex items-center justify-between opacity-70">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-900">{req.title}</h4>
                      <p className="text-[10px] text-zinc-500">{req.studentName} • {req.dates.join(', ')}</p>
                    </div>
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                      req.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 p-8 rounded-3xl text-white space-y-6">
              <h4 className="font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-400" />
                Eğitmen Rehberi
              </h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-orange-400 shrink-0">1</div>
                  Talepleri onaylamadan önce takviminizi kontrol edin.
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-orange-400 shrink-0">2</div>
                  Reddedilen talepler için öğrenciye bildirim gider.
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-orange-400 shrink-0">3</div>
                  Onaylanan dersler otomatik olarak "Planlama" kısmına eklenir.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const myRequests = requests.filter(r => r.studentName === user.name);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-zinc-900">Randevu Talebi</h2>
        <p className="text-zinc-500 mt-2">Eğitmenlerimizden özel ders veya danışmanlık randevusu alın.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
            {/* Instructor Selection */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Eğitmen Seçimi</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {instructors.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstructor(inst.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-left space-y-2",
                      selectedInstructor === inst.id 
                        ? "bg-orange-50 border-orange-500 ring-1 ring-orange-500" 
                        : "bg-zinc-50 border-zinc-100 hover:border-zinc-200"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                      {inst.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{inst.name}</p>
                      <p className="text-[10px] text-zinc-500">{inst.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ders İçeriği / Konu</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: SSR İşlemleri ve Özel Durumlar"
                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tarih Seçimi</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentMonth(addDays(monthStart, -30))} className="p-1 hover:bg-zinc-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold text-zinc-900 min-w-[100px] text-center capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</span>
                  <button onClick={() => setCurrentMonth(addDays(monthStart, 30))} className="p-1 hover:bg-zinc-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="bg-zinc-50/50 rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="grid grid-cols-7 bg-zinc-100/50">
                  {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                    <div key={i} className="py-2 text-center text-[10px] font-bold text-zinc-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, idx) => {
                    const isSelected = selectedDates.find(d => isSameDay(d, day));
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDate(day)}
                        className={cn(
                          "aspect-square flex items-center justify-center text-xs transition-all border-r border-b border-zinc-100/50",
                          !isCurrentMonth && "text-zinc-300",
                          isSelected ? "bg-orange-600 text-white font-bold" : "hover:bg-orange-50 text-zinc-600"
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={submitted || !title || selectedDates.length === 0 || !selectedInstructor}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Talep Gönderildi
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Randevu Talebi Gönder
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h4 className="font-serif font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
              Aktif Randevularım
            </h4>
            <div className="space-y-4">
              {myRequests.map(req => {
                const instructor = instructors.find(i => i.id === req.instructorId);
                return (
                  <div key={req.id} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-zinc-900">{req.title}</h5>
                        <p className="text-[10px] text-zinc-500">Eğitmen: {instructor?.name}</p>
                      </div>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                        req.status === 'pending' ? "bg-amber-100 text-amber-700" : 
                        req.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {req.status === 'pending' ? 'Bekliyor' : req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{req.dates.join(', ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-zinc-200">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-orange-400" />
              <h4 className="font-bold">Eğitmen Notu</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Randevu talepleriniz 24 saat içerisinde eğitmenlerimiz tarafından değerlendirilerek takviminize işlenecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Send, Clock, Info, CheckCircle2, ChevronLeft, ChevronRight, Plus, Sparkles, Check, X, User as UserIcon } from 'lucide-react';
import { format, addDays, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { LessonRequest, User } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface RequestTabProps {
  lang: Language;
  user: User;
  requests: LessonRequest[];
  onAddRequest: (req: LessonRequest) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected', reason?: string, alt?: string) => void;
}

export const RequestTab = ({ lang, user, requests, onAddRequest, onUpdateStatus }: RequestTabProps) => {
  const t = translations[lang];
  const locale = lang === 'tr' ? tr : enUS;

  const [title, setTitle] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [alternativeDate, setAlternativeDate] = useState('');

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
    if (selectedDates.length === 0 || !selectedInstructor || !title) return;
    
    const newRequest: LessonRequest = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      instructorId: selectedInstructor,
      studentName: user.name,
      dates: selectedDates.map(d => format(d, 'yyyy-MM-dd')),
      time: selectedTime,
      status: 'pending'
    };

    onAddRequest(newRequest);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setTitle('');
    setSelectedDates([]);
    setSelectedTime('10:00');
    setSelectedInstructor('');
  };

  if (isInstructor) {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const historyRequests = requests.filter(r => r.status !== 'pending');

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Eğitmen Paneli</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Öğrencilerden gelen randevu taleplerini yönetin.</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-2xl border border-orange-100 dark:border-orange-900/30">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Aktif Oturum: {user.name}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Bekleyen Talepler ({pendingRequests.length})
              </h3>
              
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                   <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Bekleyen randevu talebi bulunmuyor.</p>
                  </div>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full uppercase">Yeni Talep</span>
                          <h4 className="font-bold text-zinc-900 dark:text-white">{req.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5" />
                            {req.studentName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {req.dates.join(', ')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {req.time || 'Belirtilmedi'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setRejectingId(req.id)}
                          className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                          title="Reddet"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(req.id, 'approved')}
                          className="p-3 bg-orange-600 text-white hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all flex items-center gap-2"
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

            <AnimatePresence>
              {rejectingId && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full space-y-6"
                  >
                    <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Talebi Reddet</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase">Red Nedeni</label>
                        <textarea 
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 dark:text-white"
                          placeholder="Örn: O tarihte başka bir eğitimim var."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase">Alternatif Tarih/Saat Önerisi</label>
                        <input 
                          type="text"
                          value={alternativeDate}
                          onChange={(e) => setAlternativeDate(e.target.value)}
                          className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                          placeholder="Örn: 14 Mart Saat 14:00"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setRejectingId(null)}
                        className="flex-1 py-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                      >
                        İptal
                      </button>
                      <button 
                        onClick={() => {
                          onUpdateStatus(rejectingId, 'rejected', rejectionReason, alternativeDate);
                          setRejectingId(null);
                          setRejectionReason('');
                          setAlternativeDate('');
                        }}
                        className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all"
                      >
                        Reddet ve Öner
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">Geçmiş Talepler</h3>
              <div className="space-y-4">
                {historyRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-2xl border border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between opacity-70">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{req.title}</h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{req.studentName} • {req.dates.join(', ')}</p>
                    </div>
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                      req.status === 'approved' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    )}>
                      {req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 dark:bg-black p-8 rounded-3xl text-white space-y-6 border border-zinc-800">
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
        <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Randevu Talebi</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Eğitmenlerimizden özel ders veya danışmanlık randevusu alın.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-8">
            {/* Instructor Selection */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Eğitmen Seçimi</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {instructors.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstructor(inst.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-left space-y-2",
                      selectedInstructor === inst.id 
                        ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-1 ring-orange-500" 
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                      {inst.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{inst.name}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{inst.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Ders İçeriği / Konu</label>
              <div className="flex gap-4">
                <input 
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: SSR İşlemleri ve Özel Durumlar"
                  className="flex-1 px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all dark:text-white"
                />
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-32 px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all dark:text-white"
                >
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(t => (
                    <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Tarih Seçimi</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg dark:text-white"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white min-w-[100px] text-center capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</span>
                  <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg dark:text-white"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="grid grid-cols-7 bg-zinc-100/50 dark:bg-zinc-800">
                  {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                    <div key={i} className="py-2 text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">{d}</div>
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
                          "aspect-square flex items-center justify-center text-xs transition-all border-r border-b border-zinc-100/50 dark:border-zinc-800",
                          !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                          isSelected ? "bg-orange-600 text-white font-bold" : "hover:bg-orange-50 dark:hover:bg-orange-900/30 text-zinc-600 dark:text-zinc-400"
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
              type="submit"
              disabled={submitted || !title || selectedDates.length === 0 || !selectedInstructor}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 dark:shadow-none hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
        </form>

        {/* Info Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
              Aktif Randevularım
            </h4>
            <div className="space-y-4">
              {myRequests.map(req => {
                const instructor = instructors.find(i => i.id === req.instructorId);
                return (
                  <div key={req.id} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-zinc-900 dark:text-white">{req.title}</h5>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Eğitmen: {instructor?.name}</p>
                      </div>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                        req.status === 'pending' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : 
                        req.status === 'approved' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      )}>
                        {req.status === 'pending' ? 'Bekliyor' : req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">{req.dates.join(', ')} - {req.time}</span>
                      </div>
                    </div>
                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 space-y-1">
                        <p className="text-[10px] font-bold text-red-700 dark:text-red-400">Red Nedeni:</p>
                        <p className="text-[10px] text-red-600 dark:text-red-300">{req.rejectionReason}</p>
                        {req.alternativeDate && (
                          <p className="text-[10px] text-red-800 dark:text-red-200 font-bold mt-1">Öneri: {req.alternativeDate}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-900 dark:bg-black p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-zinc-200 dark:shadow-none border border-zinc-800">
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

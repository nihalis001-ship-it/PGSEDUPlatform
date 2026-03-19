import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface Lesson {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'live' | 'recorded';
}

const INITIAL_LESSONS: Lesson[] = [
  { id: '1', title: 'SSR (Özel Hizmet Talebi) Ekleme', date: new Date(), time: '14:00', type: 'live' },
  { id: '2', title: 'Bagaj Ekleme ve Etiketleme', date: addDays(new Date(), 2), time: '10:30', type: 'recorded' },
  { id: '3', title: 'Online Check-inli Yolcu Kabulü', date: addDays(new Date(), 5), time: '16:00', type: 'live' },
  { id: '4', title: 'Boarding Süreçleri ve Kapı Yönetimi', date: addDays(new Date(), 1), time: '09:00', type: 'live' },
  { id: '5', title: 'APIS Bilgileri ve Pasaport Kontrol', date: addDays(new Date(), 3), time: '11:30', type: 'recorded' },
];

interface LessonPlannerProps {
  lang: Language;
}

export const LessonPlanner = ({ lang }: LessonPlannerProps) => {
  const t = translations[lang];
  const locale = lang === 'tr' ? tr : enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const selectedDateLessons = lessons.filter(lesson => isSameDay(lesson.date, selectedDate));

  const getTranslatedTitle = (title: string) => {
    if (lang === 'tr') return title;
    const titles: Record<string, string> = {
      'SSR (Özel Hizmet Talebi) Ekleme': 'Adding SSR (Special Service Request)',
      'Bagaj Ekleme ve Etiketleme': 'Baggage Addition and Tagging',
      'Online Check-inli Yolcu Kabulü': 'Accepting Online Checked-in Passengers',
      'Boarding Süreçleri ve Kapı Yönetimi': 'Boarding Processes and Gate Management',
      'APIS Bilgileri ve Pasaport Kontrol': 'APIS Information and Passport Control'
    };
    return titles[title] || title;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{lang === 'tr' ? 'Ders Planlayıcı' : 'Lesson Planner'}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{lang === 'tr' ? 'Eğitim takvimini yönet ve derslerini planla.' : 'Manage training calendar and plan your lessons.'}</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <span className="px-4 font-medium text-zinc-900 dark:text-white min-w-[140px] text-center capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale })}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-bottom border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
            {(lang === 'tr' ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayLessons = lessons.filter(l => isSameDay(l.date, day));
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative h-32 p-2 border-r border-b border-zinc-100 dark:border-zinc-800 text-left transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 group",
                    !isCurrentMonth && "bg-zinc-50/30 dark:bg-zinc-900/30 text-zinc-300 dark:text-zinc-700",
                    isSelected && "bg-orange-50/50 dark:bg-orange-900/10 ring-1 ring-inset ring-orange-200 dark:ring-orange-900/50"
                  )}
                >
                  <span className={cn(
                    "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full transition-colors",
                    isToday && "bg-orange-600 text-white font-bold",
                    !isToday && isSelected && "text-orange-600 dark:text-orange-400 font-bold",
                    !isToday && !isSelected && "text-zinc-700 dark:text-zinc-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {dayLessons.slice(0, 2).map(lesson => (
                      <div 
                        key={lesson.id}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium",
                          lesson.type === 'live' 
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30" 
                            : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                        )}
                      >
                        {lesson.time} {getTranslatedTitle(lesson.title)}
                      </div>
                    ))}
                    {dayLessons.length > 2 && (
                      <div className="text-[9px] text-zinc-400 dark:text-zinc-500 pl-1">
                        + {dayLessons.length - 2} {lang === 'tr' ? 'daha' : 'more'}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
              {format(selectedDate, 'd MMMM', { locale })}
            </h3>
            <button className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {selectedDateLessons.length > 0 ? (
              selectedDateLessons.map((lesson) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={lesson.id}
                  className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-zinc-900 dark:text-white text-sm leading-tight">
                      {getTranslatedTitle(lesson.title)}
                    </h4>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      lesson.type === 'live' ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    )}>
                      {lesson.type === 'live' ? (lang === 'tr' ? 'Canlı' : 'Live') : (lang === 'tr' ? 'Kayıt' : 'Record')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{lesson.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-xs">{lang === 'tr' ? 'Ders' : 'Lesson'}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                  <CalendarIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{lang === 'tr' ? 'Bu tarih için planlanmış ders bulunmuyor.' : 'No lessons scheduled for this date.'}</p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline">
                  {lang === 'tr' ? 'Yeni ders ekle' : 'Add new lesson'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">{lang === 'tr' ? 'Hızlı İstatistikler' : 'Quick Stats'}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">12</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">{lang === 'tr' ? 'Toplam Ders' : 'Total Lessons'}</div>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">4</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">{lang === 'tr' ? 'Bu Hafta' : 'This Week'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

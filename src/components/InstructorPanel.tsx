import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Video, 
  Bell, 
  HelpCircle, 
  Upload, 
  LayoutGrid, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';
import { Video as VideoType, AppNotification, Quiz, Question } from '../types';

interface InstructorPanelProps {
  lang: Language;
  videos: VideoType[];
  notifications: AppNotification[];
  onAddVideo: (video: VideoType) => void;
  onDeleteVideo: (id: string) => void;
  onAddNotification: (notif: AppNotification) => void;
  onDeleteNotification: (id: string) => void;
  onAddQuiz: (videoId: string, quiz: Quiz) => void;
}

type PanelTab = 'videos' | 'notifications' | 'quizzes';

export function InstructorPanel({ 
  lang, 
  videos, 
  notifications, 
  onAddVideo, 
  onDeleteVideo, 
  onAddNotification, 
  onDeleteNotification,
  onAddQuiz
}: InstructorPanelProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<PanelTab>('videos');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showAddNotif, setShowAddNotif] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState<string | null>(null);

  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Check-in');
  const [videoEmoji, setVideoEmoji] = useState('✈️');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Notification Form State
  const [notifType, setNotifType] = useState<'feature' | 'update'>('update');
  const [notifTitleTr, setNotifTitleTr] = useState('');
  const [notifTitleEn, setNotifTitleEn] = useState('');
  const [notifDescTr, setNotifDescTr] = useState('');
  const [notifDescEn, setNotifDescEn] = useState('');

  // Quiz Form State
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  React.useEffect(() => {
    if (showAddQuiz) {
      const video = videos.find(v => v.id === showAddQuiz);
      if (video?.quiz) {
        setQuestions(video.quiz.questions);
      } else {
        setQuestions([{ id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      }
    }
  }, [showAddQuiz, videos]);

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile && !videoTitle) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newVideo: VideoType = {
      id: Math.random().toString(36).substr(2, 9),
      title: videoTitle || videoFile?.name || 'Untitled Video',
      instructor: 'Simge Demir',
      duration: '00:00',
      thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
      category: videoCategory,
      rating: 5.0,
      emoji: videoEmoji,
      videoUrl: videoFile ? URL.createObjectURL(videoFile) : undefined
    };
    
    onAddVideo(newVideo);
    setShowAddVideo(false);
    setVideoTitle('');
    setVideoFile(null);
    setIsUploading(false);
  };

  const handleAddNotifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      type: notifType,
      title: { tr: notifTitleTr, en: notifTitleEn },
      description: { tr: notifDescTr, en: notifDescEn },
      date: lang === 'tr' ? 'Yeni' : 'New'
    };
    onAddNotification(newNotif);
    setShowAddNotif(false);
    setNotifTitleTr('');
    setNotifTitleEn('');
    setNotifDescTr('');
    setNotifDescEn('');
  };

  const handleAddQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddQuiz) return;
    
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      videoId: showAddQuiz,
      questions: questions.map((q, i) => ({ ...q, id: `${showAddQuiz}-${i}` }))
    };
    
    onAddQuiz(showAddQuiz, newQuiz);
    setShowAddQuiz(null);
    setQuestions([{ id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: (questions.length + 1).toString(), 
      text: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0 
    }]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">
            {lang === 'tr' ? 'Eğitmen Yönetim Paneli' : 'Instructor Management Panel'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {lang === 'tr' ? 'Eğitim içeriklerini ve sistem güncellemelerini buradan yönetin.' : 'Manage training content and system updates from here.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('videos')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'videos' 
              ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Video className="w-4 h-4" />
          {lang === 'tr' ? 'Videolar' : 'Videos'}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'notifications' 
              ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Bell className="w-4 h-4" />
          {lang === 'tr' ? 'Güncellemeler' : 'Updates'}
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'quizzes' 
              ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <HelpCircle className="w-4 h-4" />
          {lang === 'tr' ? 'Quizler' : 'Quizzes'}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {activeTab === 'videos' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <Video className="w-6 h-6 text-orange-600" />
                {lang === 'tr' ? 'Video Yönetimi' : 'Video Management'}
              </h2>
              <button 
                onClick={() => setShowAddVideo(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 dark:shadow-none"
              >
                <Plus className="w-4 h-4" />
                {lang === 'tr' ? 'Yeni Video Ekle' : 'Add New Video'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="group relative bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <div className="aspect-video relative bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                      {video.emoji || '📺'}
                    </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onDeleteVideo(video.id)}
                        className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all transform hover:scale-110"
                        title={lang === 'tr' ? 'Sil' : 'Delete'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{video.emoji}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                        {video.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{video.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{video.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <Bell className="w-6 h-6 text-orange-600" />
                {lang === 'tr' ? 'Güncelleme Yönetimi' : 'Update Management'}
              </h2>
              <button 
                onClick={() => setShowAddNotif(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 dark:shadow-none"
              >
                <Plus className="w-4 h-4" />
                {lang === 'tr' ? 'Yeni Güncelleme Ekle' : 'Add New Update'}
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map(notif => (
                <div key={notif.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      notif.type === 'feature' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {notif.type === 'feature' ? <Plus className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{notif.type === 'feature' ? 'Yeni Özellik' : 'Güncelleme'}</span>
                        <span className="text-[10px] text-zinc-400">• {notif.date}</span>
                      </div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{notif.title[lang]}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{notif.description[lang]}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteNotification(notif.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-orange-600" />
                {lang === 'tr' ? 'Quiz Yönetimi' : 'Quiz Management'}
              </h2>
            </div>

            <div className="space-y-4">
              {videos.map(video => (
                <div key={video.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="text-xl">{video.emoji || '📺'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{video.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {video.quiz 
                          ? (lang === 'tr' ? `${video.quiz.questions.length} Soru Mevcut` : `${video.quiz.questions.length} Questions Available`)
                          : (lang === 'tr' ? 'Henüz Quiz Eklenmedi' : 'No Quiz Added Yet')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddQuiz(video.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      video.quiz 
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200" 
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    )}
                  >
                    {video.quiz ? (lang === 'tr' ? 'Quizi Düzenle' : 'Edit Quiz') : (lang === 'tr' ? 'Quiz Ekle' : 'Add Quiz')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVideo(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6">
                {lang === 'tr' ? 'Yeni Video Yükle' : 'Upload New Video'}
              </h3>
              <form onSubmit={handleAddVideoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Video Dosyası</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoFile(file);
                          if (!videoTitle) setVideoTitle(file.name.split('.')[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={cn(
                      "w-full px-4 py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all",
                      videoFile 
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" 
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 group-hover:border-orange-300"
                    )}>
                      <Upload className={cn("w-8 h-8", videoFile ? "text-emerald-500" : "text-zinc-400")} />
                      <div className="text-center">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                          {videoFile ? videoFile.name : (lang === 'tr' ? 'Video dosyasını seçin veya sürükleyin' : 'Select or drag video file')}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">MP4, MOV, AVI (Maks. 500MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Video Başlığı</label>
                  <input 
                    type="text" 
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Örn: Yeni Bagaj Kuralları"
                    className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Kategori</label>
                    <select 
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                    >
                      <option value="Check-in">Check-in</option>
                      <option value="Operasyon">Operasyon</option>
                      <option value="Güvenlik">Güvenlik</option>
                      <option value="Özel Hizmet">Özel Hizmet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Emoji</label>
                    <input 
                      type="text" 
                      value={videoEmoji}
                      onChange={(e) => setVideoEmoji(e.target.value)}
                      className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddVideo(false)}
                    disabled={isUploading}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    disabled={isUploading || (!videoFile && !videoTitle)}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 dark:shadow-none hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {lang === 'tr' ? 'Yükleniyor...' : 'Uploading...'}
                      </>
                    ) : (
                      lang === 'tr' ? 'Yükle' : 'Upload'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAddNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddNotif(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6">
                {lang === 'tr' ? 'Yeni Güncelleme Ekle' : 'Add New Update'}
              </h3>
              <form onSubmit={handleAddNotifSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Tür</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNotifType('update')}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-bold border transition-all",
                        notifType === 'update' ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-zinc-50 border-zinc-200 text-zinc-400"
                      )}
                    >
                      Güncelleme
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNotifType('feature')}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-bold border transition-all",
                        notifType === 'feature' ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-zinc-50 border-zinc-200 text-zinc-400"
                      )}
                    >
                      Yeni Özellik
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Türkçe İçerik</h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400">Başlık</label>
                      <input 
                        type="text" 
                        value={notifTitleTr}
                        onChange={(e) => setNotifTitleTr(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400">Açıklama</label>
                      <textarea 
                        value={notifDescTr}
                        onChange={(e) => setNotifDescTr(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white resize-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-600">English Content</h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400">Title</label>
                      <input 
                        type="text" 
                        value={notifTitleEn}
                        onChange={(e) => setNotifTitleEn(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400">Description</label>
                      <textarea 
                        value={notifDescEn}
                        onChange={(e) => setNotifDescEn(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddNotif(false)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 dark:shadow-none hover:bg-orange-700 transition-all"
                  >
                    {lang === 'tr' ? 'Kaydet' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAddQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddQuiz(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6 shrink-0">
                {lang === 'tr' ? 'Quiz Düzenle' : 'Edit Quiz'}
              </h3>
              
              <form onSubmit={handleAddQuizSubmit} className="flex-1 overflow-y-auto pr-4 space-y-8 scrollbar-hide">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Soru {qIdx + 1}</h4>
                      {questions.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                          className="text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400">Soru Metni</label>
                      <input 
                        type="text" 
                        value={q.text}
                        onChange={(e) => {
                          const newQs = [...questions];
                          newQs[qIdx].text = e.target.value;
                          setQuestions(newQs);
                        }}
                        className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="space-y-1">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-zinc-400">Seçenek {optIdx + 1}</label>
                            <input 
                              type="radio" 
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === optIdx}
                              onChange={() => {
                                const newQs = [...questions];
                                newQs[qIdx].correctAnswer = optIdx;
                                setQuestions(newQs);
                              }}
                              className="accent-orange-600"
                            />
                          </div>
                          <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => {
                              const newQs = [...questions];
                              newQs[qIdx].options[optIdx] = e.target.value;
                              setQuestions(newQs);
                            }}
                            className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs dark:text-white"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Soru Ekle
                </button>
              </form>

              <div className="pt-8 flex gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowAddQuiz(null)}
                  className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleAddQuizSubmit}
                  className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 dark:shadow-none hover:bg-orange-700 transition-all"
                >
                  {lang === 'tr' ? 'Quizi Kaydet' : 'Save Quiz'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

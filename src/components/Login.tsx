import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface LoginProps {
  onLogin: (username: string, role: 'Öğrenci' | 'Eğitmen') => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Login = ({ onLogin, lang, setLang }: LoginProps) => {
  const t = translations[lang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot' | 'support'>('login');
  const [email, setEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication logic
    setTimeout(() => {
      if (username === 'nihal' && password === '1234') {
        onLogin('Nihal Işık', 'Öğrenci');
      } else if (username === 'simge' && password === '1234') {
        onLogin('Simge Demir', 'Eğitmen');
      } else {
        setError(t.loginError);
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reset link');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setView('login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: supportMessage }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send support message');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setView('login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-zinc-200 shadow-sm">
        <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5" />
        <div className="flex gap-1">
          <button 
            onClick={() => setLang('tr')}
            className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-lg transition-all",
              lang === 'tr' ? "bg-orange-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            TR
          </button>
          <button 
            onClick={() => setLang('en')}
            className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-lg transition-all",
              lang === 'en' ? "bg-orange-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            EN
          </button>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200 border border-zinc-100 p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6">
            <span className="text-4xl">✈️</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Pegasus Edu</h1>
          <p className="text-zinc-500 mt-2 text-center">
            {view === 'login' && t.loginSubtitle}
            {view === 'forgot' && t.forgotPasswordTitle}
            {view === 'support' && t.supportTitle}
          </p>
        </div>

        {view === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{t.username}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.usernamePlaceholder}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t.loginButton}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-6">
            <p className="text-sm text-zinc-500 text-center px-4">{t.forgotPasswordDesc}</p>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{t.email}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-medium text-center"
              >
                {t.successMessage}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : t.sendResetLink}
            </button>

            <button 
              type="button"
              onClick={() => setView('login')}
              className="w-full text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {t.backToLogin}
            </button>
          </form>
        )}

        {view === 'support' && (
          <form onSubmit={handleSupportSubmit} className="space-y-6">
            <p className="text-sm text-zinc-500 text-center px-4">{t.supportDesc}</p>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{t.email}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{t.message}</label>
              <textarea 
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-medium text-center"
              >
                {t.successMessage}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : t.sendMessage}
            </button>

            <button 
              type="button"
              onClick={() => setView('login')}
              className="w-full text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {t.backToLogin}
            </button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
          <p className="text-xs text-zinc-400">{t.helpText}</p>
          <div className="flex gap-6">
            <button 
              onClick={() => setView('forgot')}
              className="text-[10px] font-bold text-zinc-500 hover:text-orange-600 uppercase tracking-wider transition-colors"
            >
              {t.forgotPassword}
            </button>
            <button 
              onClick={() => setView('support')}
              className="text-[10px] font-bold text-zinc-500 hover:text-orange-600 uppercase tracking-wider transition-colors"
            >
              {t.getSupport}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

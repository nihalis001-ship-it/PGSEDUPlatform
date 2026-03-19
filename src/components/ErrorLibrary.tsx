import React, { useState } from 'react';
import { Search, AlertCircle, ChevronDown, ChevronUp, BookOpen, HelpCircle, MessageSquare } from 'lucide-react';
import { DCS_ERRORS } from '../constants/errorLibrary';
import { Language, translations } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ErrorLibraryProps {
  lang: Language;
}

export const ErrorLibrary = ({ lang }: ErrorLibraryProps) => {
  const [search, setSearch] = useState('');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const t = translations[lang];

  const filteredErrors = DCS_ERRORS.filter(err => 
    err.code.toLowerCase().includes(search.toLowerCase()) ||
    err.meaning[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{t.errorCodes}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">DCS sisteminde sık karşılaşılan hata kodları ve operasyonel çözüm rehberi.</p>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        <input 
          type="text" 
          placeholder="Hata kodu veya anlamı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredErrors.map((error) => (
          <div 
            key={error.code}
            className={cn(
              "bg-white dark:bg-zinc-900 border transition-all rounded-3xl overflow-hidden",
              expandedCode === error.code 
                ? "border-orange-200 dark:border-orange-500/50 shadow-lg" 
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
          >
            <button 
              onClick={() => setExpandedCode(expandedCode === error.code ? null : error.code)}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-500">{error.code}</span>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">{error.meaning[lang]}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Kod: {error.code}</p>
                </div>
              </div>
              {expandedCode === error.code ? <ChevronUp className="w-5 h-5 text-zinc-400 dark:text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />}
            </button>

            <AnimatePresence>
              {expandedCode === error.code && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30"
                >
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {t.cause}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{error.cause[lang]}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          <HelpCircle className="w-3.5 h-3.5" />
                          {t.solution}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">{error.solution[lang]}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {t.passengerMessage}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                          "{error.passengerMessage[lang]}"
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Operasyonel Dil: Nazik & Net</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

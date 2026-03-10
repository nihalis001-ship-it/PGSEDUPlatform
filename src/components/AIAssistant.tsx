import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  lang: Language;
}

export function AIAssistant({ lang }: AIAssistantProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: lang === 'tr' 
        ? 'Merhaba! Ben Pegasus Edu Yapay Zeka Asistanıyım. Havayolu prosedürleri, check-in işlemleri veya platform kullanımı hakkında size nasıl yardımcı olabilirim?' 
        : 'Hello! I am the Pegasus Edu AI Assistant. How can I help you with airline procedures, check-in processes, or platform usage?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Filter out the initial greeting if it's the first message, 
      // as Gemini expects the conversation to start with a 'user' message.
      const history = messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: lang === 'tr' 
            ? "Sen Pegasus Hava Yolları'nın eğitim platformu olan Pegasus Edu'nun yapay zeka asistanısın. Görevin, yer hizmetleri personeline eğitimlerinde yardımcı olmak, havayolu prosedürleri (SSR ekleme, bagaj kuralları, boarding süreçleri vb.) hakkında bilgi vermek ve platformu nasıl kullanacaklarını anlatmaktır. Yanıtların profesyonel, yardımsever ve Pegasus kurumsal kimliğine uygun olmalıdır. Eğer bilmediğin bir prosedür sorulursa, en güncel bilgi için 'Pegasus Operasyon El Kitabı'na (OM) bakmalarını önermelisin."
            : "You are the AI assistant for Pegasus Edu, the training platform of Pegasus Airlines. Your task is to assist ground handling personnel in their training, provide information about airline procedures (adding SSR, baggage rules, boarding processes, etc.), and explain how to use the platform. Your responses should be professional, helpful, and in line with Pegasus's corporate identity. If asked about a procedure you don't know, you should suggest checking the 'Pegasus Operations Manual' (OM) for the most up-to-date information.",
        },
        history: history as any
      });

      const result = await chat.sendMessage({ message: userMessage });
      const aiResponse = result.text || (lang === 'tr' ? "Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar deneyin." : "Sorry, I cannot respond right now. Please try again.");
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'tr' ? "Bir hata oluştu. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin." : "An error occurred. Please check your internet connection or try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{lang === 'tr' ? 'Pegasus AI Asistan' : 'Pegasus AI Assistant'}</h2>
            <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {lang === 'tr' ? 'Çevrimiçi • Prosedür Uzmanı' : 'Online • Procedure Expert'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
          title={lang === 'tr' ? "Sohbeti Sıfırla" : "Reset Chat"}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'assistant' ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-600"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'assistant' 
                  ? "bg-zinc-50 text-zinc-800 border border-zinc-100" 
                  : "bg-orange-600 text-white shadow-md shadow-orange-100"
              )}>
                <div className="markdown-body prose prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              <span className="text-sm text-zinc-500 font-medium">{lang === 'tr' ? 'Pegasus AI düşünüyor...' : 'Pegasus AI is thinking...'}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-zinc-100">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'tr' ? "Bir soru sorun (örn: SSR ekleme nasıl yapılır?)" : "Ask a question (e.g., How to add SSR?)"}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-14"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-2.5 rounded-xl transition-all",
              input.trim() && !isLoading 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-200 hover:bg-orange-700" 
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-zinc-400 font-medium">
          {lang === 'tr' 
            ? 'Yapay zeka hatalar yapabilir. Önemli prosedürler için her zaman resmi el kitaplarını kontrol edin.' 
            : 'AI can make mistakes. Always check official manuals for important procedures.'}
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { Quiz, Question } from '../types';
import { cn } from '../lib/utils';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: () => void;
}

export const QuizModal = ({ quiz, onClose, onComplete }: QuizModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    if (score === quiz.questions.length) {
      onComplete();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
          <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">Bilgi Testi</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-8">
          {!showResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                <span>Soru {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                <span>Puan: {score}</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">
                  {currentQuestion.text}
                </h4>

                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                        selectedOption === idx 
                          ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-600" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                        isSubmitted && idx === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-emerald-500",
                        isSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswer && "border-red-500 bg-red-50 dark:bg-red-900/20 ring-red-500"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        selectedOption === idx ? "text-orange-700 dark:text-orange-400" : "text-zinc-700 dark:text-zinc-300",
                        isSubmitted && idx === currentQuestion.correctAnswer && "text-emerald-700 dark:text-emerald-400",
                        isSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswer && "text-red-700 dark:text-red-400"
                      )}>
                        {option}
                      </span>
                      
                      {isSubmitted && idx === currentQuestion.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                      {isSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswer && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    Cevabı Gönder
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Sıradaki Soru' : 'Sonuçları Gör'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">Test Tamamlandı!</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {quiz.questions.length} sorudan {score} tanesini doğru cevapladın.
                </p>
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Başarı Oranı</div>
                <div className="text-4xl font-serif font-bold text-orange-600">
                  %{Math.round((score / quiz.questions.length) * 100)}
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
              >
                {score === quiz.questions.length ? 'Dersi Tamamla' : 'Kapat'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SUGGESTED_PROMPTS, getOfflineChemBotResponse } from '../../data/chembotKnowledge';
import { soundManager } from '../../utils/sound';
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface ChemBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const ChemBotModal: React.FC<ChemBotModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const { user, unlockBadge, addXP } = useGame();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Halo **${user?.name || 'Siswa'}**! 👋 Aku adalah **ChemBot**, asisten AI belajarmu di ChemQuest untuk **Kelas ${user?.grade || 'X'} SMA**.\n\nKamu bisa bertanya materi apa saja seputar tabel periodik, cara menyetarakan reaksi, penjelasan hasil simulasi, atau meminta tips belajar kimia. Apa yang ingin kita bahas? 🚀`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialTopic) {
      handleSend(initialTopic);
    }
  }, [initialTopic]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    soundManager.playClick();
    setInputPrompt('');

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call server endpoint
      const response = await fetch('/api/chembot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          grade: `Kelas ${user?.grade || 'X'} SMA`,
          studentName: user?.name || 'Siswa',
          context: `Siswa sedang memainkan game ChemQuest pada materi kelas ${user?.grade || 'X'}.`,
          history: messages.slice(-4).map(m => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      let replyText = '';
      if (data.success && data.reply) {
        replyText = data.reply;
      } else {
        // Fallback to intelligent offline expert chemistry engine
        replyText = getOfflineChemBotResponse(prompt, user?.grade || 'X', user?.name || 'Siswa');
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      soundManager.playBubble();

      // Check ChemBot friend badge
      const nextCount = interactionCount + 1;
      setInteractionCount(nextCount);
      if (nextCount >= 3) {
        unlockBadge('chembot_friend');
      }
      addXP(15, 'Diskusi bersama AI ChemBot');
    } catch {
      // Offline fallback
      const replyText = getOfflineChemBotResponse(prompt, user?.grade || 'X', user?.name || 'Siswa');
      const botMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-600/20">
              <div className="w-full h-full bg-cyan-50 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-700 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">ChemBot AI Tutor</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Panduan Belajar Kimia SMA (Kelas {user?.grade || 'X'})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Prompts Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-slate-600 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Topik Kilat:
          </span>
          {SUGGESTED_PROMPTS.slice(0, 4).map(sp => (
            <button
              key={sp.id}
              onClick={() => handleSend(sp.prompt)}
              className="px-3 py-1 rounded-lg bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 text-[11px] font-bold text-slate-700 whitespace-nowrap shadow-xs transition-all"
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[9px] pt-1 text-right font-medium ${isUser ? 'text-cyan-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-indigo-700 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-none flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-600 font-medium ml-1">ChemBot sedang meracik jawaban...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              placeholder="Ketik pertanyaan kimiamu di sini (contoh: mengapa ikatan kovalen polar terjadi?)..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-md shadow-cyan-600/20 transition-all shrink-0 cursor-pointer"
              title="Kirim Pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 mt-2 text-center font-medium">
            ChemBot AI memadukan kecerdasan Gemini & basis pengetahuan kimia SMA. Selalu verifikasi fakta ilmiah.
          </div>
        </div>
      </div>
    </div>
  );
};

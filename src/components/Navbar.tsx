import React from 'react';
import { useGame, calculateLevel } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import {
  FlaskConical,
  Volume2,
  VolumeX,
  Bot,
  User,
  LayoutDashboard,
  Grid3X3,
  Flame,
  Award,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openChemBot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openChemBot }) => {
  const { user, toggleSound, logout } = useGame();

  if (!user) return null;

  const levelInfo = calculateLevel(user.xp);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'periodic-table', label: 'Tabel Periodik', icon: Grid3X3 },
    { id: 'virtual-lab', label: 'Lab Simulasi', icon: FlaskConical },
    { id: 'reaction-arena', label: 'Arena Reaksi', icon: Flame },
    { id: 'mini-games', label: 'Kuis & Games', icon: Sparkles },
    { id: 'evaluation', label: 'Evaluasi Akhir', icon: Award },
    { id: 'profile', label: 'Profil Siswa', icon: User },
  ];

  const handleNavClick = (tabId: string) => {
    soundManager.playClick();
    setCurrentTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-cyan-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  ChemQuest
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase tracking-widest">
                  SMA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Petualangan di Dunia Unsur Kimia
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-300 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Student XP & Level Tag */}
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 hover:border-cyan-400 rounded-xl px-3 py-1.5 cursor-pointer transition-colors shadow-sm"
              title="Lihat profil dan progres belajar"
            >
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-extrabold text-slate-800 truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-1.5 py-0.2 rounded border border-cyan-300">
                    Kelas {user.grade}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <span className="text-amber-600 font-bold">{user.xp} XP</span>
                  <span>•</span>
                  <span className="text-purple-700 font-bold">Lvl {levelInfo.level}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
                {levelInfo.level}
              </div>
            </div>

            {/* ChemBot AI Floating Trigger Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                openChemBot();
              }}
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95"
              title="Tanya ChemBot AI"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span className="hidden md:inline">ChemBot AI</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-400 transition-colors"
              title={user.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {user.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-700" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin keluar dari sesi ini? Progresmu tersimpan di peramban ini.')) {
                  logout();
                }
              }}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-400 transition-colors"
              title="Keluar Sesi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1.5 no-scrollbar border-t border-slate-200">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

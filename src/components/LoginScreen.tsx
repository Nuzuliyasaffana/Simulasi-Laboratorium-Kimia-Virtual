import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { GradeLevel } from '../types';
import { soundManager } from '../utils/sound';
import {
  FlaskConical,
  Atom,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass,
  Beaker,
  Cpu,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useGame();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('X');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background floating chemical particles simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const symbols = ['H', 'He', 'Li', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'Fe', 'Cu', 'Au', '⚡', '⚗️', '⚛️'];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      symbol: string;
      alpha: number;
      color: string;
    }[] = [];

    const colors = ['#0284c7', '#2563eb', '#7c3aed', '#059669', '#d97706'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 14 + 11,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle molecular bonds
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.font = `600 ${p.size}px monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, p.x, p.y);
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      soundManager.playWrong();
      setError('Mohon masukkan nama lengkap atau panggilanmu.');
      return;
    }
    if (!grade) {
      soundManager.playWrong();
      setError('Mohon pilih tingkatan kelas SMA kamu.');
      return;
    }
    setError('');
    login(name.trim(), grade);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 bg-grid-pattern overflow-hidden">
      {/* Background Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Futuristic Soft Radial Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-xl backdrop-blur-xl bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-900/10">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <FlaskConical className="w-10 h-10 text-cyan-600 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Game-Based Learning Kimia SMA Berbasis AI
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
              ChemQuest
            </h1>
            <p className="text-sm font-bold text-slate-700 mt-1">
              Petualangan di Dunia Unsur Kimia
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Eksplorasi tabel periodik interaktif, jalankan simulasi reaksi di laboratorium virtual, pecahkan tantangan kimia, dan asah kemampuanmu bersama asisten AI ChemBot!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Input Nama Siswa */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Siswa
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Raden Satria"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 placeholder-slate-400 text-sm font-semibold transition-all outline-none"
                maxLength={40}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Hanya nama panggilan atau nama lengkap untuk sapaan petualanganmu.
            </p>
          </div>

          {/* Dropdown Tingkat Kelas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Tingkat Kelas SMA</span>
              <span className="text-[11px] font-bold text-cyan-700">Materi & soal akan disesuaikan</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { val: 'X' as GradeLevel, title: 'Kelas 1 SMA (X)', desc: 'Struktur Atom & Tabel Periodik' },
                { val: 'XI' as GradeLevel, title: 'Kelas 2 SMA (XI)', desc: 'Stoikiometri & Asam Basa' },
                { val: 'XII' as GradeLevel, title: 'Kelas 3 SMA (XII)', desc: 'Redoks, Elektrokimia & Karbon' },
              ].map(opt => {
                const isSelected = grade === opt.val;
                return (
                  <button
                    type="button"
                    key={opt.val}
                    onClick={() => {
                      soundManager.playClick();
                      setGrade(opt.val);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{opt.title}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-600"></span>}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Aman & Nyaman: ChemQuest tidak meminta kata sandi atau data pribadi lainnya. Progres disimpan di perambanmu.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-0.5 font-bold text-white shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="relative flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-cyan-600 to-indigo-700 px-6 py-3.5 text-sm sm:text-base font-extrabold tracking-wide text-white transition-all">
              <span>Mulai Petualangan Kimia</span>
              <ChevronRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </form>

        {/* Feature Highlights Grid */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Compass className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800">Tabel Periodik</div>
            <div className="text-[9px] text-slate-500">Model Bohr Interaktif</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Beaker className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800">Lab Virtual</div>
            <div className="text-[9px] text-slate-500">4 Eksperimen Nyata</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Atom className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800">Arena Reaksi</div>
            <div className="text-[9px] text-slate-500">Prediksi & Setarakan</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Cpu className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800">ChemBot AI</div>
            <div className="text-[9px] text-slate-500">Tutor Cerdas SMA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

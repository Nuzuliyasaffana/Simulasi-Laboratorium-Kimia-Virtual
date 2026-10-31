import React from 'react';
import { useGame, calculateLevel, ALL_BADGES, INITIAL_MISSIONS } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import {
  Grid3X3,
  FlaskConical,
  Flame,
  Sparkles,
  Award,
  Bot,
  User,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
  Atom,
} from 'lucide-react';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
  openChemBot: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab, openChemBot }) => {
  const { user } = useGame();

  if (!user) return null;

  const levelInfo = calculateLevel(user.xp);

  const completedMissionsCount = user.completedMissions.length;
  const completedBadgesCount = user.badges.length;

  // Grade curriculum highlights
  const gradeCurriculumInfo = {
    'X': {
      title: 'Kurikulum Kimia Kelas X SMA',
      focus: ['Struktur Atom (Proton, Elektron, Neutron)', 'Tabel Periodik & Sifat Keperiodikan Unsur', 'Ikatan Kimia (Ionik & Kovalen)', 'Hukum Dasar Kimia & Persamaan Reaksi'],
      color: 'from-cyan-50 to-blue-50 border-cyan-200',
      badgeText: 'Fase Fondasi Kimia',
    },
    'XI': {
      title: 'Kurikulum Kimia Kelas XI SMA',
      focus: ['Bentuk Molekul & Teori VSEPR', 'Stoikiometri & Konsep Mol Lanjutan', 'Larutan Asam-Basa, Titrasi & pH', 'Termokimia & Laju Reaksi'],
      color: 'from-blue-50 to-purple-50 border-blue-200',
      badgeText: 'Fase Pendalaman Konsep',
    },
    'XII': {
      title: 'Kurikulum Kimia Kelas XII SMA',
      focus: ['Reaksi Redoks & Penyetaraan', 'Elektrokimia (Sel Volta & Elektrolisis)', 'Sifat Koligatif Larutan', 'Kimia Karbon (Gugus Fungsi & Polimer)'],
      color: 'from-purple-50 to-pink-50 border-purple-200',
      badgeText: 'Fase Kimia Terapan & Analisis',
    },
  }[user.grade];

  const gameModes = [
    {
      id: 'periodic-table',
      title: '1. Jelajahi Tabel Periodik',
      subtitle: 'Eksplorasi Interaktif 118 Unsur',
      description: 'Studi nomor atom, massa, konfigurasi elektron, sifat fisik-kimia, kegunaan nyata, serta model atom Bohr animasi partikel!',
      icon: Grid3X3,
      badge: 'Interaktif',
      gradient: 'from-cyan-600 to-blue-600',
      glow: 'glow-cyan',
      stats: '118 Unsur + Model Bohr',
    },
    {
      id: 'virtual-lab',
      title: '2. Laboratorium Simulasi Kimia',
      subtitle: 'Eksperimen Virtual Aman & Akurat',
      description: 'Bentuk ikatan molekul kovalen, amati pembakaran pita magnesium, jalankan titrasi asam basa real-time, dan buktikan hukum Lavoisier.',
      icon: FlaskConical,
      badge: '4 Simulasi Nyata',
      gradient: 'from-emerald-600 to-teal-600',
      glow: 'glow-emerald',
      stats: 'Reaksi Partikel + pH Meter',
    },
    {
      id: 'reaction-arena',
      title: '3. Arena Reaksi Unsur',
      subtitle: 'Prediksi & Setarakan Persamaan',
      description: 'Tantangan menyusun reaktan, produk, dan koefisien reaksi setara dengan 3 tingkat kesulitan: Pemula, Menengah, dan Ahli.',
      icon: Flame,
      badge: 'Tantangan XP',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'glow-amber',
      stats: 'Sintesis, Redoks & Metatesis',
    },
    {
      id: 'mini-games',
      title: '4. Kuis & Tantangan Mini-Games',
      subtitle: '6 Mini-Games Bervariasi & Seru',
      description: 'Teka-Teki Silang (TTS), Tebak Unsur, Cocokkan Pasangan, Susun Persamaan, Benar/Salah Blitz, dan Kasus Detektif Kimia.',
      icon: Sparkles,
      badge: '6 Mode Game',
      gradient: 'from-purple-600 to-indigo-600',
      glow: 'glow-purple',
      stats: 'TTS, Detektif & Memori',
    },
    {
      id: 'evaluation',
      title: '5. Evaluasi Akhir Pembelajaran',
      subtitle: 'Uji Pemahaman Terstandar 15 Soal',
      description: 'Asesmen komprehensif teradaptasi per kelas (X, XI, XII) dengan pembahasan ilmiah lengkap, analisis topik, dan sertifikat nilai.',
      icon: Award,
      badge: 'Standar SMA',
      gradient: 'from-rose-500 to-pink-600',
      glow: 'glow-blue',
      stats: 'Analisis Hasil & KKM 75',
    },
    {
      id: 'chembot-open',
      title: '6. Panduan Belajar AI (ChemBot)',
      subtitle: 'Tutor Kimia Cerdas 24/7',
      description: 'Tanyakan konsep kimia yang belum kamu pahami, minta petunjuk soal bertahap, dan pelajari analogi menarik seputar materi kimia SMA.',
      icon: Bot,
      badge: 'Didukung AI Gemini',
      gradient: 'from-sky-600 to-cyan-600',
      glow: 'glow-cyan',
      stats: 'Tanya Jawab Bebas',
      isChemBot: true,
    },
    {
      id: 'profile',
      title: '7. Profil & Progres Belajar',
      subtitle: 'Lencana Penghargaan & Statistik',
      description: 'Pantau riwayat evaluasi, koleksi lencana kimiawi yang telah kamu raih, dan ringkasan capaian kompetensi belajarmu.',
      icon: User,
      badge: 'Portofolio Siswa',
      gradient: 'from-indigo-600 to-violet-600',
      glow: 'glow-purple',
      stats: `${user.badges.length} / ${ALL_BADGES.length} Lencana`,
    },
  ];

  const handleCardClick = (mode: typeof gameModes[0]) => {
    soundManager.playClick();
    if (mode.isChemBot) {
      openChemBot();
    } else {
      setCurrentTab(mode.id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-50 via-sky-50 to-indigo-50 border border-cyan-200/90 p-6 sm:p-8 shadow-sm">
        {/* Glow ambient background circles */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1.5 shadow-xs">
                <Atom className="w-3.5 h-3.5 text-cyan-600" />
                Laboratorium Kimia Futuristik
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-xs">
                Kelas {user.grade} SMA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Selamat Datang Kembali,{' '}
              <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                {user.name}
              </span>
              ! 🧪
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Jelajahi misteri tabel periodik, racik reaksi kimia tanpa risiko di laboratorium virtual, dan kumpulkan skor XP setinggi mungkin untuk menjadi Master Kimiawan!
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            {/* XP Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span className="text-lg font-black">{user.xp}</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total XP</p>
            </div>

            {/* Level Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-black">Lvl {levelInfo.level}</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate max-w-[100px]">
                {levelInfo.title}
              </p>
            </div>

            {/* Badges Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <Award className="w-4 h-4" />
                <span className="text-lg font-black">{completedBadgesCount} / {ALL_BADGES.length}</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lencana</p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 flex items-center gap-1.5">
              <span>Gelar Saat Ini:</span>
              <strong className="text-cyan-700">{levelInfo.title}</strong>
            </span>
            <span className="text-slate-500 font-medium">
              Progres Menuju Level Berikutnya: <strong className="text-slate-800">{levelInfo.progress}%</strong>
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 border border-slate-300/80 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 transition-all duration-700 shadow-xs"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum Focus for Student Grade */}
      <div className={`p-4 sm:p-5 rounded-2xl border bg-gradient-to-r ${gradeCurriculumInfo.color} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-700" />
            <h3 className="text-sm font-bold text-slate-900">{gradeCurriculumInfo.title}</h3>
            <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-300">
              {gradeCurriculumInfo.badgeText}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {gradeCurriculumInfo.focus.map((item, idx) => (
              <span key={idx} className="text-[11px] bg-white/90 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-xs">
                • {item}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            openChemBot();
          }}
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Tanya Rangkuman Materi</span>
        </button>
      </div>

      {/* Main Game Modes Menu Grid (7 Modes) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CompassIcon className="w-5 h-5 text-cyan-600" />
            Menu Utama Petualangan Kimia
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Pilih mode pembelajaran di bawah untuk memulai eksperimen dan tantangan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {gameModes.map(mode => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => handleCardClick(mode)}
                className="group relative overflow-hidden rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-cyan-400 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-xs"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${mode.gradient} p-0.5 shadow-md shadow-cyan-600/15`}>
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-800 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-cyan-800 border border-slate-200">
                    {mode.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {mode.title}
                </h3>
                <p className="text-xs font-bold text-cyan-700 mb-2">
                  {mode.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {mode.description}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-semibold">{mode.stats}</span>
                  <div className="flex items-center gap-1 font-bold text-cyan-700 group-hover:translate-x-1 transition-transform">
                    <span>Mulai</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Missions & Badges Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Missions */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-600" />
              Misi Pembelajaran Kimia
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {completedMissionsCount} dari {INITIAL_MISSIONS.length} Selesai
            </span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_MISSIONS.map(mission => {
              const isCompleted = user.completedMissions.includes(mission.id);
              return (
                <div
                  key={mission.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mission.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>
                          {mission.title}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">
                    +{mission.xpReward} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lencana Terbuka */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Lencana Kehormatan Siswa
            </h3>
            <button
              onClick={() => {
                soundManager.playClick();
                setCurrentTab('profile');
              }}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
            >
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ALL_BADGES.slice(0, 8).map(badge => {
              const isUnlocked = user.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
                  }`}
                  title={isUnlocked ? `${badge.name}: ${badge.description}` : `Terkunci: ${badge.condition}`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{badge.name}</div>
                  <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                    {isUnlocked ? 'Terbuka' : 'Terkunci'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function CompassIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

import React, { useState } from 'react';
import { useGame, calculateLevel, ALL_BADGES, INITIAL_MISSIONS } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import {
  User,
  ArrowLeft,
  Award,
  Zap,
  Trophy,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';

interface ProfileViewProps {
  onBackToDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBackToDashboard }) => {
  const { user, resetProgress } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!user) return null;

  const levelInfo = calculateLevel(user.xp);

  const gradeSyllabus = {
    'X': [
      { topic: 'Struktur Atom & Model Atom Bohr', desc: 'Proton, neutron, elektron, isotop, isobar, isoton, serta spektrum atom.' },
      { topic: 'Tabel Periodik & Sifat Keperiodikan', desc: 'Jari-jari atom, energi ionisasi, afinitas elektron, dan keelektronegatifan.' },
      { topic: 'Ikatan Kimia Dasar', desc: 'Kaidah oktet/duplet, ikatan ionik, ikatan kovalen tunggal/rangkap, dan ikatan logam.' },
      { topic: 'Hukum Dasar Kimia & Reaksi', desc: 'Hukum Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro, dan penyetaraan reaksi.' },
    ],
    'XI': [
      { topic: 'Bentuk Molekul & Teori VSEPR', desc: 'Domain elektron, PEI, PEB, sudut ikatan, kepolaran molekul, dan gaya antarmolekul.' },
      { topic: 'Stoikiometri & Konsep Mol', desc: 'Massa molar, volume molar gas STP/RTP, rumus empiris/molekul, dan pereaksi pembatas.' },
      { topic: 'Larutan Asam-Basa & Titrasi', desc: 'Teori Arrhenius/Bronsted-Lowry, trayek pH indikator, titrasi netralisasi, kurva titrasi.' },
      { topic: 'Termokimia & Laju Reaksi', desc: 'Reaksi eksoterm/endoterm, entalpi pembentukan standar, teori tumbukan, faktor laju reaksi.' },
    ],
    'XII': [
      { topic: 'Reaksi Redoks & Penyetaraan', desc: 'Metode bilangan oksidasi (PBO) dan metode setengah reaksi (ion-elektron) suasana asam/basa.' },
      { topic: 'Elektrokimia (Sel Volta & Elektrolisis)', desc: 'Deret Volta, potensial sel standar E°sel, hukum Faraday I & II, pencegahan korosi logam.' },
      { topic: 'Sifat Koligatif Larutan', desc: 'Penurunan tekanan uap, kenaikan titik didih, penurunan titik beku, dan tekanan osmotik van\'t Hoff.' },
      { topic: 'Kimia Karbon & Makromolekul', desc: 'Gugus fungsi (alkohol, eter, alkanal, alkanon, karboksilat, ester), benzena, polimer, karbohidrat, protein.' },
    ],
  }[user.grade];

  const handleConfirmReset = () => {
    soundManager.playWrong();
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToDashboard();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Profil & Riwayat Belajar Siswa
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Portofolio pencapaian, koleksi lencana kehormatan, dan silabus kurikulum kimia SMA
            </p>
          </div>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setShowResetConfirm(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progres Belajar</span>
        </button>
      </div>

      {/* Main Student Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Kelas {user.grade} SMA
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-bold mt-0.5">
                Gelar: {levelInfo.title} (Level {levelInfo.level})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Total Akumulasi XP</div>
              <div className="text-lg font-black text-amber-600">{user.xp} XP</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Lencana Diraih</div>
              <div className="text-lg font-black text-purple-600">
                {user.badges.length} / {ALL_BADGES.length}
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Level {levelInfo.level}: {levelInfo.title}</span>
            <span>Menuju Level Berikutnya: {levelInfo.progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Collection Grid (All 8 Badges) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Koleksi Lencana Kehormatan Kimiawan ({user.badges.length} dari {ALL_BADGES.length} Terbuka)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-purple-50/70 to-white border-purple-200 shadow-sm shadow-purple-500/5'
                    : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="text-sm font-black text-slate-900">{badge.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                  {badge.description}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold">
                  {isUnlocked ? (
                    <span className="text-emerald-700 flex items-center justify-center gap-1 font-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Lencana Berhasil Diraih
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">Syarat: {badge.condition}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade Curriculum Overview */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600" />
          Silabus Materi Kimia Terstandar (Kelas {user.grade} SMA)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gradeSyllabus.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-black text-cyan-800">
                Topik {idx + 1}: {item.topic}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation History */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          Riwayat Ujian Evaluasi Akhir
        </h3>

        {user.evaluationHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
            Belum ada catatan evaluasi akhir. Selesaikan evaluasi di menu Evaluasi Akhir untuk melihat riwayat nilaimu!
          </div>
        ) : (
          <div className="space-y-2">
            {user.evaluationHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-500 font-medium">{item.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-extrabold text-slate-900">Evaluasi Kelas {item.grade}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-black ${item.score >= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Skor: {item.score} / 100
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">({item.score >= 75 ? 'Tuntas' : 'Remedial'})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-rose-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-black text-slate-900">Reset Seluruh Progres Belajar?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tindakan ini akan mengembalikan XP menjadi 0, mengunci kembali seluruh lencana kehormatan, dan membersihkan riwayat evaluasi. Identitas nama dan jenjang kelasmu akan tetap dipertahankan.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Ya, Reset Progres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

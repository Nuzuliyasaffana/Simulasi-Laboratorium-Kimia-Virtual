import React, { useState } from 'react';
import { REACTION_CHALLENGES } from '../../data/arenaReactions';
import { ReactionChallenge, GradeLevel } from '../../types';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import {
  Flame,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';

interface ReactionArenaProps {
  onBackToDashboard: () => void;
  openChemBotWithTopic?: (topic: string) => void;
}

export const ReactionArena: React.FC<ReactionArenaProps> = ({ onBackToDashboard, openChemBotWithTopic }) => {
  const { user, addXP, unlockBadge } = useGame();

  const [selectedDifficulty, setSelectedDifficulty] = useState<'Pemula' | 'Menengah' | 'Ahli'>('Pemula');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<GradeLevel | 'all'>(user?.grade || 'all');
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);

  const [userReactantCoeffs, setUserReactantCoeffs] = useState<Record<number, number>>({});
  const [userProductCoeffs, setUserProductCoeffs] = useState<Record<number, number>>({});
  const [userReactionType, setUserReactionType] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<'success' | 'failed' | null>(null);

  const filteredChallenges = REACTION_CHALLENGES.filter(c => {
    const matchesDiff = c.difficulty === selectedDifficulty;
    const matchesGrade = selectedGradeFilter === 'all' || c.grade === selectedGradeFilter;
    return matchesDiff && (matchesGrade || c.difficulty === 'Pemula');
  });

  const currentChallenge = filteredChallenges[activeChallengeIndex] || filteredChallenges[0] || REACTION_CHALLENGES[0];

  const handleDifficultyChange = (diff: 'Pemula' | 'Menengah' | 'Ahli') => {
    soundManager.playClick();
    setSelectedDifficulty(diff);
    setActiveChallengeIndex(0);
    resetInputs();
  };

  const resetInputs = () => {
    setUserReactantCoeffs({});
    setUserProductCoeffs({});
    setUserReactionType('');
    setShowHint(false);
    setEvalResult(null);
  };

  const handleReactantCoeffChange = (index: number, delta: number) => {
    soundManager.playClick();
    const current = userReactantCoeffs[index] ?? 1;
    const next = Math.max(1, Math.min(10, current + delta));
    setUserReactantCoeffs(prev => ({ ...prev, [index]: next }));
  };

  const handleProductCoeffChange = (index: number, delta: number) => {
    soundManager.playClick();
    const current = userProductCoeffs[index] ?? 1;
    const next = Math.max(1, Math.min(10, current + delta));
    setUserProductCoeffs(prev => ({ ...prev, [index]: next }));
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;

    const isTypeCorrect = userReactionType === currentChallenge.reactionType;
    const areReactantsCorrect = currentChallenge.reactants.every(
      (r, idx) => (userReactantCoeffs[idx] ?? 1) === r.coefficient
    );
    const areProductsCorrect = currentChallenge.products.every(
      (p, idx) => (userProductCoeffs[idx] ?? 1) === p.coefficient
    );

    if (areReactantsCorrect && areProductsCorrect && isTypeCorrect) {
      soundManager.playLevelUp();
      setEvalResult('success');
      addXP(currentChallenge.xpReward, `Menyelesaikan Tantangan ${currentChallenge.title}`);
      unlockBadge('reaction_master');
    } else {
      soundManager.playWrong();
      setEvalResult('failed');
    }
  };

  const reactionTypes = ['Sintesis', 'Dekomposisi', 'Penggantian Tunggal', 'Pertukaran Ganda', 'Redoks'];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToDashboard();
            }}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-slate-900 transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500" />
              Arena Reaksi Unsur & Persamaan Kimia
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Prediksi pembentukan produk, tentukan jenis reaksi, dan setarakan koefisien atom
            </p>
          </div>
        </div>

        {/* Difficulty Level Switchers */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
          {(['Pemula', 'Menengah', 'Ahli'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Selectors Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filteredChallenges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => {
              soundManager.playClick();
              setActiveChallengeIndex(i);
              resetInputs();
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
              activeChallengeIndex === i
                ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-400/40 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
            }`}
          >
            Misi {i + 1}: {c.title}
          </button>
        ))}
      </div>

      {/* Main Challenge Arena Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Challenge Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-widest">
                Tingkat {currentChallenge.difficulty} • Kelas {currentChallenge.grade}
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                +{currentChallenge.xpReward} XP
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{currentChallenge.title}</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">{currentChallenge.description}</p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-cyan-700 hover:border-cyan-400 text-xs font-bold transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk'}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 space-y-1.5 text-xs text-cyan-900 animate-fadeIn">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
              Petunjuk Penyetaraan ChemQuest:
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-700 font-medium">
              {currentChallenge.hints.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 1: Interactive Equation Balancer Formula */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Langkah 1: Tentukan Koefisien Reaksi Setara</span>
            <span className="text-[11px] text-slate-500 font-normal">Gunakan tombol ▲ / ▼ pada setiap zat</span>
          </label>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-center gap-3 text-center">
            {/* Reactants */}
            {currentChallenge.reactants.map((r, idx) => {
              const coeff = userReactantCoeffs[idx] ?? 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleReactantCoeffChange(idx, 1)}
                        className="w-5 h-4 rounded bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[10px] flex items-center justify-center"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleReactantCoeffChange(idx, -1)}
                        className="w-5 h-4 rounded bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[10px] flex items-center justify-center"
                      >
                        ▼
                      </button>
                    </div>

                    <span className="font-mono text-xl font-black text-amber-600 w-5 text-center">
                      {coeff}
                    </span>

                    <div className="text-left pl-1">
                      <span className="text-lg font-black text-slate-900 font-mono">{r.formula}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({r.state})</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Reaction Arrow */}
            <div className="flex items-center px-2 text-cyan-700 font-black">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Products */}
            {currentChallenge.products.map((p, idx) => {
              const coeff = userProductCoeffs[idx] ?? 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleProductCoeffChange(idx, 1)}
                        className="w-5 h-4 rounded bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[10px] flex items-center justify-center"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleProductCoeffChange(idx, -1)}
                        className="w-5 h-4 rounded bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[10px] flex items-center justify-center"
                      >
                        ▼
                      </button>
                    </div>

                    <span className="font-mono text-xl font-black text-cyan-700 w-5 text-center">
                      {coeff}
                    </span>

                    <div className="text-left pl-1">
                      <span className="text-lg font-black text-slate-900 font-mono">{p.formula}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({p.state})</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step 2: Classify Reaction Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Langkah 2: Klasifikasikan Jenis Reaksi Kimia
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {reactionTypes.map(t => {
              const isSelected = userReactionType === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    soundManager.playClick();
                    setUserReactionType(t);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-400 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 text-xs font-semibold'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Result Box */}
        {evalResult === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Sempurna! Persamaan reaksi setara dan jenis reaksimu benar! (+{currentChallenge.xpReward} XP)
            </div>
            <div className="font-mono text-xs font-bold text-slate-900 bg-white p-2.5 rounded-xl border border-emerald-200">
              {currentChallenge.balancedEquation}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              <strong>Penjelasan Kimia:</strong> {currentChallenge.explanation}
            </p>
          </div>
        )}

        {evalResult === 'failed' && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between text-xs font-bold text-rose-800 animate-shake">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Jawaban belum tepat! Periksa kembali jumlah atom di kiri & kanan atau jenis reaksinya.</span>
            </div>
            <button
              onClick={() => setEvalResult(null)}
              className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold"
            >
              Coba Ulang
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={resetInputs}
            className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold"
          >
            Reset Pilihan
          </button>

          <button
            onClick={checkAnswer}
            disabled={!userReactionType}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 text-white text-xs font-black shadow-md transition-all"
          >
            Periksa Persamaan Reaksi
          </button>
        </div>
      </div>
    </div>
  );
};

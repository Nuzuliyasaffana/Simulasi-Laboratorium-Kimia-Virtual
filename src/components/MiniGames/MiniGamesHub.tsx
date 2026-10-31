import React, { useState } from 'react';
import {
  POLISHED_CROSSWORD,
  GUESS_ELEMENT_SCENARIOS,
  MATCH_PAIR_SETS,
  BALANCE_GAME_ITEMS,
  TRUE_FALSE_STATEMENTS,
  DETECTIVE_CASES,
} from '../../data/miniGames';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import {
  Sparkles,
  ArrowLeft,
  Grid,
  HelpCircle,
  Layers,
  Sliders,
  CheckSquare,
  Search,
  Lightbulb,
} from 'lucide-react';

interface MiniGamesHubProps {
  onBackToDashboard: () => void;
  openChemBotWithTopic?: (topic: string) => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onBackToDashboard, openChemBotWithTopic }) => {
  const { addXP, recordMiniGameScore, unlockBadge } = useGame();
  const [activeGame, setActiveGame] = useState<'tts' | 'tebak' | 'match' | 'susun' | 'tf' | 'detective'>('tts');

  // 1. TTS Kimia State
  const [crosswordInputs, setCrosswordInputs] = useState<Record<string, string>>({});
  const [ttsChecked, setTtsChecked] = useState<boolean>(false);
  const [ttsScore, setTtsScore] = useState<number | null>(null);

  // 2. Tebak Unsur State
  const [tebakIndex, setTebakIndex] = useState<number>(0);
  const [tebakClueCount, setTebakClueCount] = useState<number>(1);
  const [tebakResult, setTebakResult] = useState<'correct' | 'wrong' | null>(null);

  // 3. Match Pairs State
  const [matchSetIndex, setMatchSetIndex] = useState<number>(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const currentMatchSet = MATCH_PAIR_SETS[matchSetIndex];

  // 4. Susun Persamaan State
  const [susunIndex, setSusunIndex] = useState<number>(0);
  const currentSusun = BALANCE_GAME_ITEMS[susunIndex];
  const [susunInputs, setSusunInputs] = useState<Record<string, number>>({});
  const [susunResult, setSusunResult] = useState<boolean | null>(null);

  // 5. True/False Blitz State
  const [tfIndex, setTfIndex] = useState<number>(0);
  const [tfScore, setTfScore] = useState<number>(0);
  const [tfFeedback, setTfFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  // 6. Detektif Kimia State
  const [caseIndex, setCaseIndex] = useState<number>(0);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [caseSolved, setCaseSolved] = useState<boolean | null>(null);

  // --- TTS LOGIC ---
  const handleCellChange = (r: number, c: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    setCrosswordInputs(prev => ({ ...prev, [`${r}-${c}`]: char }));
  };

  const handleCheckTTS = () => {
    let correctCells = 0;
    let totalLetterCells = 0;

    POLISHED_CROSSWORD.grid.forEach((row, r) => {
      row.forEach((letter, c) => {
        if (letter !== null) {
          totalLetterCells++;
          const userVal = crosswordInputs[`${r}-${c}`] || '';
          if (userVal.toUpperCase() === letter) {
            correctCells++;
          }
        }
      });
    });

    const score = Math.round((correctCells / totalLetterCells) * 100);
    setTtsScore(score);
    setTtsChecked(true);

    if (score >= 80) {
      soundManager.playLevelUp();
      addXP(80, 'Teka-Teki Silang Kimia Selesai');
      unlockBadge('puzzle_solver');
      recordMiniGameScore('crossword', score);
    } else {
      soundManager.playWrong();
    }
  };

  const handleTTSHint = () => {
    soundManager.playClick();
    for (let r = 0; r < POLISHED_CROSSWORD.size; r++) {
      for (let c = 0; c < POLISHED_CROSSWORD.size; c++) {
        const target = POLISHED_CROSSWORD.grid[r][c];
        if (target && (crosswordInputs[`${r}-${c}`] || '').toUpperCase() !== target) {
          setCrosswordInputs(prev => ({ ...prev, [`${r}-${c}`]: target }));
          return;
        }
      }
    }
  };

  // --- MATCH PAIRS LOGIC ---
  const handleLeftClick = (id: string) => {
    soundManager.playClick();
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft) return;
    if (selectedLeft === id) {
      soundManager.playSuccess();
      const nextMatched = [...matchedPairs, id];
      setMatchedPairs(nextMatched);
      setSelectedLeft(null);

      if (nextMatched.length === currentMatchSet.pairs.length) {
        soundManager.playLevelUp();
        addXP(70, `Selesai Mencocokkan: ${currentMatchSet.title}`);
        recordMiniGameScore('match_pairs', 100);
      }
    } else {
      soundManager.playWrong();
      setSelectedLeft(null);
    }
  };

  // --- DETEKTIF LOGIC ---
  const currentCase = DETECTIVE_CASES[caseIndex];

  const handleSolveCase = () => {
    if (!selectedSuspect) return;
    if (selectedSuspect === currentCase.correctSuspect) {
      soundManager.playLevelUp();
      setCaseSolved(true);
      addXP(100, `Memecahkan ${currentCase.title}`);
      unlockBadge('detective');
      recordMiniGameScore('detective', 100);
    } else {
      soundManager.playWrong();
      setCaseSolved(false);
    }
  };

  const gameNav = [
    { id: 'tts', label: '1. Teka-Teki Silang', icon: Grid },
    { id: 'tebak', label: '2. Tebak Unsur', icon: HelpCircle },
    { id: 'match', label: '3. Cocokkan Pasangan', icon: Layers },
    { id: 'susun', label: '4. Susun Persamaan', icon: Sliders },
    { id: 'tf', label: '5. Benar atau Salah', icon: CheckSquare },
    { id: 'detective', label: '6. Detektif Kimia', icon: Search },
  ];

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
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-purple-400 text-slate-700 hover:text-slate-900 transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Kuis & Tantangan Mini-Games
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              6 Mini-game kimia interaktif: TTS, tebak petunjuk, memori pasangan, persamaan reaksi, dan investigasi kasus
            </p>
          </div>
        </div>
      </div>

      {/* Mini-Games Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {gameNav.map(g => {
          const Icon = g.icon;
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                soundManager.playClick();
                setActiveGame(g.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TEKA-TEKI SILANG KIMIA (TTS) */}
      {activeGame === 'tts' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Grid className="w-5 h-5 text-purple-600" />
                Teka-Teki Silang Kimia Nusantara
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Isi kotak huruf berdasarkan petunjuk mendatar dan menurun seputar unsur dan reaksi kimia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTTSHint}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-500 text-cyan-800 text-xs font-bold flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" />
                Buka 1 Huruf
              </button>
              <button
                onClick={handleCheckTTS}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs"
              >
                Periksa Jawaban
              </button>
            </div>
          </div>

          {ttsScore !== null && (
            <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
              ttsScore >= 80 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              <span>Skor Ketepatan TTS: {ttsScore}% ({ttsScore >= 80 ? '🎉 Selamat! Lencana Pemecah Teka-Teki Terbuka!' : 'Masih ada huruf yang belum sesuai. Coba periksa lagi!'})</span>
              <span className="text-amber-700 font-black">+{Math.round(ttsScore * 0.8)} XP</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Crossword 8x8 Grid */}
            <div className="flex justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto shadow-2xs">
              <div className="grid grid-cols-8 gap-1.5 w-max">
                {POLISHED_CROSSWORD.grid.map((row, r) =>
                  row.map((letter, c) => {
                    const isPlayable = letter !== null;
                    const cellNumber = POLISHED_CROSSWORD.numbers[r][c];
                    const userVal = crosswordInputs[`${r}-${c}`] || '';
                    const isCorrect = userVal.toUpperCase() === letter;

                    if (!isPlayable) {
                      return <div key={`${r}-${c}`} className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-200/80 rounded-md" />;
                    }

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center font-mono font-black text-sm sm:text-base transition-all ${
                          ttsChecked
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                              : 'bg-rose-100 border-rose-500 text-rose-900'
                            : 'bg-white border-slate-300 text-slate-900 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20'
                        }`}
                      >
                        {cellNumber && (
                          <span className="absolute top-0.5 left-1 text-[8px] font-sans font-bold text-slate-500 leading-none">
                            {cellNumber}
                          </span>
                        )}
                        <input
                          type="text"
                          maxLength={1}
                          value={userVal}
                          onChange={e => handleCellChange(r, c, e.target.value)}
                          className="w-full h-full text-center bg-transparent outline-none uppercase font-mono font-black text-slate-900"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Clues Panel */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                  Mendatar (Across):
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {POLISHED_CROSSWORD.clues
                    .filter(c => c.direction === 'across')
                    .map(clue => (
                      <div key={clue.number} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <strong className="text-cyan-800">{clue.number}.</strong> {clue.clue}{' '}
                        <span className="text-[10px] text-slate-500 font-mono">({clue.answer.length} Huruf)</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Menurun (Down):
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {POLISHED_CROSSWORD.clues
                    .filter(c => c.direction === 'down')
                    .map(clue => (
                      <div key={clue.number} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <strong className="text-purple-800">{clue.number}.</strong> {clue.clue}{' '}
                        <span className="text-[10px] text-slate-500 font-mono">({clue.answer.length} Huruf)</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEBAK UNSUR BERTAHAP */}
      {activeGame === 'tebak' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {(() => {
            const currentGuess = GUESS_ELEMENT_SCENARIOS[tebakIndex];
            const handleAnswer = (choice: string) => {
              if (choice === currentGuess.targetElement) {
                soundManager.playSuccess();
                setTebakResult('correct');
                addXP(70, `Tebak Unsur ${currentGuess.targetElement}`);
              } else {
                soundManager.playWrong();
                setTebakResult('wrong');
              }
            };

            const nextQuestion = () => {
              soundManager.playClick();
              setTebakIndex((tebakIndex + 1) % GUESS_ELEMENT_SCENARIOS.length);
              setTebakClueCount(1);
              setTebakResult(null);
            };

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-purple-600" />
                      Tebak Unsur Kimia (Kasus {tebakIndex + 1}/{GUESS_ELEMENT_SCENARIOS.length})
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Buka petunjuk bertahap. Semakin sedikit petunjuk yang dibuka, semakin besar skor XP!
                    </p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold"
                  >
                    Kasus Berikutnya
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Petunjuk Terbuka ({tebakClueCount} / {currentGuess.clues.length}):</span>
                    {tebakClueCount < currentGuess.clues.length && !tebakResult && (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setTebakClueCount(p => p + 1);
                        }}
                        className="text-cyan-700 hover:underline font-bold flex items-center gap-1"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        Buka Petunjuk Baru
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {currentGuess.clues.slice(0, tebakClueCount).map((clue, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                        {clue}
                      </div>
                    ))}
                  </div>
                </div>

                {tebakResult === 'correct' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center justify-between">
                    <span>🎉 Tebakanmu Tepat! Unsur tersebut adalah {currentGuess.targetElement} ({currentGuess.symbol}). (+70 XP)</span>
                    <button onClick={nextQuestion} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">
                      Lanjut
                    </button>
                  </div>
                )}
                {tebakResult === 'wrong' && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-800">
                    ❌ Belum tepat. Baca kembali petunjuknya dan coba pilihan lain!
                  </div>
                )}

                {!tebakResult && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentGuess.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 text-center text-sm font-black text-slate-900 hover:text-purple-700 transition-all shadow-2xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. COCOKKAN PASANGAN */}
      {activeGame === 'match' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Cocokkan Pasangan: {currentMatchSet.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Klik kartu di sisi kiri, lalu klik pasangannya yang sesuai di sisi kanan!
              </p>
            </div>

            <div className="flex gap-1.5">
              {MATCH_PAIR_SETS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setMatchSetIndex(idx);
                    setSelectedLeft(null);
                    setMatchedPairs([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    matchSetIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  Set {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Items */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Kolom Kiri:</span>
              {currentMatchSet.pairs.map(p => {
                const isMatched = matchedPairs.includes(p.id);
                const isSelected = selectedLeft === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={isMatched}
                    onClick={() => handleLeftClick(p.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {p.left}
                  </button>
                );
              })}
            </div>

            {/* Right Items */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pasangkan dengan Kolom Kanan:</span>
              {[...currentMatchSet.pairs].reverse().map(p => {
                const isMatched = matchedPairs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    disabled={isMatched || !selectedLeft}
                    onClick={() => handleRightClick(p.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400'
                    }`}
                  >
                    {p.right}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUSUN PERSAMAAN REAKSI */}
      {activeGame === 'susun' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                Susun Koefisien Reaksi Setara ({susunIndex + 1}/{BALANCE_GAME_ITEMS.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium">{currentSusun.title} - {currentSusun.grade}</p>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setSusunIndex((susunIndex + 1) % BALANCE_GAME_ITEMS.length);
                setSusunInputs({});
                setSusunResult(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
            >
              Soal Lain
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-center gap-3">
            {/* Reactants */}
            {currentSusun.unbalancedParts.reactants.map((r, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={susunInputs[`r-${idx}`] ?? 1}
                    onChange={e => setSusunInputs(p => ({ ...p, [`r-${idx}`]: parseInt(e.target.value) || 1 }))}
                    className="w-10 h-8 rounded bg-slate-50 text-center font-mono font-bold text-amber-600 border border-slate-300 outline-none"
                  />
                  <span className="font-mono font-black text-slate-900 text-base">{r.formula}</span>
                </div>
              </React.Fragment>
            ))}

            <span className="text-2xl font-bold text-cyan-700 px-2">→</span>

            {/* Products */}
            {currentSusun.unbalancedParts.products.map((p, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={susunInputs[`p-${idx}`] ?? 1}
                    onChange={e => setSusunInputs(prev => ({ ...prev, [`p-${idx}`]: parseInt(e.target.value) || 1 }))}
                    className="w-10 h-8 rounded bg-slate-50 text-center font-mono font-bold text-cyan-700 border border-slate-300 outline-none"
                  />
                  <span className="font-mono font-black text-slate-900 text-base">{p.formula}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {susunResult === true && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 space-y-1">
              <div className="font-bold">🎉 Persamaan Setara Sempurna! (+60 XP)</div>
              <div>{currentSusun.explanation}</div>
            </div>
          )}

          {susunResult === false && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-800">
              ❌ Jumlah atom belum seimbang antara reaktan dan produk. Coba hitung kembali!
            </div>
          )}

          <button
            onClick={() => {
              const reactantsOk = currentSusun.unbalancedParts.reactants.every(
                (r, idx) => (susunInputs[`r-${idx}`] ?? 1) === r.correctCoeff
              );
              const productsOk = currentSusun.unbalancedParts.products.every(
                (p, idx) => (susunInputs[`p-${idx}`] ?? 1) === p.correctCoeff
              );
              if (reactantsOk && productsOk) {
                soundManager.playLevelUp();
                setSusunResult(true);
                addXP(60, `Setarakan ${currentSusun.title}`);
              } else {
                soundManager.playWrong();
                setSusunResult(false);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm"
          >
            Cek Penyetaraan Atom
          </button>
        </div>
      )}

      {/* 5. BENAR ATAU SALAH (TRUE/FALSE BLITZ) */}
      {activeGame === 'tf' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {(() => {
            const currentTf = TRUE_FALSE_STATEMENTS[tfIndex];
            const handleTfChoice = (userChoice: boolean) => {
              const isCorrect = userChoice === currentTf.isTrue;
              if (isCorrect) {
                soundManager.playSuccess();
                setTfScore(p => p + 1);
                addXP(25, 'Benar atau Salah');
              } else {
                soundManager.playWrong();
              }
              setTfFeedback({ isCorrect, explanation: currentTf.explanation });
            };

            const handleNextTf = () => {
              soundManager.playClick();
              setTfIndex((tfIndex + 1) % TRUE_FALSE_STATEMENTS.length);
              setTfFeedback(null);
            };

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                      Pernyataan Kimia: Benar atau Salah? ({tfIndex + 1}/{TRUE_FALSE_STATEMENTS.length})
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Poin Benar: {tfScore}</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pernyataan Konsep:</div>
                  <p className="text-base sm:text-lg font-extrabold text-slate-900 max-w-xl mx-auto leading-relaxed">
                    "{currentTf.statement}"
                  </p>
                </div>

                {tfFeedback ? (
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    tfFeedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}>
                    <div className="font-bold">
                      {tfFeedback.isCorrect ? '✅ Jawabanmu Tepat!' : '❌ Jawabanmu Belum Tepat!'}
                    </div>
                    <p>{tfFeedback.explanation}</p>
                    <button
                      onClick={handleNextTf}
                      className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                    >
                      Pernyataan Selanjutnya →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleTfChoice(true)}
                      className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-black shadow-sm"
                    >
                      BENAR
                    </button>
                    <button
                      onClick={() => handleTfChoice(false)}
                      className="py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-base font-black shadow-sm"
                    >
                      SALAH
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 6. TANTANGAN DETEKTIF KIMIA */}
      {activeGame === 'detective' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-[10px] font-black uppercase tracking-widest">
                  Kasus Investigasi #{caseIndex + 1}
                </span>
                <span className="text-xs font-bold text-amber-600">+100 XP</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">{currentCase.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCaseIndex((caseIndex + 1) % DETECTIVE_CASES.length);
                  setSelectedSuspect(null);
                  setCaseSolved(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:text-slate-900"
              >
                Ganti Berkas Kasus
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-amber-700 block mb-1">📋 Catatan Bukti Lapangan:</span>
            {currentCase.caseBackground}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
              Temuan Forensik Laboratorium:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {currentCase.clues.map((clue, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                  {clue}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">{currentCase.question}</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCase.suspects.map(suspect => {
                const isSelected = selectedSuspect === suspect.name;
                return (
                  <button
                    key={suspect.name}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedSuspect(suspect.name);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">{suspect.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{suspect.motive}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {caseSolved === true && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-1.5 animate-fadeIn">
              <div className="text-sm font-bold text-emerald-800">🕵️ Kasus Berhasil Dipecahkan! (+100 XP)</div>
              <p className="text-slate-700 font-medium">{currentCase.caseDebrief}</p>
            </div>
          )}

          {caseSolved === false && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-800">
              ❌ Dugaanmu belum sesuai bukti-bukti forensik. Periksa kembali ketiga petunjuk lab!
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSolveCase}
              disabled={!selectedSuspect}
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white text-xs font-black shadow-md transition-all"
            >
              Simpulkan Hasil Investigasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

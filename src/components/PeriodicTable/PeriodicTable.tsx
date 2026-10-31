import React, { useState, useMemo } from 'react';
import { ALL_ELEMENTS, CATEGORY_COLORS } from '../../data/elements';
import { ChemicalElement, ElementCategory } from '../../types';
import { BohrAtomModel } from './BohrAtomModel';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import {
  Search,
  X,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Info,
  CheckCircle2,
  Atom,
  Shuffle,
  Lightbulb,
} from 'lucide-react';

interface PeriodicTableProps {
  onBackToDashboard: () => void;
  openChemBotWithTopic?: (topic: string) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ onBackToDashboard, openChemBotWithTopic }) => {
  const { markElementViewed, addXP, unlockBadge } = useGame();
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ElementCategory | 'all'>('all');
  const [activeState, setActiveState] = useState<'all' | 'padat' | 'cair' | 'gas'>('all');

  // Mini-Game modes inside Periodic Table
  const [activeMode, setActiveMode] = useState<'table' | 'guess' | 'sort'>('table');

  // Tebak Unsur State
  const [guessTarget, setGuessTarget] = useState<ChemicalElement | null>(null);
  const [guessClueIndex, setGuessClueIndex] = useState(0);
  const [guessResult, setGuessResult] = useState<'correct' | 'wrong' | null>(null);
  const [guessOptions, setGuessOptions] = useState<ChemicalElement[]>([]);

  // Sort Challenge State
  const [sortElements, setSortElements] = useState<ChemicalElement[]>([]);
  const [sortSelectedOrder, setSortSelectedOrder] = useState<number[]>([]);
  const [sortFeedback, setSortFeedback] = useState<string | null>(null);

  // Initialize Tebak Unsur
  const startGuessGame = () => {
    soundManager.playClick();
    const commonElements = ALL_ELEMENTS.filter(e => e.number <= 36 || [47, 50, 53, 79, 80, 82].includes(e.number));
    const target = commonElements[Math.floor(Math.random() * commonElements.length)];
    const otherChoices = commonElements
      .filter(e => e.number !== target.number)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const allChoices = [target, ...otherChoices].sort(() => 0.5 - Math.random());

    setGuessTarget(target);
    setGuessOptions(allChoices);
    setGuessClueIndex(0);
    setGuessResult(null);
    setActiveMode('guess');
  };

  // Initialize Sort Challenge
  const startSortGame = () => {
    soundManager.playClick();
    const subset = [...ALL_ELEMENTS.filter(e => e.number <= 20)]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    setSortElements(subset);
    setSortSelectedOrder([]);
    setSortFeedback(null);
    setActiveMode('sort');
  };

  const handleGuessSubmit = (element: ChemicalElement) => {
    if (!guessTarget) return;
    if (element.number === guessTarget.number) {
      soundManager.playSuccess();
      setGuessResult('correct');
      const xpGained = Math.max(30, 80 - guessClueIndex * 15);
      addXP(xpGained, `Tebak Unsur ${guessTarget.indonesianName}`);
      unlockBadge('periodic_master');
    } else {
      soundManager.playWrong();
      setGuessResult('wrong');
    }
  };

  const handleSortItemClick = (elementNumber: number) => {
    soundManager.playClick();
    if (sortSelectedOrder.includes(elementNumber)) {
      setSortSelectedOrder(prev => prev.filter(num => num !== elementNumber));
    } else {
      const nextOrder = [...sortSelectedOrder, elementNumber];
      setSortSelectedOrder(nextOrder);

      if (nextOrder.length === sortElements.length) {
        const isCorrect = nextOrder.every((num, idx) => {
          if (idx === 0) return true;
          return num > nextOrder[idx - 1];
        });

        if (isCorrect) {
          soundManager.playLevelUp();
          setSortFeedback('🎉 Luar Biasa! Kamu berhasil mengurutkan unsur dengan nomor atom yang tepat! (+75 XP)');
          addXP(75, 'Tantangan Susun Unsur Berhasil');
          unlockBadge('periodic_master');
        } else {
          soundManager.playWrong();
          setSortFeedback('⚠️ Urutannya belum tepat dari nomor atom terkecil ke terbesar. Coba klik ulang!');
        }
      }
    }
  };

  // Filter elements
  const filteredElements = useMemo(() => {
    return ALL_ELEMENTS.filter(el => {
      const matchesSearch =
        searchQuery === '' ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.indonesianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.number.toString() === searchQuery.trim();

      const matchesCat = activeCategory === 'all' || el.category === activeCategory;
      const matchesState = activeState === 'all' || el.state === activeState;

      return matchesSearch && matchesCat && matchesState;
    });
  }, [searchQuery, activeCategory, activeState]);

  const handleElementClick = (element: ChemicalElement) => {
    soundManager.playClick();
    setSelectedElement(element);
    markElementViewed(element.number);
  };

  // Map elements into 7 periods and 18 groups grid
  const gridCells = useMemo(() => {
    const grid: (ChemicalElement | null)[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 18 }, () => null)
    );

    ALL_ELEMENTS.forEach(el => {
      if (el.category === 'lantanida' || el.category === 'aktinida') {
        return;
      }
      const r = el.period - 1;
      const c = el.group - 1;
      if (r >= 0 && r < 7 && c >= 0 && c < 18) {
        grid[r][c] = el;
      }
    });

    return grid;
  }, []);

  const lanthanides = ALL_ELEMENTS.filter(el => el.category === 'lantanida');
  const actinides = ALL_ELEMENTS.filter(el => el.category === 'aktinida');

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToDashboard();
            }}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-cyan-400 text-slate-700 hover:text-slate-900 transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Atom className="w-6 h-6 text-cyan-600" />
                Tabel Periodik Unsur Interaktif
              </h1>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs">
                118 / 118 Unsur Lengkap (IUPAC)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Eksplorasi seluruh 118 unsur kimia dari Hidrogen (1) hingga Oganeson (118) lengkap dengan model orbit Bohr
            </p>
          </div>
        </div>

        {/* Mode Switchers */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveMode('table');
            }}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'table'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            Tabel Lengkap
          </button>
          <button
            onClick={startGuessGame}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'guess'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 border border-slate-200 text-purple-700 hover:border-purple-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tebak Unsur</span>
          </button>
          <button
            onClick={startSortGame}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'sort'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 border border-slate-200 text-emerald-700 hover:border-emerald-300'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Susun Unsur</span>
          </button>
        </div>
      </div>

      {/* 1. TEBAK UNSUR INTERAKTIF (SUB-MODE) */}
      {activeMode === 'guess' && guessTarget && (
        <div className="rounded-2xl bg-white border border-purple-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Tantangan: Tebak Siapakah Unsur Ini?</h2>
                <p className="text-xs text-slate-500">Analisis petunjuk bertahap di bawah untuk menemukan identitas unsur misterius.</p>
              </div>
            </div>

            <button
              onClick={startGuessGame}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Ganti Soal
            </button>
          </div>

          {/* Clues Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-purple-200 space-y-2.5">
            <div className="text-xs font-bold text-purple-800">
              Petunjuk Terbuka ({guessClueIndex + 1}/4):
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                📌 <strong>Golongan & Kategori:</strong> Termasuk golongan <strong>{guessTarget.category}</strong> (Golongan {guessTarget.group}, Periode {guessTarget.period}).
              </li>
              {guessClueIndex >= 1 && (
                <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs animate-fadeIn">
                  📌 <strong>Wujud & Sifat Fisik:</strong> Berwujud <strong>{guessTarget.state}</strong> pada suhu ruang dengan massa atom ~{guessTarget.atomicMass.toFixed(2)}.
                </li>
              )}
              {guessClueIndex >= 2 && (
                <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs animate-fadeIn">
                  📌 <strong>Konfigurasi Elektron:</strong> {guessTarget.electronConfiguration} dengan {guessTarget.shells.length} kulit elektron.
                </li>
              )}
              {guessClueIndex >= 3 && (
                <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs animate-fadeIn">
                  📌 <strong>Fakta Spesial:</strong> {guessTarget.funFact}
                </li>
              )}
            </ul>

            {guessClueIndex < 3 && !guessResult && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setGuessClueIndex(prev => prev + 1);
                }}
                className="mt-2 text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Buka Petunjuk Berikutnya (+ Pengurangan XP Sedikit)
              </button>
            )}
          </div>

          {/* Result Banner */}
          {guessResult === 'correct' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-800">
                    Tebakanmu Tepat! Unsur tersebut adalah {guessTarget.indonesianName} ({guessTarget.symbol}).
                  </h4>
                  <p className="text-xs text-emerald-700">Nomor Atom: {guessTarget.number} | Kategori: {guessTarget.category}</p>
                </div>
              </div>
              <button
                onClick={startGuessGame}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Main Lagi
              </button>
            </div>
          )}

          {guessResult === 'wrong' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-between">
              <div className="text-xs font-semibold text-rose-800">
                ❌ Tebakanmu belum tepat! Coba pelajari petunjuknya lebih teliti atau buka petunjuk tambahan.
              </div>
              <button
                onClick={() => setGuessResult(null)}
                className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Options Grid */}
          {!guessResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {guessOptions.map(opt => (
                <button
                  key={opt.number}
                  onClick={() => handleGuessSubmit(opt)}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 text-center transition-all group shadow-xs"
                >
                  <div className="text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {opt.symbol}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{opt.indonesianName}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Z = {opt.number}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TANTANGAN SUSUN UNSUR (SUB-MODE) */}
      {activeMode === 'sort' && (
        <div className="rounded-2xl bg-white border border-emerald-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Shuffle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Tantangan: Susun Unsur Berdasarkan Nomor Atom</h2>
                <p className="text-xs text-slate-500">Klik kartu unsur di bawah secara berurutan dari nomor atom (Z) terkecil ke terbesar!</p>
              </div>
            </div>

            <button
              onClick={startSortGame}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Acak Ulang
            </button>
          </div>

          {sortFeedback && (
            <div className={`p-4 rounded-xl border text-xs font-bold ${
              sortFeedback.includes('Luar Biasa')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              {sortFeedback}
            </div>
          )}

          {/* Cards to pick */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sortElements.map(el => {
              const isSelected = sortSelectedOrder.includes(el.number);
              const orderIndex = sortSelectedOrder.indexOf(el.number);

              return (
                <button
                  key={el.number}
                  onClick={() => handleSortItemClick(el.number)}
                  className={`relative p-4 rounded-xl border text-center transition-all shadow-xs ${
                    isSelected
                      ? 'bg-emerald-100 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      {orderIndex + 1}
                    </span>
                  )}
                  <div className="text-2xl font-black text-slate-900">{el.symbol}</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{el.indonesianName}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 capitalize">{el.category}</div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Terpilih: {sortSelectedOrder.length} dari {sortElements.length} unsur</span>
            <button
              onClick={() => setSortSelectedOrder([])}
              className="text-cyan-700 hover:underline font-bold"
            >
              Reset Pilihan
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search Control Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari simbol (H, Fe), nama (Oksigen, Besi), atau nomor atom (1, 26)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 mr-1 whitespace-nowrap">Wujud:</span>
            {[
              { val: 'all', label: 'Semua' },
              { val: 'padat', label: 'Padat' },
              { val: 'cair', label: 'Cair' },
              { val: 'gas', label: 'Gas' },
            ].map(st => (
              <button
                key={st.val}
                onClick={() => {
                  soundManager.playClick();
                  setActiveState(st.val as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeState === st.val
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Color Legend (Clickable) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('all');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              Semua Kategori (118)
            </button>
            {Object.entries(CATEGORY_COLORS).map(([catKey, catStyle]) => {
              const isCatActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveCategory(isCatActive ? 'all' : (catKey as ElementCategory));
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                    isCatActive
                      ? `${catStyle.bg} ${catStyle.text} ${catStyle.border} ring-2 ring-cyan-500 shadow-xs`
                      : `${catStyle.bg} ${catStyle.text} ${catStyle.border} opacity-80 hover:opacity-100`
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: catStyle.glow }}
                  />
                  <span>{catStyle.name}</span>
                </button>
              );
            })}
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Menampilkan <strong className="text-cyan-700 font-black">{filteredElements.length}</strong> dari 118 Unsur
          </div>
        </div>
      </div>

      {/* Main Periodic Table Standard Grid (18 columns x 7 periods) */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[980px] space-y-2">
          {/* Group Numbers Header (1 to 18) */}
          <div className="grid grid-cols-18 gap-1.5 text-center text-[10px] font-mono text-slate-500 font-bold mb-1">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* 7 Periods */}
          {gridCells.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-18 gap-1.5">
              {row.map((el, colIdx) => {
                if (!el) {
                  // Lanthanide placeholder at Period 6 Group 3
                  if (rowIdx === 5 && colIdx === 2) {
                    return (
                      <button
                        key={colIdx}
                        onClick={() => {
                          soundManager.playClick();
                          const la = ALL_ELEMENTS.find(e => e.number === 57);
                          if (la) handleElementClick(la);
                        }}
                        className="flex flex-col items-center justify-center p-1 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-300 text-pink-700 text-[10px] font-black text-center shadow-2xs transition-all hover:scale-105 cursor-pointer"
                        title="Klik untuk membuka Deret Lantanida (57-71)"
                      >
                        <span>57-71</span>
                        <span className="text-[8px] opacity-75">La-Lu</span>
                      </button>
                    );
                  }
                  // Actinide placeholder at Period 7 Group 3
                  if (rowIdx === 6 && colIdx === 2) {
                    return (
                      <button
                        key={colIdx}
                        onClick={() => {
                          soundManager.playClick();
                          const ac = ALL_ELEMENTS.find(e => e.number === 89);
                          if (ac) handleElementClick(ac);
                        }}
                        className="flex flex-col items-center justify-center p-1 rounded-xl bg-fuchsia-50 hover:bg-fuchsia-100 border border-fuchsia-300 text-fuchsia-700 text-[10px] font-black text-center shadow-2xs transition-all hover:scale-105 cursor-pointer"
                        title="Klik untuk membuka Deret Aktinida (89-103)"
                      >
                        <span>89-103</span>
                        <span className="text-[8px] opacity-75">Ac-Lr</span>
                      </button>
                    );
                  }
                  return <div key={colIdx} className="w-full aspect-square" />;
                }

                const catStyle = CATEGORY_COLORS[el.category] || CATEGORY_COLORS['nonlogam'];
                const isSelected = selectedElement?.number === el.number;
                const isMatch = filteredElements.some(f => f.number === el.number);

                return (
                  <button
                    key={el.number}
                    onClick={() => handleElementClick(el)}
                    className={`relative flex flex-col items-center justify-between p-1 rounded-xl border text-left aspect-square transition-all duration-200 group shadow-2xs ${catStyle.bg} ${catStyle.border} ${
                      isSelected
                        ? 'ring-2 ring-cyan-600 scale-105 z-20 shadow-md'
                        : ''
                    } ${!isMatch ? 'opacity-25 grayscale' : 'hover:scale-105 hover:z-10 hover:shadow-sm'} cursor-pointer`}
                  >
                    <div className="w-full flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className="text-slate-600 font-bold">{el.number}</span>
                      <span className="text-[8px] opacity-90 font-sans">{el.state === 'cair' ? '💧' : el.state === 'gas' ? '💨' : ''}</span>
                    </div>

                    <div className={`text-sm sm:text-base font-black tracking-tight leading-none ${catStyle.text} group-hover:scale-110 transition-transform`}>
                      {el.symbol}
                    </div>

                    <div className="w-full text-center">
                      <div className="text-[7.5px] font-extrabold text-slate-800 truncate w-full leading-tight">
                        {el.indonesianName}
                      </div>
                      <div className="text-[6.5px] text-slate-500 font-mono leading-none font-semibold">
                        {el.atomicMass.toFixed(1)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* F-Block Rows (Lantanida & Aktinida) - Aligned with main 18-col table */}
          <div className="pt-4 space-y-1.5 border-t border-slate-200 mt-3">
            {/* Lantanida Row */}
            <div className="grid grid-cols-18 gap-1.5 items-center">
              <div className="col-span-3 flex items-center justify-end pr-2 text-[10px] font-black text-pink-700 uppercase tracking-wider">
                <span>* Lantanida (57-71)</span>
              </div>
              {lanthanides.map(el => {
                const catStyle = CATEGORY_COLORS['lantanida'];
                const isSelected = selectedElement?.number === el.number;
                const isMatch = filteredElements.some(f => f.number === el.number);
                return (
                  <button
                    key={el.number}
                    onClick={() => handleElementClick(el)}
                    className={`relative flex flex-col items-center justify-between p-1 rounded-xl border text-left aspect-square transition-all shadow-2xs ${catStyle.bg} ${catStyle.border} ${
                      isSelected ? 'ring-2 ring-cyan-600 scale-105 z-20 shadow-md' : ''
                    } ${!isMatch ? 'opacity-25 grayscale' : 'hover:scale-105'} cursor-pointer`}
                  >
                    <span className="text-[8px] text-slate-600 font-mono font-bold leading-none">{el.number}</span>
                    <span className="text-sm font-black text-pink-800 leading-none">{el.symbol}</span>
                    <span className="text-[7px] font-extrabold text-slate-800 truncate w-full text-center leading-tight">{el.indonesianName}</span>
                  </button>
                );
              })}
            </div>

            {/* Aktinida Row */}
            <div className="grid grid-cols-18 gap-1.5 items-center">
              <div className="col-span-3 flex items-center justify-end pr-2 text-[10px] font-black text-fuchsia-700 uppercase tracking-wider">
                <span>** Aktinida (89-103)</span>
              </div>
              {actinides.map(el => {
                const catStyle = CATEGORY_COLORS['aktinida'];
                const isSelected = selectedElement?.number === el.number;
                const isMatch = filteredElements.some(f => f.number === el.number);
                return (
                  <button
                    key={el.number}
                    onClick={() => handleElementClick(el)}
                    className={`relative flex flex-col items-center justify-between p-1 rounded-xl border text-left aspect-square transition-all shadow-2xs ${catStyle.bg} ${catStyle.border} ${
                      isSelected ? 'ring-2 ring-cyan-600 scale-105 z-20 shadow-md' : ''
                    } ${!isMatch ? 'opacity-25 grayscale' : 'hover:scale-105'} cursor-pointer`}
                  >
                    <span className="text-[8px] text-slate-600 font-mono font-bold leading-none">{el.number}</span>
                    <span className="text-sm font-black text-fuchsia-800 leading-none">{el.symbol}</span>
                    <span className="text-[7px] font-extrabold text-slate-800 truncate w-full text-center leading-tight">{el.indonesianName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Element Detail Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedElement(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-200 pb-6 mb-6">
              <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center shadow-md ${CATEGORY_COLORS[selectedElement.category]?.bg} ${CATEGORY_COLORS[selectedElement.category]?.border}`}>
                <span className="text-xs font-mono font-bold text-slate-600">{selectedElement.number}</span>
                <span className="text-3xl font-black text-slate-900">{selectedElement.symbol}</span>
                <span className="text-[9px] font-mono text-slate-600 font-bold">{selectedElement.atomicMass.toFixed(2)}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-slate-900">
                    {selectedElement.indonesianName} ({selectedElement.name})
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${CATEGORY_COLORS[selectedElement.category]?.bg} ${CATEGORY_COLORS[selectedElement.category]?.text} ${CATEGORY_COLORS[selectedElement.category]?.border}`}>
                    {CATEGORY_COLORS[selectedElement.category]?.name || selectedElement.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-medium">
                  {selectedElement.description}
                </p>
              </div>
            </div>

            {/* 2-Column Content: Bohr Atom Visualizer & Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Bohr Atom Visualizer */}
              <div className="space-y-4">
                <BohrAtomModel element={selectedElement} />

                {/* Electron configuration block */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Konfigurasi Elektron
                  </div>
                  <div className="font-mono text-sm font-bold text-cyan-800">
                    {selectedElement.electronConfiguration}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Kulit Bohr [K, L, M, N...]: <strong>{selectedElement.shells.join(' , ')}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical & Chemical Properties */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-600" />
                    Data Fisik & Sifat Periodik
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Wujud (25°C)</div>
                      <div className="font-bold text-slate-800 capitalize">{selectedElement.state}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Titik Leleh</div>
                      <div className="font-bold text-slate-800">
                        {selectedElement.meltingPoint !== undefined ? `${selectedElement.meltingPoint} °C` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Titik Didih</div>
                      <div className="font-bold text-slate-800">
                        {selectedElement.boilingPoint !== undefined ? `${selectedElement.boilingPoint} °C` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Keelektronegatifan</div>
                      <div className="font-bold text-cyan-700">
                        {selectedElement.electronegativity ?? 'Tidak terdefinisi'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Jari-Jari Atom</div>
                      <div className="font-bold text-slate-800">
                        {selectedElement.atomicRadius ? `${selectedElement.atomicRadius} pm` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500">Bilangan Oksidasi</div>
                      <div className="font-bold text-slate-800">
                        {selectedElement.oxidationStates || 'Bervariasi'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uses & Fun Fact */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Kegunaan Dalam Kehidupan Nyata
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {selectedElement.uses.map((u, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-600 font-bold">•</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <h5 className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                      💡 Fakta Menarik & Sejarah
                    </h5>
                    <p className="text-xs text-slate-600 italic">
                      "{selectedElement.funFact}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">
                Pelajari unsur ini dan kumpulkan lencana <strong>Penjelajah Unsur</strong>!
              </span>

              <div className="flex items-center gap-2">
                {openChemBotWithTopic && (
                  <button
                    onClick={() => {
                      setSelectedElement(null);
                      openChemBotWithTopic(`Tolong jelaskan lebih lanjut sifat kimia dan kegunaan unsur ${selectedElement.indonesianName} (${selectedElement.symbol})!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Tanya ChemBot tentang {selectedElement.symbol}
                  </button>
                )}
                <button
                  onClick={() => setSelectedElement(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

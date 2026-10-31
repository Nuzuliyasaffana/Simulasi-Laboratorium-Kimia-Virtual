import React, { useState } from 'react';
import { LAB_SIMULATIONS } from '../../data/simulations';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import {
  FlaskConical,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Flame,
  Scale,
  Beaker,
  Droplet,
  Info,
} from 'lucide-react';

interface VirtualLabProps {
  onBackToDashboard: () => void;
  openChemBotWithTopic?: (topic: string) => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({ onBackToDashboard, openChemBotWithTopic }) => {
  const { recordSimulationComplete, addXP } = useGame();
  const [selectedSimId, setSelectedSimId] = useState<string>('molecular-formation');

  // Simulation A: Molecular Formation State
  const [molAtoms, setMolAtoms] = useState<{ id: string; symbol: string; color: string; valency: number }[]>([]);
  const [formedMolecule, setFormedMolecule] = useState<{
    name: string;
    formula: string;
    shape: string;
    angle: string;
    bondType: string;
    octets: string;
    desc: string;
  } | null>(null);

  // Simulation B: Metal and Oxygen State
  const [metalChoice, setMetalChoice] = useState<'Mg' | 'Na' | 'Fe'>('Mg');
  const [metalReacting, setMetalReacting] = useState<boolean>(false);
  const [metalReacted, setMetalReacted] = useState<boolean>(false);

  // Simulation C: Acid-Base Titration State
  const [addedBaseVolume, setAddedBaseVolume] = useState<number>(0);
  const [titrationIndicator, setTitrationIndicator] = useState<'PP' | 'Lakmus' | 'Universal'>('PP');

  // Simulation D: Mass Conservation State
  const [systemType, setSystemType] = useState<'closed' | 'open'>('closed');
  const [massBalancing, setMassBalancing] = useState<{ caco3: number; hcl: number; cacl2: number; h2o: number; co2: number }>({
    caco3: 1,
    hcl: 1,
    cacl2: 1,
    h2o: 1,
    co2: 1,
  });
  const [massReactionDone, setMassReactionDone] = useState<boolean>(false);

  // Reflection Question States per simulation
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, number>>({});
  const [reflectionSubmitted, setReflectionSubmitted] = useState<Record<string, boolean>>({});

  const currentSim = LAB_SIMULATIONS.find(s => s.id === selectedSimId) || LAB_SIMULATIONS[0];

  // Simulation A Actions
  const addAtomToMol = (symbol: string, color: string, valency: number) => {
    soundManager.playBubble();
    if (molAtoms.length >= 6) return;
    setMolAtoms(prev => [...prev, { id: Math.random().toString(), symbol, color, valency }]);
    setFormedMolecule(null);
  };

  const clearMolAtoms = () => {
    soundManager.playClick();
    setMolAtoms([]);
    setFormedMolecule(null);
  };

  const formBonds = () => {
    soundManager.playReaction();
    const counts: Record<string, number> = {};
    molAtoms.forEach(a => counts[a.symbol] = (counts[a.symbol] || 0) + 1);

    if (counts['H'] === 2 && counts['O'] === 1 && molAtoms.length === 3) {
      setFormedMolecule({
        name: 'Air (Water)',
        formula: 'H₂O',
        shape: 'Bengkok (Bent / V-Shape)',
        angle: '104.5°',
        bondType: '2 Ikatan Kovalen Tunggal Polar',
        octets: 'Oksigen mencapai oktet (8e⁻) dengan 2 PEI & 2 PEB; Hidrogen mencapai duplet (2e⁻).',
        desc: 'Molekul esensial bagi kehidupan dengan sifat polar dan ikatan hidrogen yang kuat.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['C'] === 1 && counts['O'] === 2 && molAtoms.length === 3) {
      setFormedMolecule({
        name: 'Karbon Dioksida',
        formula: 'CO₂',
        shape: 'Linear (Garis Lurus)',
        angle: '180°',
        bondType: '2 Ikatan Kovalen Rangkap Dua (O=C=O)',
        octets: 'Atom C dan kedua atom O semuanya mencapai kestabilan oktet (8e⁻).',
        desc: 'Gas nonpolar produk respirasi seluler dan reaktan fotosintesis.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['C'] === 1 && counts['H'] === 4 && molAtoms.length === 5) {
      setFormedMolecule({
        name: 'Metana',
        formula: 'CH₄',
        shape: 'Tetrahedral Simetris',
        angle: '109.5°',
        bondType: '4 Ikatan Kovalen Tunggal Nonpolar',
        octets: 'Karbon mencapai oktet (8e⁻) dan 4 Hidrogen mencapai duplet (2e⁻).',
        desc: 'Komponen utama gas alam (LNG) yang merupakan hidrokarbon alkana paling sederhana.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['N'] === 1 && counts['H'] === 3 && molAtoms.length === 4) {
      setFormedMolecule({
        name: 'Amonia',
        formula: 'NH₃',
        shape: 'Trigonal Piramida',
        angle: '107.3°',
        bondType: '3 Ikatan Kovalen Tunggal Polar + 1 PEB',
        octets: 'Nitrogen memiliki 3 PEI dan 1 PEB (total 8e⁻ oktet).',
        desc: 'Bahan baku industri pupuk urea dan zat kimia beraroma menyengat.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['H'] === 2 && molAtoms.length === 2) {
      setFormedMolecule({
        name: 'Gas Hidrogen',
        formula: 'H₂',
        shape: 'Linear Diatomik',
        angle: '180°',
        bondType: '1 Ikatan Kovalen Tunggal Nonpolar (H-H)',
        octets: 'Kedua atom H mencapai kestabilan duplet (2e⁻).',
        desc: 'Molekul diatomik paling ringan di alam semesta.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['O'] === 2 && molAtoms.length === 2) {
      setFormedMolecule({
        name: 'Gas Oksigen',
        formula: 'O₂',
        shape: 'Linear Diatomik',
        angle: '180°',
        bondType: '1 Ikatan Kovalen Rangkap Dua (O=O)',
        octets: 'Kedua atom Oksigen mencapai oktet (8e⁻) penuh.',
        desc: 'Gas yang kita hirup setiap saat untuk respirasi seluler.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['Na'] === 1 && counts['Cl'] === 1 && molAtoms.length === 2) {
      setFormedMolecule({
        name: 'Natrium Klorida (Garam Meja)',
        formula: 'NaCl',
        shape: 'Kisi Kristal Ionik Kubus',
        angle: '90° (Kristal)',
        bondType: 'Ikatan Ionik (Na⁺ Cl⁻)',
        octets: 'Transfer 1e⁻ dari Na ke Cl; keduanya mencapai oktet gas mulia ([Ne] dan [Ar]).',
        desc: 'Senyawa ionik elektrolit kuat dengan titik leleh tinggi 801°C.',
      });
      recordSimulationComplete('molecular-formation');
    } else if (counts['H'] === 1 && counts['Cl'] === 1 && molAtoms.length === 2) {
      setFormedMolecule({
        name: 'Hidrogen Klorida (Asam)',
        formula: 'HCl',
        shape: 'Linear Polar',
        angle: '180°',
        bondType: '1 Ikatan Kovalen Sangat Polar',
        octets: 'H duplet (2e⁻), Cl oktet (8e⁻).',
        desc: 'Gas yang jika dilarutkan dalam air menjadi asam klorida (asam lambung).',
      });
      recordSimulationComplete('molecular-formation');
    } else {
      soundManager.playWrong();
      alert('Kombinasi atom ini belum membentuk molekul yang stabil! Coba buat H₂O (2H + 1O), CO₂ (1C + 2O), CH₄ (1C + 4H), NH₃ (1N + 3H), atau NaCl (1Na + 1Cl).');
    }
  };

  // Simulation B Actions
  const runMetalReaction = () => {
    soundManager.playReaction();
    setMetalReacting(true);
    setTimeout(() => {
      setMetalReacting(false);
      setMetalReacted(true);
      recordSimulationComplete('metal-oxygen');
      soundManager.playSuccess();
    }, 2500);
  };

  // Simulation C Calculations
  const mmolH = 2.5;
  const mmolOH = addedBaseVolume * 0.1;
  const totalVolume = 25 + addedBaseVolume;
  let currentPH = 1.0;

  if (addedBaseVolume === 0) {
    currentPH = 1.0;
  } else if (mmolH > mmolOH) {
    const remainingH = (mmolH - mmolOH) / totalVolume;
    currentPH = Math.max(1.0, parseFloat((-Math.log10(remainingH)).toFixed(2)));
  } else if (Math.abs(mmolH - mmolOH) < 0.001) {
    currentPH = 7.0;
  } else {
    const excessOH = (mmolOH - mmolH) / totalVolume;
    const pOH = -Math.log10(excessOH);
    currentPH = Math.min(13.0, parseFloat((14 - pOH).toFixed(2)));
  }

  const getIndicatorColor = (ph: number, ind: 'PP' | 'Lakmus' | 'Universal') => {
    if (ind === 'PP') {
      return ph >= 8.3 ? 'bg-pink-500/80' : 'bg-cyan-100/30';
    } else if (ind === 'Lakmus') {
      return ph < 7 ? 'bg-rose-500/80' : ph === 7 ? 'bg-purple-500/80' : 'bg-blue-600/80';
    } else {
      if (ph <= 2) return 'bg-red-600/80';
      if (ph <= 4) return 'bg-orange-500/80';
      if (ph <= 6) return 'bg-amber-400/80';
      if (ph <= 7.5) return 'bg-emerald-500/80';
      if (ph <= 9) return 'bg-cyan-500/80';
      if (ph <= 11) return 'bg-blue-600/80';
      return 'bg-purple-700/80';
    }
  };

  const handleTitrateStep = (amount: number) => {
    soundManager.playBubble();
    const nextVol = Math.min(40, Math.max(0, addedBaseVolume + amount));
    setAddedBaseVolume(nextVol);
    if (nextVol >= 25) {
      recordSimulationComplete('acid-base-titration');
    }
  };

  // Simulation D Actions
  const isEquationBalanced = massBalancing.hcl === 2 && massBalancing.caco3 === 1 && massBalancing.cacl2 === 1 && massBalancing.h2o === 1 && massBalancing.co2 === 1;

  const runMassReaction = () => {
    if (!isEquationBalanced) {
      soundManager.playWrong();
      alert('Koefisien reaksi belum setara! Kamu harus menyetarakan koefisien asam klorida (HCl) menjadi 2 sebelum reaksi dapat dijalankan.');
      return;
    }
    soundManager.playReaction();
    setMassReactionDone(true);
    recordSimulationComplete('mass-conservation');
  };

  const handleSelectReflection = (optionIdx: number) => {
    soundManager.playClick();
    setReflectionAnswers(prev => ({ ...prev, [selectedSimId]: optionIdx }));
  };

  const handleCheckReflection = () => {
    const selectedAns = reflectionAnswers[selectedSimId];
    if (selectedAns === undefined) return;

    if (selectedAns === currentSim.reflectionQuestion.correctIndex) {
      soundManager.playSuccess();
      addXP(50, `Refleksi Eksperimen ${currentSim.title}`);
    } else {
      soundManager.playWrong();
    }
    setReflectionSubmitted(prev => ({ ...prev, [selectedSimId]: true }));
  };

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
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-slate-900 transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-emerald-600" />
              Laboratorium Simulasi Kimia Virtual
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Simulasi reaksi kimia interaktif, aman, tanpa bahaya zat berbahaya, sesuai kurikulum SMA
            </p>
          </div>
        </div>
      </div>

      {/* 4 Experiment Scenario Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {LAB_SIMULATIONS.map(sim => {
          const isSelected = selectedSimId === sim.id;
          return (
            <button
              key={sim.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedSimId(sim.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400/40 text-emerald-950'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-emerald-800 border border-slate-200">
                  {sim.category}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{sim.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Experiment Objective & Instructions Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Info className="w-4 h-4" />
          Tujuan Eksperimen
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {currentSim.objective}
        </p>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500">Petunjuk Langkah:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
            {currentSim.instructions.map((ins, i) => (
              <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5 font-medium">
                <span className="text-emerald-600 font-bold shrink-0">{i + 1}.</span>
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INTERACTIVE EXPERIMENT PANELS */}

      {/* SIMULATION A: PEMBENTUKAN MOLEKUL */}
      {selectedSimId === 'molecular-formation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls: Pick Atoms */}
          <div className="space-y-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Pilih Atom Penyusun
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Klik atom di bawah untuk menambahkannya ke wadah ikatan (maksimal 6 atom).
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { symbol: 'H', name: 'Hidrogen', color: 'bg-sky-50 text-sky-800 border-sky-300', valency: 1 },
                { symbol: 'O', name: 'Oksigen', color: 'bg-rose-50 text-rose-800 border-rose-300', valency: 2 },
                { symbol: 'C', name: 'Karbon', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', valency: 4 },
                { symbol: 'N', name: 'Nitrogen', color: 'bg-indigo-50 text-indigo-800 border-indigo-300', valency: 3 },
                { symbol: 'Cl', name: 'Klorin', color: 'bg-teal-50 text-teal-800 border-teal-300', valency: 1 },
                { symbol: 'Na', name: 'Natrium', color: 'bg-amber-50 text-amber-800 border-amber-300', valency: 1 },
              ].map(item => (
                <button
                  key={item.symbol}
                  onClick={() => addAtomToMol(item.symbol, item.color, item.valency)}
                  className={`p-3 rounded-xl border text-center transition-all hover:scale-105 active:scale-95 shadow-2xs ${item.color}`}
                >
                  <div className="text-xl font-black">{item.symbol}</div>
                  <div className="text-[10px] font-bold">{item.name}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-700">Resep Molekul Populer:</div>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                <span className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-cyan-800">H₂O: 2H + 1O</span>
                <span className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-emerald-800">CO₂: 1C + 2O</span>
                <span className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-purple-800">CH₄: 1C + 4H</span>
                <span className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-indigo-800">NH₃: 1N + 3H</span>
                <span className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-amber-800">NaCl: 1Na + 1Cl</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={clearMolAtoms}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Reset Wadah
              </button>
              <button
                onClick={formBonds}
                disabled={molAtoms.length < 2}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black shadow-sm"
              >
                Bentuk Ikatan
              </button>
            </div>
          </div>

          {/* Interactive Beaker & Molecular Stage */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between relative shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-4">
              <span>Wadah Sintesis Molekul (Reaktor Partikel)</span>
              <span>Jumlah Atom: {molAtoms.length} / 6</span>
            </div>

            {/* Particle Canvas / Atom Visualizer Stage */}
            <div className="h-64 flex items-center justify-center relative rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
              {molAtoms.length === 0 ? (
                <div className="text-center text-slate-400 space-y-1">
                  <Beaker className="w-10 h-10 mx-auto text-slate-400 animate-bounce" />
                  <p className="text-xs font-medium">Wadah masih kosong. Pilih atom dari panel kiri untuk mulai menyusun molekul.</p>
                </div>
              ) : !formedMolecule ? (
                <div className="flex flex-wrap items-center justify-center gap-4 animate-pulse">
                  {molAtoms.map(atom => (
                    <div
                      key={atom.id}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-sm ${atom.color}`}
                    >
                      <span className="text-lg font-black">{atom.symbol}</span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Molecule Successfully Formed View */
                <div className="text-center space-y-3 animate-fadeIn">
                  <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-slate-50 border border-cyan-400 shadow-md">
                    <span className="text-4xl font-black bg-gradient-to-r from-cyan-700 to-emerald-700 bg-clip-text text-transparent">
                      {formedMolecule.formula}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{formedMolecule.name}</h4>
                    <p className="text-xs text-cyan-800 font-bold">Geometri: {formedMolecule.shape} (Sudut ~{formedMolecule.angle})</p>
                  </div>
                </div>
              )}
            </div>

            {/* Molecule Info Breakdown */}
            {formedMolecule && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-emerald-300 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Jenis Ikatan:</span>
                    <div className="font-bold text-slate-800">{formedMolecule.bondType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Aturan Oktet/Duplet:</span>
                    <div className="font-bold text-emerald-800">{formedMolecule.octets}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic pt-1 border-t border-slate-200">
                  "{formedMolecule.desc}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIMULATION B: REAKSI LOGAM DAN OKSIGEN */}
      {selectedSimId === 'metal-oxygen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Pengaturan Eksperimen Oksidasi
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pilih pita logam yang akan dibakar dalam atmosfer gas oksigen murni (O₂).
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pilihan Sampel Logam:</label>
              {[
                { id: 'Mg', label: 'Magnesium (Mg)', desc: 'Nyala putih terang spektakuler (Blitz)' },
                { id: 'Na', label: 'Natrium (Na)', desc: 'Nyala api kuning keemasan cepat' },
                { id: 'Fe', label: 'Serbuk Besi (Fe)', desc: 'Percikan bunga api oranye keemasan' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundManager.playClick();
                    setMetalChoice(m.id as any);
                    setMetalReacted(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    metalChoice === m.id
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={runMetalReaction}
                disabled={metalReacting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>{metalReacting ? 'Reaksi Sedang Berlangsung...' : 'Mulai Reaksi Pembakaran'}</span>
              </button>

              {metalReacted && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMetalReacted(false);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Ulangi Eksperimen
                </button>
              )}
            </div>
          </div>

          {/* Chamber Visualizer */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between relative shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
              <span>Ruang Pembakaran Kedap Udara O₂</span>
              <span>Status: {metalReacting ? '🔥 Terbakar' : metalReacted ? '✅ Reaksi Selesai' : 'Siap Menyala'}</span>
            </div>

            {/* Glowing Flash Stage */}
            <div className={`h-64 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden transition-all duration-700 ${
              metalReacting ? 'bg-amber-100 shadow-2xl animate-pulse' : 'bg-slate-50'
            }`}>
              {metalReacting ? (
                <div className="text-center space-y-2 animate-bounce">
                  <div className="text-5xl font-black text-amber-500 drop-shadow-md">⚡💥⚡</div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Cahaya Putih Menyilaukan & Reaksi Eksoterm Hebat!
                  </p>
                </div>
              ) : metalReacted ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-lg mx-auto flex items-center justify-center text-slate-900 font-black text-xl">
                    {metalChoice === 'Mg' ? 'MgO' : metalChoice === 'Na' ? 'Na₂O' : 'Fe₂O₃'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {metalChoice === 'Mg'
                        ? 'Magnesium Oksida Padat (Serbuk Putih)'
                        : metalChoice === 'Na'
                        ? 'Natrium Oksida Padat'
                        : 'Karat Besi (Besi(III) Oksida)'}
                    </h4>
                    <p className="text-xs text-slate-500">Ikatan ionik kristal terbentuk sempurna.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-slate-800 font-bold shadow-xs">
                    {metalChoice}
                  </div>
                  <p className="text-xs">Pita logam {metalChoice} siap dipanaskan dengan aliran gas O₂.</p>
                </div>
              )}
            </div>

            {/* Reaction Equations & Biloks Breakdown */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-700">Persamaan Reaksi Setara:</div>
              <div className="font-mono text-sm font-extrabold text-slate-900">
                {metalChoice === 'Mg' && '2Mg(s) + O₂(g) → 2MgO(s) + Kalor & Cahaya'}
                {metalChoice === 'Na' && '4Na(s) + O₂(g) → 2Na₂O(s) + Kalor'}
                {metalChoice === 'Fe' && '4Fe(s) + 3O₂(g) → 2Fe₂O₃(s) + Kalor'}
              </div>
              <div className="text-xs text-slate-700">
                <strong>Konsep Redoks:</strong> Logam {metalChoice} teroksidasi melepaskan elektron (bilangan oksidasi naik dari 0 ke positif), sedangkan molekul O₂ tereduksi menangkap elektron (bilangan oksidasi turun dari 0 ke -2).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION C: TITRASI ASAM-BASA & pH METER */}
      {selectedSimId === 'acid-base-titration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600" />
              Kontrol Buret & Indikator
            </h3>

            {/* Indicator Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pilih Indikator Warna:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'PP', label: 'Fenolftalein (PP)' },
                  { id: 'Lakmus', label: 'Kertas Lakmus' },
                  { id: 'Universal', label: 'Universal' },
                ].map(ind => (
                  <button
                    key={ind.id}
                    onClick={() => {
                      soundManager.playClick();
                      setTitrationIndicator(ind.id as any);
                    }}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                      titrationIndicator === ind.id
                        ? 'bg-cyan-100 border-cyan-400 text-cyan-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Titrant Buret Drops */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Kucuran Titran NaOH (0.1 M):</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleTitrateStep(1)}
                  className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-400 text-xs font-bold text-cyan-800"
                >
                  +1.0 mL
                </button>
                <button
                  onClick={() => handleTitrateStep(5)}
                  className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-400 text-xs font-bold text-cyan-800"
                >
                  +5.0 mL
                </button>
                <button
                  onClick={() => handleTitrateStep(10)}
                  className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-400 text-xs font-bold text-cyan-800"
                >
                  +10 mL
                </button>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setAddedBaseVolume(0);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Reset Buret (0 mL)
              </button>
            </div>

            {/* Status Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Volume Asam HCl:</span>
                <span className="font-bold text-slate-900">25.0 mL (0.1 M)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volume NaOH Ditambahkan:</span>
                <span className="font-bold text-cyan-700">{addedBaseVolume.toFixed(1)} mL</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Titik Ekuivalen:</span>
                <span className="font-bold text-emerald-700">25.0 mL NaOH</span>
              </div>
            </div>
          </div>

          {/* Erlenmeyer Flask & Live pH Meter */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
              <span>Alat Titrasi Volumetri</span>
              <span>
                Kondisi Larutan:{' '}
                <strong className={currentPH < 7 ? 'text-rose-700' : currentPH === 7 ? 'text-emerald-700' : 'text-purple-700'}>
                  {currentPH < 7 ? 'Asam' : currentPH === 7 ? 'Netral (Titik Ekuivalen)' : 'Basa'}
                </strong>
              </span>
            </div>

            {/* Beaker visual and digital meter */}
            <div className="h-64 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Digital pH Meter Display */}
              <div className="p-4 rounded-2xl bg-white border border-slate-300 text-center shadow-sm w-44">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  pH Meter Digital
                </div>
                <div className={`text-4xl font-mono font-black ${
                  currentPH < 7 ? 'text-rose-600' : currentPH === 7 ? 'text-emerald-600' : 'text-purple-600'
                }`}>
                  {currentPH.toFixed(2)}
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-1">
                  {currentPH < 7 ? '[H⁺] > [OH⁻]' : currentPH === 7 ? '[H⁺] = [OH⁻]' : '[OH⁻] > [H⁺]'}
                </div>
              </div>

              {/* Virtual Erlenmeyer Flask with Liquid Color */}
              <div className="relative flex flex-col items-center">
                <div className="w-3 h-12 bg-slate-400 rounded-t-md relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 mx-auto animate-ping mt-10"></div>
                </div>

                <div className="w-32 h-36 rounded-b-3xl rounded-t-lg border-2 border-slate-400 bg-white/60 p-2 flex flex-col justify-end relative overflow-hidden shadow-md">
                  <div
                    className={`w-full rounded-b-2xl transition-all duration-500 ${getIndicatorColor(currentPH, titrationIndicator)}`}
                    style={{ height: `${Math.min(95, 30 + (addedBaseVolume / 40) * 55)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-black text-slate-800 drop-shadow-sm">
                      {titrationIndicator}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-cyan-800">Reaksi Netralisasi:</div>
              <div className="font-mono text-xs text-slate-900 font-bold">HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</div>
              <p className="text-slate-600 font-medium">
                Ion H⁺ dinetralkan oleh ion OH⁻ membentuk molekul air netral. Saat volume NaOH tepat 25.0 mL, seluruh ion H⁺ habis bereaksi sehingga pH tepat 7.00.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION D: HUKUM KEKEKALAN MASSA (LAVOISIER) */}
      {selectedSimId === 'mass-conservation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Equation Balancer */}
          <div className="space-y-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Sistem Bejana & Penyetaraan
            </h3>

            {/* System Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Jenis Sistem Percobaan:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSystemType('closed');
                    setMassReactionDone(false);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    systemType === 'closed'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Sistem Tertutup 🔒
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSystemType('open');
                    setMassReactionDone(false);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    systemType === 'open'
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Sistem Terbuka 🔓
                </button>
              </div>
            </div>

            {/* Equation Coefficient Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Setarakan Koefisien Reaksi:</span>
                <span className={`text-[10px] font-bold ${isEquationBalanced ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isEquationBalanced ? '✅ Reaksi Setara!' : '❌ Belum Setara'}
                </span>
              </label>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">CaCO₃:</span>
                  <span className="font-bold text-slate-900">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Koefisien HCl:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMassBalancing(p => ({ ...p, hcl: Math.max(1, p.hcl - 1) }))}
                      className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-cyan-800 w-4 text-center">{massBalancing.hcl}</span>
                    <button
                      onClick={() => setMassBalancing(p => ({ ...p, hcl: Math.min(4, p.hcl + 1) }))}
                      className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={runMassReaction}
                className={`w-full py-3 rounded-xl text-xs font-black shadow-sm transition-all ${
                  isEquationBalanced
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                {massReactionDone ? 'Reaksikan Kembali' : 'Campurkan Zat & Catat Massa'}
              </button>
            </div>
          </div>

          {/* Digital Scale Stage */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
              <span>Timbangan Digital Presisi Laboratorium (0.01 g)</span>
              <span>{systemType === 'closed' ? 'Sistem Tertutup (Gas CO₂ Terjebak)' : 'Sistem Terbuka (Gas CO₂ Terbang)'}</span>
            </div>

            {/* Scale and Flask Graphics */}
            <div className="h-64 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-28 h-32 rounded-b-3xl rounded-t-md border-2 border-slate-400 bg-white p-2 flex flex-col justify-end relative shadow-md">
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-[9px] font-black uppercase ${
                    systemType === 'closed' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {systemType === 'closed' ? 'Tutup Rapat' : 'Terbuka'}
                  </div>

                  {massReactionDone && systemType === 'open' && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 animate-bounce">
                      💨 Gas CO₂ Lepas!
                    </div>
                  )}

                  <div className="w-full h-16 rounded-b-2xl bg-cyan-100/60 border-t border-cyan-400 flex items-center justify-center">
                    {massReactionDone && (
                      <span className="text-[10px] font-bold text-slate-800 animate-pulse">
                        CaCl₂ + H₂O
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Digital Scale Readout */}
              <div className="px-6 py-2.5 rounded-xl bg-slate-100 border border-slate-300 shadow-sm flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500">MASSA:</span>
                <span className="text-3xl font-mono font-black text-emerald-700">
                  {!massReactionDone
                    ? '150.00 g'
                    : systemType === 'closed'
                    ? '150.00 g'
                    : '145.60 g'}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-emerald-800">
                {systemType === 'closed'
                  ? '✅ Terbukti: Hukum Lavoisier Terpenuhi Mutlak!'
                  : '⚠️ Perhatian: Massa Terlihat Berkurang 4.40 g'}
              </div>
              <p className="text-slate-600 font-medium">
                {systemType === 'closed'
                  ? 'Massa sebelum reaksi (150.00 g) sama persis dengan massa setelah reaksi (150.00 g) karena seluruh gas CO₂ tertahan di dalam wadah.'
                  : 'Dalam wadah terbuka, gas CO₂ yang bermassa 4.40 g terbang bebas ke udara atmosfer. Massa tidak musnah, melainkan berpindah fasa ke udara!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post-Simulation Reflection Question (+50 XP) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            Pertanyaan Refleksi Eksperimen (+50 XP)
          </h3>
          <span className="text-xs text-slate-500 font-medium">Uji penalaran ilmiahmu</span>
        </div>

        <p className="text-xs text-slate-800 font-bold leading-relaxed">
          {currentSim.reflectionQuestion.question}
        </p>

        <div className="space-y-2">
          {currentSim.reflectionQuestion.options.map((opt, idx) => {
            const isSelected = reflectionAnswers[selectedSimId] === idx;
            const isSubmitted = reflectionSubmitted[selectedSimId];
            const isCorrect = idx === currentSim.reflectionQuestion.correctIndex;

            let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300';
            if (isSelected) {
              btnStyle = 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold';
            }
            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelectReflection(idx)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {!reflectionSubmitted[selectedSimId] ? (
          <button
            onClick={handleCheckReflection}
            disabled={reflectionAnswers[selectedSimId] === undefined}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
          >
            Periksa Jawaban Refleksi
          </button>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong>Penjelasan Ilmiah:</strong> {currentSim.reflectionQuestion.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

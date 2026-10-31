import { ReactionChallenge } from '../types';

export const REACTION_CHALLENGES: ReactionChallenge[] = [
  // Pemula (Beginner) - Cocok untuk Kelas X
  {
    id: 'rx-x-1',
    title: 'Sintesis Air dari Gas Hidrogen dan Oksigen',
    grade: 'X',
    difficulty: 'Pemula',
    description: 'Gas hidrogen bereaksi secara eksotermik dengan gas oksigen saat dipicu percikan api menghasilkan uap air.',
    reactionType: 'Sintesis',
    reactants: [
      { formula: 'H₂', name: 'Gas Hidrogen', state: 'g', coefficient: 2 },
      { formula: 'O₂', name: 'Gas Oksigen', state: 'g', coefficient: 1 },
    ],
    products: [
      { formula: 'H₂O', name: 'Air', state: 'l', coefficient: 2 },
    ],
    balancedEquation: '2H₂(g) + O₂(g) → 2H₂O(l)',
    hints: [
      'Ada 2 atom O di sisi reaktan (dalam O₂), sehingga produk H₂O harus memiliki koefisien 2.',
      'Dengan 2 molekul H₂O, jumlah atom H di kanan menjadi 4, sehingga koefisien H₂ harus bernilai 2.',
    ],
    explanation: 'Dua molekul gas hidrogen bergabung dengan satu molekul gas oksigen membentuk dua molekul air. Reaksi penggabungan dua unsur atau lebih menjadi satu senyawa disebut Reaksi Sintesis (Kombinasi).',
    xpReward: 60,
  },
  {
    id: 'rx-x-2',
    title: 'Pembentukan Garam Dapur dari Logam Natrium dan Gas Klorin',
    grade: 'X',
    difficulty: 'Pemula',
    description: 'Logam natrium (Na) yang lunak dimasukkan ke dalam tabung berisi gas klorin (Cl₂) berwarna hijau kekuningan, menghasilkan asap putih kristal garam dapur.',
    reactionType: 'Sintesis',
    reactants: [
      { formula: 'Na', name: 'Natrium Padat', state: 's', coefficient: 2 },
      { formula: 'Cl₂', name: 'Gas Klorin', state: 'g', coefficient: 1 },
    ],
    products: [
      { formula: 'NaCl', name: 'Natrium Klorida', state: 's', coefficient: 2 },
    ],
    balancedEquation: '2Na(s) + Cl₂(g) → 2NaCl(s)',
    hints: [
      'Molekul klorin berwujud diatomik (Cl₂).',
      'Setarakan atom klorin terlebih dahulu dengan memberikan koefisien 2 pada NaCl, lalu setarakan atom Na.',
    ],
    explanation: 'Terjadi transfer 1 elektron dari setiap atom Na ke atom Cl, membentuk ion Na⁺ dan Cl⁻ yang saling mengikat kuat melalui ikatan ionik kristalin.',
    xpReward: 65,
  },
  {
    id: 'rx-x-3',
    title: 'Penguraian Termal Kalsium Karbonat (Batu Kapur)',
    grade: 'X',
    difficulty: 'Pemula',
    description: 'Pemanasan batu kapur CaCO₃ pada suhu tinggi menghasilkan kapur tohor (CaO) dan gas karbon dioksida.',
    reactionType: 'Dekomposisi',
    reactants: [
      { formula: 'CaCO₃', name: 'Kalsium Karbonat', state: 's', coefficient: 1 },
    ],
    products: [
      { formula: 'CaO', name: 'Kalsium Oksida', state: 's', coefficient: 1 },
      { formula: 'CO₂', name: 'Gas Karbon Dioksida', state: 'g', coefficient: 1 },
    ],
    balancedEquation: 'CaCO₃(s) → CaO(s) + CO₂(g)',
    hints: [
      'Periksa jumlah atom di kedua sisi: Ca (1 vs 1), C (1 vs 1), O (3 vs 1+2 = 3).',
      'Reaksi ini sudah setara dengan seluruh koefisien bernilai 1!',
    ],
    explanation: 'Reaksi satu zat terurai menjadi dua zat atau lebih yang lebih sederhana disebut Reaksi Dekomposisi (Penguraian).',
    xpReward: 70,
  },

  // Menengah (Intermediate) - Cocok untuk Kelas XI
  {
    id: 'rx-xi-1',
    title: 'Pembakaran Sempurna Gas Metana (Gas Alam)',
    grade: 'XI',
    difficulty: 'Menengah',
    description: 'Gas metana (CH₄) dibakar dengan gas oksigen berlebih menghasilkan gas karbon dioksida, uap air, dan energi panas pembakaran (ΔH°c negatif).',
    reactionType: 'Redoks',
    reactants: [
      { formula: 'CH₄', name: 'Metana', state: 'g', coefficient: 1 },
      { formula: 'O₂', name: 'Gas Oksigen', state: 'g', coefficient: 2 },
    ],
    products: [
      { formula: 'CO₂', name: 'Karbon Dioksida', state: 'g', coefficient: 1 },
      { formula: 'H₂O', name: 'Uap Air', state: 'g', coefficient: 2 },
    ],
    balancedEquation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)',
    hints: [
      'Setarakan atom C terlebih dahulu (1 di kiri, 1 di kanan).',
      'Setarakan atom H (4 di kiri dalam CH₄, butuh koefisien 2 di depan H₂O).',
      'Hitung total atom O di produk: 2 (dari CO₂) + 2 (dari 2H₂O) = 4 atom O. Jadi koefisien O₂ adalah 4/2 = 2.',
    ],
    explanation: 'Pada reaksi pembakaran hidrokarbon sempurna, seluruh C diubah menjadi CO₂ dan H menjadi H₂O. Biloks C naik dari -4 di CH₄ menjadi +4 di CO₂ (oksidasi), sedangkan biloks O turun dari 0 di O₂ menjadi -2 (reduksi).',
    xpReward: 85,
  },
  {
    id: 'rx-xi-2',
    title: 'Reaksi Logam Seng dengan Larutan Asam Klorida',
    grade: 'XI',
    difficulty: 'Menengah',
    description: 'Keping seng (Zn) dimasukkan ke dalam asam klorida encer, menghasilkan gelembung gas hidrogen dan larutan seng klorida.',
    reactionType: 'Penggantian Tunggal',
    reactants: [
      { formula: 'Zn', name: 'Seng Padat', state: 's', coefficient: 1 },
      { formula: 'HCl', name: 'Asam Klorida', state: 'aq', coefficient: 2 },
    ],
    products: [
      { formula: 'ZnCl₂', name: 'Seng Klorida', state: 'aq', coefficient: 1 },
      { formula: 'H₂', name: 'Gas Hidrogen', state: 'g', coefficient: 1 },
    ],
    balancedEquation: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)',
    hints: [
      'Zn menggantikan H dalam asam karena Zn berada di sebelah kiri H dalam deret volta (lebih reaktif).',
      'Karena produknya ZnCl₂ dan H₂, kita memerlukan 2 ion H⁺ dan 2 ion Cl⁻, sehingga koefisien HCl adalah 2.',
    ],
    explanation: 'Ini adalah Reaksi Penggantian Tunggal (Single Displacement). Seng lebih elektropositif daripada hidrogen sehingga mampu mendesak ion H⁺ keluar dari larutan asamnya menjadi gas hidrogen bebas.',
    xpReward: 85,
  },
  {
    id: 'rx-xi-3',
    title: 'Pengendapan Barium Sulfat (Uji Sulfat)',
    grade: 'XI',
    difficulty: 'Menengah',
    description: 'Pencampuran larutan Barium Klorida dengan Natrium Sulfat menghasilkan endapan putih Barium Sulfat yang sangat sukar larut.',
    reactionType: 'Pertukaran Ganda',
    reactants: [
      { formula: 'BaCl₂', name: 'Barium Klorida', state: 'aq', coefficient: 1 },
      { formula: 'Na₂SO₄', name: 'Natrium Sulfat', state: 'aq', coefficient: 1 },
    ],
    products: [
      { formula: 'BaSO₄', name: 'Barium Sulfat', state: 's', coefficient: 1 },
      { formula: 'NaCl', name: 'Natrium Klorida', state: 'aq', coefficient: 2 },
    ],
    balancedEquation: 'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s)↓ + 2NaCl(aq)',
    hints: [
      'Pertukaran kation dan anion (metatesis): Ba²⁺ bergabung dengan SO₄²⁻, Na⁺ bergabung dengan Cl⁻.',
      'Dibutuhkan koefisien 2 di depan NaCl agar atom Na dan Cl seimbang.',
    ],
    explanation: 'Reaksi Pertukaran Ganda (Double Replacement/Metatesis). Barium sulfat memiliki nilai Ksp yang sangat kecil sehingga langsung mengendap sebagai partikel padat putih.',
    xpReward: 90,
  },

  // Ahli (Advanced) - Cocok untuk Kelas XII
  {
    id: 'rx-xii-1',
    title: 'Oksidasi Besi(II) oleh Kalium Permanganat dalam Suasana Asam',
    grade: 'XII',
    difficulty: 'Ahli',
    description: 'Ion permanganat MnO₄⁻ berwarna ungu mengoksidasi ion Fe²⁺ menjadi Fe³⁺ dalam larutan asam sulfat, sambil tereduksi menjadi ion Mn²⁺ yang hampir tak berwarna.',
    reactionType: 'Redoks',
    reactants: [
      { formula: 'KMnO₄', name: 'Kalium Permanganat', state: 'aq', coefficient: 1 },
      { formula: 'FeSO₄', name: 'Besi(II) Sulfat', state: 'aq', coefficient: 5 },
      { formula: 'H₂SO₄', name: 'Asam Sulfat', state: 'aq', coefficient: 4 },
    ],
    products: [
      { formula: 'MnSO₄', name: 'Mangan(II) Sulfat', state: 'aq', coefficient: 1 },
      { formula: 'Fe₂(SO₄)₃', name: 'Besi(III) Sulfat', state: 'aq', coefficient: 2.5 },
      { formula: 'K₂SO₄', name: 'Kalium Sulfat', state: 'aq', coefficient: 0.5 },
      { formula: 'H₂O', name: 'Air', state: 'l', coefficient: 4 },
    ],
    balancedEquation: '2KMnO₄ + 10FeSO₄ + 8H₂SO₄ → 2MnSO₄ + 5Fe₂(SO₄)₃ + K₂SO₄ + 8H₂O',
    hints: [
      'Tinjau perubahan bilangan oksidasi: Mn dari +7 menjadi +2 (turun 5 elektron).',
      'Fe dari +2 menjadi +3 (naik 1 elektron).',
      'Samakan jumlah elektron yang dilepas dan diterima: 1 molekul MnO₄⁻ membutuhkan 5 ion Fe²⁺.',
    ],
    explanation: 'Penyetaraan reaksi redoks berdasarkan metode perubahan bilangan oksidasi (PBO). Ion MnO₄⁻ adalah oksidator kuat dalam suasana asam dengan penurunan biloks sebesar 5.',
    xpReward: 120,
  },
  {
    id: 'rx-xii-2',
    title: 'Reaksi Disproporsionasi (Autoredoks) Gas Klorin dalam Basa Panas',
    grade: 'XII',
    difficulty: 'Ahli',
    description: 'Gas klorin dialirkan ke dalam larutan NaOH pekat yang panas, mengalami reaksi autoredoks menjadi ion klorida (Cl⁻) dan ion klorat (ClO₃⁻).',
    reactionType: 'Redoks',
    reactants: [
      { formula: 'Cl₂', name: 'Gas Klorin', state: 'g', coefficient: 3 },
      { formula: 'NaOH', name: 'Natrium Hidroksida', state: 'aq', coefficient: 6 },
    ],
    products: [
      { formula: 'NaCl', name: 'Natrium Klorida', state: 'aq', coefficient: 5 },
      { formula: 'NaClO₃', name: 'Natrium Klorat', state: 'aq', coefficient: 1 },
      { formula: 'H₂O', name: 'Air', state: 'l', coefficient: 3 },
    ],
    balancedEquation: '3Cl₂(g) + 6NaOH(aq) → 5NaCl(aq) + NaClO₃(aq) + 3H₂O(l)',
    hints: [
      'Unsur yang sama (Cl₂ dengan biloks 0) bertindak sebagai reduktor sekaligus oksidator.',
      'Satu atom Cl teroksidasi menjadi +5 dalam NaClO₃, sedangkan lima atom Cl tereduksi menjadi -1 dalam NaCl.',
    ],
    explanation: 'Reaksi autoredoks (disproporsionasi) adalah reaksi redoks di mana zat yang mengalami oksidasi dan reduksi adalah unsur dari zat yang sama. Total elektron yang dilepas (5e⁻) sama dengan total elektron yang diterima (5 × 1e⁻).',
    xpReward: 130,
  },
];

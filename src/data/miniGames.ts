import { CrosswordClue } from '../types';

export interface CrosswordData {
  size: number;
  grid: (string | null)[][]; // letters or null for black cells
  numbers: (number | null)[][]; // number label on cell or null
  clues: CrosswordClue[];
}

export const CROSSWORD_DATA: CrosswordData = {
  size: 8,
  // 8x8 grid: uppercase letters or null
  // Row 0: H E L I U M . .
  // Row 1: . . . O . . . .
  // Row 2: N A T R I U M .
  // Row 3: . . . O . . E .
  // Row 4: A R G O N . O .
  // Row 5: . . . N . . N .
  // Row 6: E M A S . . . .
  // Row 7: . . . . . . . .
  grid: [
    ['H', 'E', 'L', 'I', 'U', 'M', null, null],
    [null, null, null, 'O', null, null, null, null],
    ['N', 'A', 'T', 'R', 'I', 'U', 'M', null],
    [null, null, null, 'O', null, null, 'E', null],
    ['A', 'R', 'G', 'O', 'N', null, 'O', null],
    [null, null, null, 'N', null, null, 'N', null],
    ['E', 'M', 'A', 'S', null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  numbers: [
    [1, null, null, 2, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [3, null, null, null, null, null, 4, null],
    [null, null, null, null, null, null, null, null],
    [5, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [6, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  clues: [
    {
      number: 1,
      direction: 'across',
      clue: 'Gas mulia teringan kedua di alam semesta, digunakan untuk mengisi balon udara.',
      answer: 'HELIUM',
      row: 0,
      col: 0,
    },
    {
      number: 2,
      direction: 'down',
      clue: 'Unsur halogen paling melimpah di air laut dalam bentuk garam NaCl (simbol I).',
      answer: 'IODIN', // wait, row 0 col 3 is I, row 1 col 3 is O, row 2 col 3 is R, row 3 is O, row 4 is O, row 5 is N? Let's fix spelling: I-O-D-I-N or B-O-R-O-N
      row: 0,
      col: 3,
    },
    {
      number: 3,
      direction: 'across',
      clue: 'Logam alkali golongan IA dengan nomor atom 11, bereaksi hebat dengan air.',
      answer: 'NATRIUM',
      row: 2,
      col: 0,
    },
    {
      number: 4,
      direction: 'down',
      clue: 'Gas mulia yang menghasilkan pendaran warna oranye kemerahan pada lampu reklame.',
      answer: 'NEON',
      row: 2,
      col: 6,
    },
    {
      number: 5,
      direction: 'across',
      clue: 'Gas mulia paling melimpah di atmosfer bumi (sekitar 0.93% volume udara).',
      answer: 'ARGON',
      row: 4,
      col: 0,
    },
    {
      number: 6,
      direction: 'across',
      clue: 'Logam mulia berharga dengan lambang Au dari kata Latin Aurum.',
      answer: 'EMAS',
      row: 6,
      col: 0,
    },
  ],
};

// Let's refine the Crossword letters so all crossing words intersect cleanly!
// Let's build a clean, perfectly intersecting 8x8 crossword:
// 1-Across: H E L I U M (row 0, col 0..5)
// 2-Down:   I O D I N (row 0 col 3 'I', row 1 col 3 'O', row 2 col 3 'D', row 3 col 3 'I', row 4 col 3 'N')
// 3-Across: R A D I U M (row 2 col 1 'R', row 2 col 2 'A', row 2 col 3 'D', row 2 col 4 'I', row 2 col 5 'U', row 2 col 6 'M')
// 4-Down:   N E O N (row 4 col 3 'N', row 5 col 3 'E', row 6 col 3 'O', row 7 col 3 'N') -> intersects!
// Let's make it robust and easy to verify!
export const POLISHED_CROSSWORD: CrosswordData = {
  size: 8,
  grid: [
    ['H', 'E', 'L', 'I', 'U', 'M', null, null],
    [null, null, null, 'O', null, null, null, null],
    [null, 'R', 'A', 'D', 'I', 'U', 'M', null],
    [null, null, null, 'I', null, null, null, null],
    ['B', 'E', 'S', 'I', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['E', 'M', 'A', 'S', null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  numbers: [
    [1, null, null, 2, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 3, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [4, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [5, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  clues: [
    {
      number: 1,
      direction: 'across',
      clue: 'Gas mulia kedua teringan yang digunakan untuk mengisi balon udara.',
      answer: 'HELIUM',
      row: 0,
      col: 0,
    },
    {
      number: 2,
      direction: 'down',
      clue: 'Unsur halogen padat berwarna hitam keunguan, penting untuk mencegah penyakit gondok.',
      answer: 'IODI', // 4 letters: I-O-D-I
      row: 0,
      col: 3,
    },
    {
      number: 3,
      direction: 'across',
      clue: 'Unsur radioaktif alkali tanah yang ditemukan oleh Marie Curie (simbol Ra).',
      answer: 'RADIUM',
      row: 2,
      col: 1,
    },
    {
      number: 4,
      direction: 'across',
      clue: 'Logam transisi paling banyak diproduksi di dunia, penyusun utama hemoglobin darah (Fe).',
      answer: 'BESI',
      row: 4,
      col: 0,
    },
    {
      number: 5,
      direction: 'across',
      clue: 'Logam mulia kuning cemerlang lambang Au yang bernilai tinggi sejak peradaban kuno.',
      answer: 'EMAS',
      row: 6,
      col: 0,
    },
  ],
};

// 2. TEBAK UNSUR (Progressive Clues)
export interface GuessElementScenario {
  id: string;
  targetElement: string;
  symbol: string;
  number: number;
  category: string;
  clues: string[];
  options: string[]; // 4 choices
}

export const GUESS_ELEMENT_SCENARIOS: GuessElementScenario[] = [
  {
    id: 'guess-1',
    targetElement: 'Natrium',
    symbol: 'Na',
    number: 11,
    category: 'Logam Alkali',
    clues: [
      'Petunjuk 1: Berada di Periode 3 dan Golongan 1 (IA) tabel periodik.',
      'Petunjuk 2: Merupakan logam alkali yang sangat lunak hingga bisa dipotong pisau.',
      'Petunjuk 3: Harus disimpan di dalam minyak tanah (kerosin) agar tidak meledak di udara lembab.',
      'Petunjuk 4: Jika berikatan dengan ion klorida (Cl⁻), senyawa yang terbentuk adalah garam dapur.',
    ],
    options: ['Natrium', 'Kalium', 'Litium', 'Magnesium'],
  },
  {
    id: 'guess-2',
    targetElement: 'Karbon',
    symbol: 'C',
    number: 6,
    category: 'Nonlogam',
    clues: [
      'Petunjuk 1: Memiliki nomor atom 6 dengan 4 elektron valensi (tetravalen).',
      'Petunjuk 2: Mampu membentuk rantai panjang katenasi yang menjadi dasar seluruh senyawa organik.',
      'Petunjuk 3: Memiliki bentuk alotrop berupa intan permata yang sangat keras dan grafit pensil yang licin.',
      'Petunjuk 4: Siklusnya di alam berkaitan erat dengan fotosintesis dan pemanasan global.',
    ],
    options: ['Karbon', 'Silikon', 'Nitrogen', 'Boron'],
  },
  {
    id: 'guess-3',
    targetElement: 'Bromin',
    symbol: 'Br',
    number: 35,
    category: 'Halogen',
    clues: [
      'Petunjuk 1: Berada di Golongan VIIA (Halogen) Periode 4.',
      'Petunjuk 2: Satu dari hanya DUA unsur di seluruh tabel periodik yang berwujud cair pada suhu kamar.',
      'Petunjuk 3: Berwarna cairan merah kecokelatan pekat dengan uap berbau tajam menyengat.',
      'Petunjuk 4: Larutannya digunakan dalam laboratorium untuk menguji ikatan rangkap alkena.',
    ],
    options: ['Bromin', 'Raksa', 'Klorin', 'Iodin'],
  },
  {
    id: 'guess-4',
    targetElement: 'Emas',
    symbol: 'Au',
    number: 79,
    category: 'Logam Transisi Mulia',
    clues: [
      'Petunjuk 1: Memiliki lambang dari kata Latin "Aurum" dengan nomor atom 79.',
      'Petunjuk 2: Logam paling lentur dan dapat ditempa (malleable) di dunia tanpa mudah patah.',
      'Petunjuk 3: Sangat inert, tidak berkarat di udara bebas maupun air laut.',
      'Petunjuk 4: Hanya dapat larut dalam campuran asam pekat khusus bernama Aqua Regia (Air Raja).',
    ],
    options: ['Emas', 'Perak', 'Platina', 'Tembaga'],
  },
];

// 3. COCOKKAN PASANGAN (Match Pairs)
export interface MatchPairSet {
  id: string;
  title: string;
  pairs: { id: string; left: string; right: string }[];
}

export const MATCH_PAIR_SETS: MatchPairSet[] = [
  {
    id: 'name-symbol',
    title: 'Nama Unsur ↔ Simbol Kimia',
    pairs: [
      { id: '1', left: 'Besi', right: 'Fe' },
      { id: '2', left: 'Emas', right: 'Au' },
      { id: '3', left: 'Perak', right: 'Ag' },
      { id: '4', left: 'Tembaga', right: 'Cu' },
      { id: '5', left: 'Timbal', right: 'Pb' },
      { id: '6', left: 'Raksa', right: 'Hg' },
    ],
  },
  {
    id: 'element-number',
    title: 'Unsur ↔ Nomor Atom (Z)',
    pairs: [
      { id: '1', left: 'Hidrogen (H)', right: '1' },
      { id: '2', left: 'Karbon (C)', right: '6' },
      { id: '3', left: 'Oksigen (O)', right: '8' },
      { id: '4', left: 'Natrium (Na)', right: '11' },
      { id: '5', left: 'Klorin (Cl)', right: '17' },
      { id: '6', left: 'Kalsium (Ca)', right: '20' },
    ],
  },
  {
    id: 'element-category',
    title: 'Unsur ↔ Golongan Kimia',
    pairs: [
      { id: '1', left: 'Kalium (K)', right: 'Logam Alkali (IA)' },
      { id: '2', left: 'Magnesium (Mg)', right: 'Logam Alkali Tanah (IIA)' },
      { id: '3', left: 'Fluorin (F)', right: 'Halogen (VIIA)' },
      { id: '4', left: 'Neon (Ne)', right: 'Gas Mulia (VIIIA)' },
      { id: '5', left: 'Silikon (Si)', right: 'Metaloid' },
      { id: '6', left: 'Besi (Fe)', right: 'Logam Transisi' },
    ],
  },
  {
    id: 'reactant-product',
    title: 'Reaktan ↔ Produk Reaksi',
    pairs: [
      { id: '1', left: '2H₂ + O₂', right: '2H₂O' },
      { id: '2', left: '2Mg + O₂', right: '2MgO' },
      { id: '3', left: 'HCl + NaOH', right: 'NaCl + H₂O' },
      { id: '4', left: 'CH₄ + 2O₂', right: 'CO₂ + 2H₂O' },
      { id: '5', left: '2Na + Cl₂', right: '2NaCl' },
      { id: '6', left: 'CaCO₃ (dipanaskan)', right: 'CaO + CO₂' },
    ],
  },
];

// 4. SUSUN PERSAMAAN REAKSI
export interface BalanceGameItem {
  id: string;
  title: string;
  grade: string;
  unbalancedParts: {
    reactants: { formula: string; correctCoeff: number }[];
    products: { formula: string; correctCoeff: number }[];
  };
  explanation: string;
}

export const BALANCE_GAME_ITEMS: BalanceGameItem[] = [
  {
    id: 'b-1',
    title: 'Penyetaraan Pembentukan Air',
    grade: 'Kelas X',
    unbalancedParts: {
      reactants: [
        { formula: 'H₂', correctCoeff: 2 },
        { formula: 'O₂', correctCoeff: 1 },
      ],
      products: [
        { formula: 'H₂O', correctCoeff: 2 },
      ],
    },
    explanation: '2 molekul H₂ (4 atom H) bereaksi dengan 1 molekul O₂ (2 atom O) menghasilkan 2 molekul H₂O (4 atom H dan 2 atom O).',
  },
  {
    id: 'b-2',
    title: 'Sintesis Amonia (Proses Haber-Bosch)',
    grade: 'Kelas X & XI',
    unbalancedParts: {
      reactants: [
        { formula: 'N₂', correctCoeff: 1 },
        { formula: 'H₂', correctCoeff: 3 },
      ],
      products: [
        { formula: 'NH₃', correctCoeff: 2 },
      ],
    },
    explanation: '1 N₂ (2 atom N) + 3 H₂ (6 atom H) → 2 NH₃ (2 atom N dan 6 atom H).',
  },
  {
    id: 'b-3',
    title: 'Pembakaran Propana',
    grade: 'Kelas XI',
    unbalancedParts: {
      reactants: [
        { formula: 'C₃H₈', correctCoeff: 1 },
        { formula: 'O₂', correctCoeff: 5 },
      ],
      products: [
        { formula: 'CO₂', correctCoeff: 3 },
        { formula: 'H₂O', correctCoeff: 4 },
      ],
    },
    explanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Atom C: 3=3, Atom H: 8=8, Atom O: 10=6+4=10.',
  },
  {
    id: 'b-4',
    title: 'Reaksi Aluminium dengan Asam Klorida',
    grade: 'Kelas X & XI',
    unbalancedParts: {
      reactants: [
        { formula: 'Al', correctCoeff: 2 },
        { formula: 'HCl', correctCoeff: 6 },
      ],
      products: [
        { formula: 'AlCl₃', correctCoeff: 2 },
        { formula: 'H₂', correctCoeff: 3 },
      ],
    },
    explanation: '2Al + 6HCl → 2AlCl₃ + 3H₂. Muatan dan jumlah atom Al, H, dan Cl seimbang sempurna di kedua ruas.',
  },
];

// 5. BENAR ATAU SALAH (True/False Blitz)
export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export const TRUE_FALSE_STATEMENTS: TrueFalseStatement[] = [
  {
    id: 'tf-1',
    statement: 'Dalam satu periode tabel periodik dari kiri ke kanan, jari-jari atom cenderung semakin besar.',
    isTrue: false,
    explanation: 'Salah! Dari kiri ke kanan dalam satu periode, jumlah muatan inti (proton) bertambah sedangkan kulit atom tetap, sehingga gaya tarik inti terhadap elektron semakin kuat dan jari-jari atom mengecil.',
  },
  {
    id: 'tf-2',
    statement: 'Semua unsur golongan gas mulia (Golongan VIIIA) memiliki 8 elektron valensi di kulit terluarnya.',
    isTrue: false,
    explanation: 'Salah! Helium (He) adalah pengecualian istimewa; nomor atomnya 2 sehingga hanya memiliki 2 elektron valensi (kaidah duplet), sedangkan gas mulia lainnya oktet (8).',
  },
  {
    id: 'tf-3',
    statement: 'Larutan netral pada suhu 25°C memiliki nilai pH sama dengan 7.',
    isTrue: true,
    explanation: 'Benar! Pada suhu 25°C, nilai Kw = 10⁻¹⁴, sehingga [H⁺] = [OH⁻] = 10⁻⁷ M, menghasilkan pH = -log(10⁻⁷) = 7.',
  },
  {
    id: 'tf-4',
    statement: 'Hukum Kekekalan Massa menyatakan bahwa massa zat setelah reaksi selalu berkurang karena sebagian berubah menjadi energi.',
    isTrue: false,
    explanation: 'Salah! Menurut Hukum Lavoisier, dalam sistem tertutup massa zat sebelum dan sesudah reaksi kimia biasa selalu konstan (sama persis). Perubahan massa ke energi hanya signifikan pada reaksi inti/nuklir.',
  },
  {
    id: 'tf-5',
    statement: 'Unsur halogen Fluorin (F) memiliki nilai keelektronegatifan tertinggi di antara seluruh unsur di tabel periodik.',
    isTrue: true,
    explanation: 'Benar! Nilai keelektronegatifan Fluorin pada skala Pauling mencapai 3.98 (hampir 4.0), menjadikannya unsur yang paling rakus menarik elektron ikatan.',
  },
  {
    id: 'tf-6',
    statement: 'Reaksi oksidasi selalu melibatkan penangkapan elektron oleh suatu unsur.',
    isTrue: false,
    explanation: 'Salah! Reaksi oksidasi adalah pelepasan elektron (kenaikan bilangan oksidasi). Penangkapan elektron disebut reaksi reduksi (OIL RIG: Oxidation Is Loss, Reduction Is Gain).',
  },
];

// 6. DETEKTIF KIMIA (Mystery Cases)
export interface DetectiveCase {
  id: string;
  title: string;
  caseBackground: string;
  clues: string[];
  question: string;
  suspects: { name: string; formula: string; motive: string }[];
  correctSuspect: string;
  caseDebrief: string;
}

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'case-1',
    title: 'Kasus Botol Misteri di Gudang Reagen',
    caseBackground: 'Seorang laboran menemukan botol kaca tanpa label di lemari bahan kimia. Di dalamnya terdapat potongan padatan lunak keperakan yang terendam cairan berminyak bening. Ketika sebutir kecil padatan tersebut tak sengaja dijatuhkan ke wadah air, padatan itu langsung mendesis, bergerak cepat di permukaan air, dan menghasilkan nyala api berwarna kuning menyilaukan disertai gas hidrogen!',
    clues: [
      'Bukti 1: Zat tersebut berupa logam lunak yang harus disimpan di minyak tanah.',
      'Bukti 2: Uji nyala api menghasilkan warna kuning terang khas.',
      'Bukti 3: Larutan air bekas reaksi mengubah kertas lakmus merah menjadi biru pekat (basa kuat).',
    ],
    question: 'Berdasarkan bukti laboratorium, unsur kimia apakah yang ada di dalam botol misterius tersebut?',
    suspects: [
      { name: 'Kalsium (Ca)', formula: 'Ca', motive: 'Logam alkali tanah yang bereaksi sedang dengan air dan menghasilkan warna nyala merah bata.' },
      { name: 'Natrium (Na)', formula: 'Na', motive: 'Logam alkali periode 3 yang sangat reaktif dengan air menghasilkan NaOH basa dan nyala api kuning.' },
      { name: 'Tembaga (Cu)', formula: 'Cu', motive: 'Logam transisi yang tidak bereaksi dengan air pada suhu kamar.' },
      { name: 'Aluminium (Al)', formula: 'Al', motive: 'Logam berlapisan oksida pasif yang stabil di udara terbuka.' },
    ],
    correctSuspect: 'Natrium (Na)',
    caseDebrief: 'Kasus terpecahkan! Logam Natrium (Na) bereaksi dahsyat dengan air: 2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g) + Kalor. Panas reaksi menyulut gas hidrogen dan memancarkan spektrum emisi atom natrium berwarna kuning khas 589 nm.',
  },
  {
    id: 'case-2',
    title: 'Misteri Gas Tak Terlihat di Tambang Bawah Tanah',
    caseBackground: 'Para penambang di gua kapur mengalami sesak napas mendadak di lorong yang lebih rendah. Api lilin pemandu mereka mendadak padam seketika tanpa ada tiupan angin. Sampel gas diambil dan dialirkan ke dalam air kapur jernih Ca(OH)₂, seketika itu juga air kapur berubah menjadi keruh putih seperti susu.',
    clues: [
      'Bukti 1: Gas tersebut tidak berwarna, tidak berbau, dan memiliki densitas lebih berat dari udara biasa sehingga mengendap di dasar gua.',
      'Bukti 2: Gas ini tidak mendukung pembakaran (memadamkan nyala lilin).',
      'Bukti 3: Bereaksi dengan air kapur jernih Ca(OH)₂ menghasilkan endapan putih CaCO₃ kalsium karbonat.',
    ],
    question: 'Senyawa gas apakah yang menjadi biang keladi di tambang tersebut?',
    suspects: [
      { name: 'Karbon Monoksida (CO)', formula: 'CO', motive: 'Gas beracun pengikat hemoglobin tetapi mudah terbakar dengan nyala biru.' },
      { name: 'Karbon Dioksida (CO₂)', formula: 'CO₂', motive: 'Gas asam pemadam api yang mengeruhkan air kapur melalui reaksi pembentukan CaCO₃.' },
      { name: 'Gas Metana (CH₄)', formula: 'CH₄', motive: 'Gas tambang yang sangat mudah meledak jika terkena nyala lilin.' },
      { name: 'Gas Oksigen (O₂)', formula: 'O₂', motive: 'Gas yang justru memperbesar nyala api lilin.' },
    ],
    correctSuspect: 'Karbon Dioksida (CO₂)',
    caseDebrief: 'Tepat sekali Detektif! Gas tersebut adalah Karbon Dioksida (CO₂). Reaksi dengan air kapur jernih: CO₂(g) + Ca(OH)₂(aq) → CaCO₃(s)↓ + H₂O(l). Endapan CaCO₃ inilah yang membuat air kapur menjadi keruh putih.',
  },
  {
    id: 'case-3',
    title: 'Misteri Perubahan Warna Larutan Ajaib',
    caseBackground: 'Di sebuah pertunjukan sains, seorang pesulap mencelupkan paku besi abu-abu (Fe) ke dalam larutan biru cerah tembaga(II) sulfat CuSO₄. Beberapa menit kemudian, paku besi terlapisi kerak logam kemerahan dan warna biru larutan perlahan memudar berubah menjadi kehijauan pucat.',
    clues: [
      'Bukti 1: Logam besi (Fe) teroksidasi menjadi ion Fe²⁺ yang berwarna kehijauan pucat di dalam air.',
      'Bukti 2: Ion Cu²⁺ biru menangkap elektron dari besi dan mengendap sebagai tembaga logam padat Cu berwarna kemerahan.',
      'Bukti 3: Peristiwa ini merupakan bukti nyata urutan Deret Volta logam.',
    ],
    question: 'Fenomena kimia apakah yang sebenarnya terjadi dalam atraksi pesulap tersebut?',
    suspects: [
      { name: 'Reaksi Asam-Basa Netralisasi', formula: 'Neutralization', motive: 'Pertukaran proton H+ dan OH-.' },
      { name: 'Reaksi Redoks Desakan Logam (Penggantian Tunggal)', formula: 'Fe + CuSO4 -> FeSO4 + Cu', motive: 'Besi mendesak ion tembaga karena potensial reduksi standar Fe lebih negatif (lebih aktif).' },
      { name: 'Pemisahan Fisika Filtrasi', formula: 'Physical', motive: 'Pemisahan zat murni tanpa perubahan kimiawi.' },
      { name: 'Reaksi Polimerisasi Sintetis', formula: 'Polymer', motive: 'Penggabungan monomer rantai panjang.' },
    ],
    correctSuspect: 'Reaksi Redoks Desakan Logam (Penggantian Tunggal)',
    caseDebrief: 'Analisis sempurna! Reaksi desakan logam menurut Deret Volta: Logam yang letaknya lebih kiri (Fe, E° = -0.44 V) mampu mereduksi ion logam yang berada di sebelah kanannya (Cu, E° = +0.34 V). Reaksi: Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s). Lapisan kemerahan pada paku adalah tembaga murni!',
  },
];

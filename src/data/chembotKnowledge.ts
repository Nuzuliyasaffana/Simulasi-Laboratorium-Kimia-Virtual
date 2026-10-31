import { GradeLevel } from '../types';

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  grade?: GradeLevel;
}

export const SUGGESTED_PROMPTS: QuickPrompt[] = [
  {
    id: 'p1',
    label: '⚛️ Apa itu sifat periodik unsur?',
    prompt: 'Tolong jelaskan sifat-sifat periodik unsur seperti jari-jari atom, energi ionisasi, dan keelektronegatifan dengan bahasa yang mudah dipahami!',
  },
  {
    id: 'p2',
    label: '🧪 Cara menyetarakan reaksi kimia',
    prompt: 'Bagaimana langkah mudah dan trik cepat menyetarakan persamaan reaksi kimia?',
  },
  {
    id: 'p3',
    label: '⚖️ Kenapa massa sebelum & sesudah reaksi sama?',
    prompt: 'Jelaskan konsep Hukum Kekekalan Massa Lavoisier dan berikan contoh nyata dalam kehidupan sehari-hari!',
  },
  {
    id: 'p4',
    label: '💧 Mengapa bentuk molekul H₂O bengkok?',
    prompt: 'Mengapa bentuk molekul air (H₂O) bengkok padahal tersusun atas 3 atom? Bagaimana pengaruh pasangan elektron bebas (PEB)?',
    grade: 'XI',
  },
  {
    id: 'p5',
    label: '⚡ Apa beda Sel Volta dan Sel Elektrolisis?',
    prompt: 'Tolong jelaskan perbedaan mendasar antara Sel Volta dan Sel Elektrolisis dari segi reaksi dan perubahan energinya!',
    grade: 'XII',
  },
  {
    id: 'p6',
    label: '🎯 Tips belajar kimia SMA agar tidak bingung',
    prompt: 'Berikan tips belajar kimia yang efektif dan menyenangkan untuk siswa SMA sesuai tingkatan kelasku!',
  },
];

export function getOfflineChemBotResponse(prompt: string, grade: GradeLevel, studentName: string): string {
  const p = prompt.toLowerCase();
  const name = studentName || 'Sobat Kimiawan';

  if (p.includes('halo') || p.includes('hai') || p.includes('siapa kamu')) {
    return `Halo **${name}**! 👋 Senang sekali bertemu denganmu di ChemQuest! Aku adalah **ChemBot**, asisten belajar kimia AI pribadimu. Kamu sekarang berada di tingkat **Kelas ${grade} SMA**.\n\nKamu bisa bertanya apa saja kepadaku seputar:\n- Konsep dan materi kimia kurikulum SMA\n- Penjelasan hasil simulasi laboratorium\n- Trik menyetarakan persamaan reaksi\n- Pembahasan soal kuis dan evaluasi\n\nApa topik kimia yang ingin kita jelajahi hari ini? 🚀`;
  }

  if (p.includes('periodik') || p.includes('jari-jari') || p.includes('elektronegatif') || p.includes('ionisasi')) {
    return `Hai **${name}**, mari kita bedah **Sifat Keperiodikan Unsur** dengan analogi yang mudah diingat! 🎯\n\n1. **Jari-Jari Atom (Ukuran Atom):**\n   - *Dalam satu golongan (atas ke bawah):* **Makin BESAR**, karena jumlah kulit atom bertambah.\n   - *Dalam satu periode (kiri ke kanan):* **Makin KECIL**, karena muatan inti (proton) bertambah sehingga menarik elektron terluar lebih kuat ke pusat.\n\n2. **Energi Ionisasi (Energi melepas elektron):**\n   - *Atas ke bawah:* **Makin KECIL** (makin mudah lepas karena jari-jari besar).\n   - *Kiri ke kanan:* **Makin BESAR** (makin sulit lepas karena tarikan inti kuat).\n\n3. **Keelektronegatifan (Kekuatan menarik elektron ikatan):**\n   - Unsur paling elektronegatif adalah **Fluorin (F)** dengan nilai 3.98.\n   - *Atas ke bawah:* **Makin KECIL**.\n   - *Kiri ke kanan:* **Makin BESAR**.\n\n💡 *Trik Cepat ChemBot:* Ingat singkatan **"FI-Kiri-Kanan"** — dari kiri ke kanan sifat nonlogam dan keelektronegatifan selalu naik!`;
  }

  if (p.includes('setara') || p.includes('koefisien') || p.includes('persamaan reaksi')) {
    return `Menyetarakan persamaan reaksi itu seperti memecahkan teka-teki timbangan, **${name}**! ⚖️\n\n**Prinsip Utama:** Jumlah setiap jenis atom di sisi kiri (reaktan) HARUS SAMA dengan sisi kanan (produk) sesuai **Hukum Lavoisier**.\n\n**Langkah Praktis ChemBot:**\n1. Tulis kerangka reaksi (rumus senyawa jangan diubah indeksnya!).\n2. Setarakan atom logam terlebih dahulu (contoh: Na, Mg, Fe, Al).\n3. Setarakan atom nonlogam selain H dan O (contoh: C, N, S, Cl).\n4. Setarakan atom **Hidrogen (H)**.\n5. Terakhir, setarakan atom **Oksigen (O)** (Oksigen dijadikan kunci pengecek terakhir).\n\n*Contoh:* **C₃H₈ + O₂ → CO₂ + H₂O**\n- Atom C: kiri ada 3, maka beri koefisien 3 pada CO₂ → 3CO₂.\n- Atom H: kiri ada 8, maka beri koefisien 4 pada H₂O → 4H₂O.\n- Atom O: kanan ada (3×2) + (4×1) = 10 atom O. Maka O₂ di kiri dikali 5 (10/2).\n- Hasil setara sempurna: **C₃H₈ + 5O₂ → 3CO₂ + 4H₂O**! ✨`;
  }

  if (p.includes('kekekalan massa') || p.includes('lavoisier')) {
    return `Konsep **Hukum Kekekalan Massa (Lavoisier)** adalah hukum paling fundamental dalam kimia, **${name}**! 🧪\n\n*"Dalam suatu sistem tertutup, massa total zat sebelum reaksi adalah SAMA dengan massa total zat setelah reaksi."*\n\n**Kenapa bisa sama?**\nKarena reaksi kimia biasa hanya menata ulang ikatan antar atom. Atom tidak pernah musnah dan atom baru tidak pernah tercipta tiba-tiba!\n\n**Pertanyaan umum siswa:** *"Kenapa kalau kita bakar kayu atau kertas, abu yang tersisa jauh lebih ringan?"*\n👉 Jawabannya: Karena pembakaran terjadi di tempat terbuka! Sebagian besar atom karbon dan hidrogen dari kayu berubah menjadi **gas Karbon Dioksida (CO₂)** dan **uap air (H₂O)** yang terbang bebas ke atmosfer. Jika pembakaran kayu dilakukan di wadah tertutup kedap udara, timbangan digital akan mencatat massa yang persis sama sebelum dan sesudah dibakar!`;
  }

  if (p.includes('h2o') || p.includes('air') || p.includes('bentuk molekul') || p.includes('vsepr')) {
    return `Pertanyaan brilian tentang molekul air (H₂O), **${name}**! 💧\n\nSecara sekilas, orang mengira H-O-H akan berbentuk garis lurus (linear). Tapi kenyataannya, molekul H₂O berbentuk **Bengkok (Bent)** dengan sudut ikatan **104.5°**. Mengapa?\n\n1. Atom pusat Oksigen memiliki 6 elektron valensi.\n2. Dua elektron digunakan berikatan kovalen dengan dua atom H (menjadi **2 Pasangan Elektron Ikatan / PEI**).\n3. Sisa 4 elektron oksigen membentuk **2 Pasangan Elektron Bebas (PEB)**.\n4. Menurut teori tolakan **VSEPR (Valence Shell Electron Pair Repulsion)**, elektron bebas sangat egois dan membutuhkan ruang lebih besar. Tolakan PEB-PEB > PEB-PEI > PEI-PEI.\n5. Akibatnya, kedua PEB menekan ikatan O-H ke bawah, sehingga sudut ikatan tertekan dari sudut ideal tetrahedral (109.5°) menjadi **104.5°**! Inilah yang juga membuat air bersifat polar dan memiliki kemampuan melarutkan garam yang luar biasa.`;
  }

  if (p.includes('volta') || p.includes('elektrolisis') || p.includes('redoks')) {
    return `Materi favorit kelas XII nih, **${name}**! Mari kita bedakan **Sel Volta vs Sel Elektrolisis** dengan tabel ringkas: ⚡\n\n| Fitur | Sel Volta (Galvani) | Sel Elektrolisis |\n| :--- | :--- | :--- |\n| **Prinsip** | Mengubah energi **kimia → listrik** | Mengubah energi **listrik → kimia** |\n| **Sifat Reaksi** | Spontan ($E^\\circ_{sel} > 0$) | Tidak Spontan (butuh arus luar) |\n| **Anoda (Oksidasi)** | Kutub **Negatif (-)** | Kutub **Positif (+)** |\n| **Katoda (Reduksi)**| Kutub **Positif (+)** | Kutub **Negatif (-)** |\n| **Contoh Nyata** | Baterai HP, Aki mobil | Penyepuhan perhiasan emas/perak, produksi gas klorin |\n\n💡 *Jembatan Keledai ChemBot:* \n- **KRAO:** **K**atoda **R**eduksi, **A**noda **O**ksidasi (berlaku untuk KEDUA sel!).\n- Pada Sel Volta ingat **PANIC** terbalik: Anoda Negatif, Katoda Positif.`;
  }

  if (p.includes('asam') || p.includes('basa') || p.includes('ph') || p.includes('titrasi')) {
    return `Yuk kita bahas larutan **Asam & Basa**, **${name}**! 🧪\n\n- **Asam (pH < 7):** Melepaskan ion H⁺ di air, berasa masam, memerahkan lakmus biru. Contoh: Asam lambung (HCl), asam cuka (CH₃COOH), vitamin C (asam askorbat).\n- **Netral (pH = 7):** Contoh: Air murni, garam meja (NaCl).\n- **Basa (pH > 7):** Melepaskan ion OH⁻ di air, berasa pahit, licin di kulit, membirukan lakmus merah. Contoh: Sabun, obat maag Mg(OH)₂, pemutih pakaian.\n\n**Rumus Kilat pH:**\n- Asam kuat: $[H^+] = a \\times M_a \\implies pH = -\\log[H^+]$\n- Basa kuat: $[OH^-] = b \\times M_b \\implies pOH = -\\log[OH^-] \\implies pH = 14 - pOH$\n\nSaat kamu melakukan titrasi di Laboratorium Virtual ChemQuest, pada titik netralisasi berlaku persamaan ekuivalen: **$V_a \\times M_a \\times a = V_b \\times M_b \\times b$**!`;
  }

  // Fallback tailored to student grade
  const gradeTopicGuide = {
    'X': 'fokus memperdalam struktur atom, konfigurasi elektron, sifat keperiodikan tabel periodik, dan ikatan kimia dasar!',
    'XI': 'fokus menguasai stoikiometri konsep mol, bentuk molekul VSEPR, perhitungan pH asam-basa, dan laju reaksi!',
    'XII': 'fokus memperkuat konsep reaksi redoks, sel elektrokimia (Volta & Elektrolisis), sifat koligatif larutan, dan gugus fungsi senyawa karbon!',
  }[grade];

  return `Pertanyaan yang sangat menarik, **${name}**! 💡\n\nDalam kimia SMA, setiap fenomena materi selalu berkaitan dengan elektron dan ikatan antar atom. Karena kamu sekarang berada di **Kelas ${grade} SMA**, ChemBot menyarankan agar kamu ${gradeTopicGuide}\n\nCobalah juga fitur **Laboratorium Simulasi** dan **Arena Reaksi** di ChemQuest untuk melihat langsung visualisasi partikel dan persamaan kimianya secara interaktif. Ada pertanyaan khusus tentang soal atau eksperimen tertentu? Tuliskan saja pertanyaannya ya!`;
}

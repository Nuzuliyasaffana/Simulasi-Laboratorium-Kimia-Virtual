import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// ChemBot AI Endpoint
app.post('/api/chembot', async (req, res) => {
  try {
    const { prompt, grade, studentName, context, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Fallback mode active.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const gradeLabel = grade || 'Kelas X (1 SMA)';
    const name = studentName || 'Siswa';

    const systemInstruction = `Kamu adalah "ChemBot", asisten dan tutor belajar kimia berbasis AI yang ramah, antusias, dan cerdas dalam game edukasi "ChemQuest: Petualangan di Dunia Unsur Kimia".
Pengguna adalah ${name}, seorang siswa SMA di Indonesia tingkat: ${gradeLabel}.

TUGAS UTAMA DAN PANDUANMU:
1. Bahasa: Gunakan Bahasa Indonesia yang ramah, mudah dipahami siswa SMA, inspiratif, edukatif, dan akurat secara ilmiah.
2. Penyesuaian Tingkat Belajar:
   - Jika Kelas X (1 SMA): Fokus pada struktur atom (proton, neutron, elektron), nomor atom/massa, konfigurasi elektron (Bohr & Aufbau dasar), letak unsur dalam tabel periodik (golongan & periode), sifat keperiodikan (jari-jari atom, energi ionisasi, afinitas elektron, keelektronegatifan), serta ikatan kimia dasar (ionik & kovalen).
   - Jika Kelas XI (2 SMA): Fokus pada bentuk molekul (VSEPR, PEB, PEI), gaya antarmolekul, stoikiometri (konsep mol, massa molar, pereaksi pembatas), hukum gas, persamaan reaksi, larutan asam-basa (pH, indikator, titrasi), hidrolisis garam, larutan penyangga, termokimia, dan laju reaksi.
   - Jika Kelas XII (3 SMA): Fokus pada reaksi redoks (penyetaraan setengah reaksi & PBO), elektrokimia (sel Volta & sel elektrolisis), sifat koligatif larutan, kesetimbangan kimia & pergeseran Le Chatelier, kimia unsur, kimia karbon (gugus fungsi haloalkana, alkohol, eter, aldehida, keton, asam karboksilat, ester), serta makromolekul (karbohidrat, protein, polimer).
3. Pedagogi:
   - Berikan penjelasan langkah demi langkah (scaffolding).
   - Jika siswa bertanya soal atau bingung, berikan analogi nyata sehari-hari dan petunjuk bertahap tanpa langsung membocorkan jawaban final.
   - Jika siswa bertanya tentang hasil simulasi atau reaksi kimia, jelaskan alasan mengapa reaksi terjadi berdasarkan prinsip ilmiah (contoh: transfer elektron, kestabilan gas mulia oktet, netralisasi ion H+ dan OH-).
   - Selalu berikan motivasi dan apresiasi atas rasa ingin tahu siswa.
4. Format: Gunakan poin-poin yang rapi, bolding pada istilah penting kimia, dan rumus kimia yang jelas (contoh: H₂O, 2Mg + O₂ → 2MgO, pH = -log[H⁺]).`;

    // Format contents with history if provided
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    const currentPromptText = context
      ? `[Konteks Pembelajaran saat ini: ${context}]\n\nPertanyaan Siswa: ${prompt}`
      : prompt;

    contents.push({
      role: 'user',
      parts: [{ text: currentPromptText }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, ChemBot sedang memproses materi. Coba tanyakan kembali ya!';
    return res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('ChemBot API error:', error?.message || error);
    return res.json({
      success: false,
      fallback: true,
      error: error?.message || 'Error contacting Gemini API',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ChemQuest server running on port ${port}`);
  });
}

startServer();

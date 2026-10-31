import React, { useState } from 'react';
import { EVALUATION_QUESTIONS_BY_GRADE } from '../../data/evaluations';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import {
  Award,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

interface FinalEvaluationProps {
  onBackToDashboard: () => void;
  openChemBotWithTopic?: (topic: string) => void;
}

export const FinalEvaluation: React.FC<FinalEvaluationProps> = ({ onBackToDashboard, openChemBotWithTopic }) => {
  const { user, recordEvaluation } = useGame();
  const currentGrade = user?.grade || 'X';
  const questions = EVALUATION_QUESTIONS_BY_GRADE[currentGrade] || EVALUATION_QUESTIONS_BY_GRADE['X'];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [resultsData, setResultsData] = useState<{
    score: number;
    correctCount: number;
    incorrectCount: number;
    topicStats: Record<string, { total: number; correct: number }>;
  } | null>(null);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (ans: any) => {
    soundManager.playClick();
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleOpenSubmitConfirm = () => {
    soundManager.playClick();
    setShowConfirmModal(true);
  };

  const handleSubmitEvaluation = () => {
    setShowConfirmModal(false);

    let correct = 0;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach(q => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;

      const userAns = userAnswers[q.id];
      const isCorrect = userAns === q.correctAnswer;

      if (isCorrect) {
        correct++;
        topicStats[q.topic].correct += 1;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);
    const incorrect = questions.length - correct;

    setResultsData({
      score: finalScore,
      correctCount: correct,
      incorrectCount: incorrect,
      topicStats,
    });

    setIsCompleted(true);
    recordEvaluation(finalScore, questions.length);
  };

  const handleRetake = () => {
    soundManager.playClick();
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setResultsData(null);
  };

  const answeredCount = Object.keys(userAnswers).length;

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
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-slate-900 transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-rose-500" />
                Evaluasi Akhir Pembelajaran Kimia
              </h1>
              <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-300">
                Kelas {currentGrade} SMA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              15 Butir soal terstandar untuk mengukur pemahaman konsep & ketuntasan belajar (KKM: 75)
            </p>
          </div>
        </div>

        {!isCompleted && (
          <div className="text-right">
            <span className="text-xs text-slate-500">Terjawab:</span>
            <span className="text-sm font-black text-rose-600 ml-1.5">
              {answeredCount} / {questions.length} Soal
            </span>
          </div>
        )}
      </div>

      {/* EVALUATION IN PROGRESS */}
      {!isCompleted && (
        <div className="space-y-6">
          {/* Progress Bar & Question Palette */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Soal {currentIndex + 1} dari {questions.length}</span>
              <span className="text-rose-600 font-mono">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}% Selesai
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Quick jump palette */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isFilled = userAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-xs'
                        : isFilled
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                        : 'bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-cyan-800 border border-slate-200">
                Topik: {currentQ.topic}
              </span>
              <span className="text-xs text-slate-500 capitalize font-medium">
                Tipe: {currentQ.type.replace('-', ' ')}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Choices for Multiple-Choice & Analysis */}
            {(currentQ.type === 'multiple-choice' || currentQ.type === 'analysis') && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400 shadow-xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Choices for True-False */}
            {currentQ.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'BENAR', val: true, color: 'hover:border-emerald-500 hover:text-emerald-700' },
                  { label: 'SALAH', val: false, color: 'hover:border-rose-500 hover:text-rose-700' },
                ].map(item => {
                  const isSelected = userAnswers[currentQ.id] === item.val;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSelectAnswer(item.val)}
                      className={`p-6 rounded-2xl border text-center font-black text-base transition-all ${
                        isSelected
                          ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-500'
                          : `bg-slate-50 border-slate-200 text-slate-700 ${item.color}`
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 disabled:opacity-30 text-slate-600 text-xs font-bold hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleOpenSubmitConfirm}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-xs font-black shadow-md transition-all"
                >
                  Selesaikan Evaluasi
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-black text-slate-900">Konfirmasi Pengumpulan Evaluasi</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Kamu telah menjawab <strong>{answeredCount}</strong> dari total <strong>{questions.length}</strong> butir soal.
              {answeredCount < questions.length && (
                <span className="block text-amber-600 font-bold mt-1">
                  ⚠️ Masih ada {questions.length - answeredCount} soal yang belum kamu jawab.
                </span>
              )}
              Apakah kamu yakin ingin mengakhiri evaluasi dan melihat hasil serta pembahasannya sekarang?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Kembali Periksa
              </button>
              <button
                onClick={handleSubmitEvaluation}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE RESULTS REPORT */}
      {isCompleted && resultsData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Score Card */}
          <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 border border-rose-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-rose-600" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Laporan Hasil Belajar Siswa
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Skor Akhir:{' '}
                <span className={resultsData.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                  {resultsData.score}
                </span>{' '}
                <span className="text-lg font-bold text-slate-400">/ 100</span>
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold border">
              {resultsData.score >= 75 ? (
                <span className="text-emerald-700 bg-emerald-100 border-emerald-300 flex items-center gap-1.5 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  TUNTAS BELAJAR (Di atas KKM 75)
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-100 border-amber-300 flex items-center gap-1.5 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                  PERLU PENGAYAAN & LATIHAN TAMBAHAN
                </span>
              )}
            </div>

            {/* Quick summary metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 border-t border-slate-200">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Benar</div>
                <div className="text-lg font-black text-emerald-600">{resultsData.correctCount} Soal</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Salah</div>
                <div className="text-lg font-black text-rose-600">{resultsData.incorrectCount} Soal</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Ketuntasan</div>
                <div className="text-lg font-black text-cyan-700">{resultsData.score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Bonus XP</div>
                <div className="text-lg font-black text-amber-600">+{resultsData.score * 2} XP</div>
              </div>
            </div>
          </div>

          {/* Topic Mastery Analysis */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              Rincian Penguasaan Materi (Berdasarkan Topik)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(resultsData.topicStats).map(([topic, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                const isMastered = pct >= 75;
                return (
                  <div key={topic} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{topic}</span>
                      <span className={isMastered ? 'text-emerald-700' : 'text-amber-700'}>
                        {stats.correct}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full ${isMastered ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {isMastered ? '✅ Sudah dikuasai dengan baik' : '⚠️ Disarankan mengulang latihan & simulasi'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Pembahasan Lengkap & Kunci Jawaban
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border space-y-3 transition-colors shadow-2xs ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700">Topik: {q.topic}</span>
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {isCorrect ? 'Jawaban Benar' : 'Jawaban Salah'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {q.question}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isOptionCorrect = oIdx === q.correctAnswer;
                          const wasChosen = userAns === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                isOptionCorrect
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                  : wasChosen
                                  ? 'bg-rose-100 border-rose-400 text-rose-900'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                      <strong className="text-cyan-800 font-bold">Pembahasan Ilmiah:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Evaluasi</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onBackToDashboard();
              }}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black shadow-md transition-all"
            >
              Kembali ke Dashboard Utama
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

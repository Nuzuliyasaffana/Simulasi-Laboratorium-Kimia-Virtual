import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GradeLevel, Badge, Mission } from '../types';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

export const ALL_BADGES: Badge[] = [
  {
    id: 'explorer',
    name: 'Penjelajah Unsur',
    description: 'Membuka dan mempelajari informasi 5 unsur di tabel periodik interaktif.',
    icon: '🧭',
    condition: 'Buka 5 kartu detail unsur',
  },
  {
    id: 'reaction_master',
    name: 'Ahli Reaksi',
    description: 'Menyelesaikan tantangan penyetaraan persamaan reaksi di Arena Reaksi.',
    icon: '⚡',
    condition: 'Selesaikan tantangan di Arena Reaksi',
  },
  {
    id: 'periodic_master',
    name: 'Master Tabel Periodik',
    description: 'Menyelesaikan kuis dan tantangan susun unsur pada tabel periodik.',
    icon: '👑',
    condition: 'Selesaikan tantangan tabel periodik',
  },
  {
    id: 'detective',
    name: 'Detektif Kimia',
    description: 'Menganalisis petunjuk laboratorium dan memecahkan kasus misteri kimia.',
    icon: '🔍',
    condition: 'Pecahkan kasus detektif kimia',
  },
  {
    id: 'lab_star',
    name: 'Laboran Teladan',
    description: 'Menyelesaikan eksperimen kimia virtual di Laboratorium Simulasi.',
    icon: '🧪',
    condition: 'Selesaikan simulasi eksperimen lab',
  },
  {
    id: 'puzzle_solver',
    name: 'Pemecah Teka-Teki',
    description: 'Mengisi kotak teka-teki silang kimia dengan benar.',
    icon: '🧩',
    condition: 'Selesaikan Teka-Teki Silang Kimia',
  },
  {
    id: 'eval_genius',
    name: 'Jenius Evaluasi',
    description: 'Mencapai nilai ketuntasan tinggi (≥ 80) pada evaluasi pembelajaran akhir.',
    icon: '🏆',
    condition: 'Raih nilai ≥ 80 pada Evaluasi Akhir',
  },
  {
    id: 'chembot_friend',
    name: 'Sahabat ChemBot',
    description: 'Berdiskusi dan berkonsultasi materi kimia bersama asisten AI ChemBot.',
    icon: '🤖',
    condition: 'Berinteraksi dengan AI ChemBot',
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-elements',
    title: 'Eksplorasi Perdana',
    description: 'Buka dan amati visualisasi model atom pada 3 unsur kimia di Tabel Periodik.',
    xpReward: 60,
    icon: '⚛️',
    isCompleted: false,
  },
  {
    id: 'mission-simulation',
    title: 'Uji Laboratorium',
    description: 'Jalankan 1 simulasi reaksi kimia di Laboratorium Virtual dan jawab refleksinya.',
    xpReward: 80,
    icon: '🧪',
    isCompleted: false,
  },
  {
    id: 'mission-reaction',
    title: 'Tantangan Reaksi',
    description: 'Prediksi produk dan setarakan 1 persamaan reaksi di Arena Reaksi Unsur.',
    xpReward: 85,
    icon: '⚡',
    isCompleted: false,
  },
  {
    id: 'mission-minigame',
    title: 'Pecahkan Teka-Teki',
    description: 'Mainkan mini-game TTS, Tebak Unsur, atau Pasangan untuk melatih kecepatan.',
    xpReward: 70,
    icon: '🎮',
    isCompleted: false,
  },
  {
    id: 'mission-eval',
    title: 'Evaluasi Pembelajaran',
    description: 'Selesaikan 15 butir soal evaluasi akhir sesuai tingkatan kelasmu.',
    xpReward: 150,
    icon: '📝',
    isCompleted: false,
  },
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progress: number } {
  if (xp < 200) {
    return { level: 1, title: 'Calon Peneliti', nextLevelXp: 200, progress: Math.min(100, Math.round((xp / 200) * 100)) };
  } else if (xp < 500) {
    return { level: 2, title: 'Asisten Laboratorium', nextLevelXp: 500, progress: Math.min(100, Math.round(((xp - 200) / 300) * 100)) };
  } else if (xp < 1000) {
    return { level: 3, title: 'Penjelajah Unsur', nextLevelXp: 1000, progress: Math.min(100, Math.round(((xp - 500) / 500) * 100)) };
  } else if (xp < 1800) {
    return { level: 4, title: 'Ahli Reaksi Kimia', nextLevelXp: 1800, progress: Math.min(100, Math.round(((xp - 1000) / 800) * 100)) };
  } else {
    return { level: 5, title: 'Master Kimiawan SMA', nextLevelXp: 2500, progress: 100 };
  }
}

interface GameContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (name: string, grade: GradeLevel) => void;
  logout: () => void;
  addXP: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeMission: (missionId: string) => void;
  recordSimulationComplete: (simId: string) => void;
  recordMiniGameScore: (gameId: string, score: number) => void;
  recordEvaluation: (score: number, total: number) => void;
  toggleSound: () => void;
  resetProgress: () => void;
  viewedElements: number[];
  markElementViewed: (elementNumber: number) => void;
  recentNotification: string | null;
  clearNotification: () => void;
}

const STORAGE_KEY = 'chemquest_user_v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return null;
  });

  const [viewedElements, setViewedElements] = useState<number[]>([]);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Ignore
      }
    }
  }, [user]);

  const login = (name: string, grade: GradeLevel) => {
    const newUser: UserProfile = {
      name,
      grade,
      xp: 50, // Welcome gift XP
      level: 1,
      badges: [],
      completedMissions: [],
      simulationCompleted: {},
      miniGameScores: {},
      evaluationHistory: [],
      soundEnabled: true,
    };
    setUser(newUser);
    soundManager.playSuccess();
    setRecentNotification(`Selamat datang di ChemQuest, ${name}! Siap berpetualang di dunia kimia? (+50 XP)`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addXP = (amount: number, reason?: string) => {
    if (!user) return;
    const oldLevelInfo = calculateLevel(user.xp);
    const newXp = user.xp + amount;
    const newLevelInfo = calculateLevel(newXp);

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        xp: newXp,
        level: newLevelInfo.level,
      };
    });

    soundManager.playSuccess();

    if (newLevelInfo.level > oldLevelInfo.level) {
      soundManager.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#a855f7', '#10b981'],
        });
      } catch {}
      setRecentNotification(`🎉 NAIK LEVEL! Selamat kamu sekarang ${newLevelInfo.title} (Level ${newLevelInfo.level})!`);
    } else if (reason) {
      setRecentNotification(`+${amount} XP: ${reason}!`);
    }
  };

  const unlockBadge = (badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
    soundManager.playLevelUp();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
    if (badge) {
      setRecentNotification(`🏆 Badge Baru Terbuka: "${badge.name}"!`);
    }
  };

  const completeMission = (missionId: string) => {
    if (!user || user.completedMissions.includes(missionId)) return;
    const mission = INITIAL_MISSIONS.find(m => m.id === missionId);
    const xpReward = mission ? mission.xpReward : 50;

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
      };
    });

    addXP(xpReward, `Misi selesai: ${mission?.title || 'Misi'}`);
  };

  const recordSimulationComplete = (simId: string) => {
    if (!user) return;
    const wasAlreadyDone = !!user.simulationCompleted[simId];
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        simulationCompleted: {
          ...prev.simulationCompleted,
          [simId]: true,
        },
      };
    });

    completeMission('mission-simulation');
    unlockBadge('lab_star');

    if (!wasAlreadyDone) {
      addXP(80, 'Menyelesaikan Simulasi Laboratorium');
    }
  };

  const recordMiniGameScore = (gameId: string, score: number) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        miniGameScores: {
          ...prev.miniGameScores,
          [gameId]: Math.max(prev.miniGameScores[gameId] || 0, score),
        },
      };
    });

    completeMission('mission-minigame');
    if (gameId === 'crossword') unlockBadge('puzzle_solver');
    if (gameId === 'detective') unlockBadge('detective');
    addXP(Math.round(score / 2), `Menyelesaikan Mini Game (${score} poin)`);
  };

  const recordEvaluation = (score: number, total: number) => {
    if (!user) return;
    const newEntry = {
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      score,
      totalQuestions: total,
      grade: user.grade,
    };

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        evaluationHistory: [newEntry, ...prev.evaluationHistory],
      };
    });

    completeMission('mission-eval');
    if (score >= 80) {
      unlockBadge('eval_genius');
    }
    addXP(score * 2, `Hasil Evaluasi Akhir (${score}%)`);
  };

  const toggleSound = () => {
    if (!user) return;
    const nextVal = !user.soundEnabled;
    soundManager.setEnabled(nextVal);
    setUser(prev => prev ? { ...prev, soundEnabled: nextVal } : null);
    if (nextVal) soundManager.playClick();
  };

  const resetProgress = () => {
    if (!user) return;
    const resetUser: UserProfile = {
      name: user.name,
      grade: user.grade,
      xp: 0,
      level: 1,
      badges: [],
      completedMissions: [],
      simulationCompleted: {},
      miniGameScores: {},
      evaluationHistory: [],
      soundEnabled: user.soundEnabled,
    };
    setUser(resetUser);
    setViewedElements([]);
    setRecentNotification('Progres belajar telah di-reset ke awal.');
  };

  const markElementViewed = (elementNumber: number) => {
    if (!viewedElements.includes(elementNumber)) {
      const next = [...viewedElements, elementNumber];
      setViewedElements(next);
      if (next.length >= 3) {
        completeMission('mission-elements');
      }
      if (next.length >= 5) {
        unlockBadge('explorer');
      }
    }
  };

  const clearNotification = () => setRecentNotification(null);

  return (
    <GameContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        addXP,
        unlockBadge,
        completeMission,
        recordSimulationComplete,
        recordMiniGameScore,
        recordEvaluation,
        toggleSound,
        resetProgress,
        viewedElements,
        markElementViewed,
        recentNotification,
        clearNotification,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

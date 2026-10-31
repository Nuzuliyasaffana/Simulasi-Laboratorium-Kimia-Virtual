export type GradeLevel = 'X' | 'XI' | 'XII';

export interface UserProfile {
  name: string;
  grade: GradeLevel;
  xp: number;
  level: number;
  badges: string[];
  completedMissions: string[];
  simulationCompleted: Record<string, boolean>;
  miniGameScores: Record<string, number>;
  evaluationHistory: {
    date: string;
    score: number;
    totalQuestions: number;
    grade: GradeLevel;
  }[];
  soundEnabled: boolean;
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  indonesianName: string;
  atomicMass: number;
  category: ElementCategory;
  period: number;
  group: number;
  state: 'padat' | 'cair' | 'gas';
  electronConfiguration: string;
  shells: number[]; // e.g. [2, 8, 1] for Na
  electronegativity?: number;
  atomicRadius?: number; // pm
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  density?: number; // g/cm³
  oxidationStates?: string;
  discovery?: string;
  uses: string[];
  funFact: string;
  description: string;
}

export type ElementCategory =
  | 'alkali'
  | 'alkali-tanah'
  | 'transisi'
  | 'pasca-transisi'
  | 'metaloid'
  | 'nonlogam'
  | 'halogen'
  | 'gas-mulia'
  | 'lantanida'
  | 'aktinida';

export interface LabSimulation {
  id: string;
  title: string;
  category: string;
  recommendedGrade: GradeLevel[];
  objective: string;
  instructions: string[];
  equation: string;
  explanation: string;
  reflectionQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ReactionChallenge {
  id: string;
  title: string;
  grade: GradeLevel;
  difficulty: 'Pemula' | 'Menengah' | 'Ahli';
  description: string;
  reactionType: 'Sintesis' | 'Dekomposisi' | 'Penggantian Tunggal' | 'Pertukaran Ganda' | 'Redoks';
  reactants: { formula: string; name: string; state: string; coefficient: number }[];
  products: { formula: string; name: string; state: string; coefficient: number }[];
  balancedEquation: string;
  hints: string[];
  explanation: string;
  xpReward: number;
}

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface EvaluationQuestion {
  id: string;
  grade: GradeLevel;
  topic: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'analysis';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  matchingPairs?: { left: string; right: string }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP?: number;
  condition: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isAi?: boolean;
}

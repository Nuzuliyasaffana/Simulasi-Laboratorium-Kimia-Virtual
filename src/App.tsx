/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PeriodicTable } from './components/PeriodicTable/PeriodicTable';
import { VirtualLab } from './components/VirtualLab/VirtualLab';
import { ReactionArena } from './components/ReactionArena/ReactionArena';
import { MiniGamesHub } from './components/MiniGames/MiniGamesHub';
import { FinalEvaluation } from './components/FinalEvaluation/FinalEvaluation';
import { ProfileView } from './components/ProfileView';
import { ChemBotModal } from './components/ChemBot/ChemBotModal';
import { Sparkles, X } from 'lucide-react';

function ChemQuestMain() {
  const { isLoggedIn, recentNotification, clearNotification } = useGame();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isChemBotOpen, setIsChemBotOpen] = useState<boolean>(false);
  const [chemBotTopic, setChemBotTopic] = useState<string | null>(null);

  const handleOpenChemBot = (topic?: string) => {
    if (topic) {
      setChemBotTopic(topic);
    } else {
      setChemBotTopic(null);
    }
    setIsChemBotOpen(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col bg-grid-pattern">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openChemBot={() => handleOpenChemBot()}
      />

      {/* Floating Notification Toast */}
      {recentNotification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-white border border-cyan-400 p-4 shadow-xl shadow-cyan-900/10 flex items-start gap-3 animate-slideIn">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 shrink-0 border border-cyan-200">
            <Sparkles className="w-5 h-5 text-cyan-600 animate-spin [animation-duration:3s]" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-extrabold text-slate-900 mb-0.5">Pemberitahuan ChemQuest</div>
            <div className="text-slate-600 leading-relaxed font-medium">{recentNotification}</div>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            setCurrentTab={setCurrentTab}
            openChemBot={() => handleOpenChemBot()}
          />
        )}

        {currentTab === 'periodic-table' && (
          <PeriodicTable
            onBackToDashboard={() => setCurrentTab('dashboard')}
            openChemBotWithTopic={topic => handleOpenChemBot(topic)}
          />
        )}

        {currentTab === 'virtual-lab' && (
          <VirtualLab
            onBackToDashboard={() => setCurrentTab('dashboard')}
            openChemBotWithTopic={topic => handleOpenChemBot(topic)}
          />
        )}

        {currentTab === 'reaction-arena' && (
          <ReactionArena
            onBackToDashboard={() => setCurrentTab('dashboard')}
            openChemBotWithTopic={topic => handleOpenChemBot(topic)}
          />
        )}

        {currentTab === 'mini-games' && (
          <MiniGamesHub
            onBackToDashboard={() => setCurrentTab('dashboard')}
            openChemBotWithTopic={topic => handleOpenChemBot(topic)}
          />
        )}

        {currentTab === 'evaluation' && (
          <FinalEvaluation
            onBackToDashboard={() => setCurrentTab('dashboard')}
            openChemBotWithTopic={topic => handleOpenChemBot(topic)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView onBackToDashboard={() => setCurrentTab('dashboard')} />
        )}
      </main>

      {/* ChemBot AI Assistant Modal */}
      <ChemBotModal
        isOpen={isChemBotOpen}
        onClose={() => setIsChemBotOpen(false)}
        initialTopic={chemBotTopic}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/90 py-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ChemQuest: Petualangan di Dunia Unsur Kimia • Media Pembelajaran Kimia SMA</span>
          <span className="text-cyan-700 font-semibold">Dilengkapi Laboratorium Virtual & Asisten Belajar AI</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <ChemQuestMain />
    </GameProvider>
  );
}

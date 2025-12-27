
import React, { useState } from 'react';
import { Participant, AppTab } from './types';
import ParticipantInput from './components/ParticipantInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST);

  const handleParticipantsUpdate = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-id-badge text-white text-xl"></i>
              </div>
              <h1 className="text-xl font-bold text-slate-900 hidden sm:block">HR Pro: Draw & Group</h1>
            </div>
            
            <nav className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={() => setActiveTab(AppTab.LIST)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === AppTab.LIST 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <i className="fas fa-list-ul mr-2"></i>
                名單
              </button>
              <button
                onClick={() => setActiveTab(AppTab.LUCKY_DRAW)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === AppTab.LUCKY_DRAW 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <i className="fas fa-trophy mr-2"></i>
                抽籤
              </button>
              <button
                onClick={() => setActiveTab(AppTab.GROUPING)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === AppTab.GROUPING 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <i className="fas fa-users-viewfinder mr-2"></i>
                分組
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {participants.length === 0 && activeTab !== AppTab.LIST ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-users-slash text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">名單目前為空</h3>
            <p className="text-slate-500 mt-2 mb-6">請先到「名單」標籤頁添加參與者</p>
            <button
              onClick={() => setActiveTab(AppTab.LIST)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              去添加名單
            </button>
          </div>
        ) : (
          <>
            {activeTab === AppTab.LIST && (
              <ParticipantInput 
                onParticipantsUpdate={handleParticipantsUpdate} 
                initialList={participants} 
              />
            )}
            {activeTab === AppTab.LUCKY_DRAW && (
              <LuckyDraw participants={participants} />
            )}
            {activeTab === AppTab.GROUPING && (
              <AutoGrouping participants={participants} />
            )}
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
        <p>© 2024 HR Pro Assistant • Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;

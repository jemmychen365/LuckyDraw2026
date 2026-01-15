import React, { useState } from 'react';
import { Users, Gift, UserPlus, Github } from 'lucide-react';
import InputSection from './components/InputSection';
import LotterySection from './components/LotterySection';
import GroupingSection from './components/GroupingSection';
import { Participant, Tab } from './types';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('input');

  const tabs = [
    { id: 'input', label: '名單輸入', icon: UserPlus },
    { id: 'lottery', label: '幸運抽獎', icon: Gift },
    { id: 'grouping', label: '自動分組', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                H
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">HR LuckyDraw & Grouper</h1>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:hidden">HR Tools</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'input' && (
          <InputSection 
            participants={participants} 
            setParticipants={setParticipants} 
            onNext={() => setActiveTab('lottery')}
          />
        )}
        
        {activeTab === 'lottery' && (
            participants.length > 0 ? (
                <LotterySection participants={participants} />
            ) : (
                <EmptyState onRedirect={() => setActiveTab('input')} />
            )
        )}
        
        {activeTab === 'grouping' && (
             participants.length > 0 ? (
                <GroupingSection participants={participants} />
            ) : (
                <EmptyState onRedirect={() => setActiveTab('input')} />
            )
        )}
      </main>
    </div>
  );
};

// Helper for empty states
const EmptyState: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">尚未輸入名單</h3>
        <p className="text-slate-500 mb-6">請先匯入參與者名單才能使用此功能</p>
        <button 
            onClick={onRedirect}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
            前往輸入名單
        </button>
    </div>
);

export default App;

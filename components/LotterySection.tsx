import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCcw, Settings, Sparkles, UserCheck } from 'lucide-react';
import { Participant, LotterySettings } from '../types';

interface LotterySectionProps {
  participants: Participant[];
}

const LotterySection: React.FC<LotterySectionProps> = ({ participants }) => {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayParticipent, setDisplayParticipent] = useState<string>('準備抽獎');
  const [history, setHistory] = useState<Participant[]>([]);
  const [settings, setSettings] = useState<LotterySettings>({ allowRepeats: false });
  
  // Available pool management
  const [remainingPool, setRemainingPool] = useState<Participant[]>(participants);

  // Sync pool when participants change or settings change
  useEffect(() => {
    if (settings.allowRepeats) {
      setRemainingPool(participants);
    } else {
      // Filter out those who already won
      const winnerIds = new Set(history.map(h => h.id));
      setRemainingPool(participants.filter(p => !winnerIds.has(p.id)));
    }
  }, [participants, history, settings.allowRepeats]);

  const handleDraw = () => {
    if (remainingPool.length === 0) {
      alert('名單已抽完！');
      return;
    }

    setIsAnimating(true);
    setWinner(null);

    let count = 0;
    const maxCount = 20; // Number of shuffles before stop
    const speed = 100; // Initial speed

    // Animation Loop
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingPool.length);
      setDisplayParticipent(remainingPool[randomIndex].name);
      count++;
      
      // Stop condition
      if (count > maxCount) {
        clearInterval(interval);
        finalizeDraw();
      }
    }, 80);
  };

  const finalizeDraw = () => {
    const finalIndex = Math.floor(Math.random() * remainingPool.length);
    const selected = remainingPool[finalIndex];
    
    setDisplayParticipent(selected.name);
    setWinner(selected);
    setHistory(prev => [selected, ...prev]);
    setIsAnimating(false);
  };

  const handleReset = () => {
    if(confirm("確定要重置抽獎紀錄嗎？")) {
        setHistory([]);
        setWinner(null);
        setDisplayParticipent("準備抽獎");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">幸運抽獎</h2>
            <p className="text-sm text-slate-500">
              剩餘名額: <span className="font-semibold text-indigo-600">{remainingPool.length}</span> / {participants.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <Settings className="w-4 h-4" />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={settings.allowRepeats}
                        onChange={(e) => setSettings({ ...settings, allowRepeats: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    允許重複中獎
                </label>
            </div>
            <button 
                onClick={handleReset}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="重置紀錄"
            >
                <RefreshCcw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Draw Area */}
        <div className="md:col-span-2 space-y-6">
          <div className={`
            relative overflow-hidden rounded-2xl aspect-video flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl transition-all
            ${isAnimating ? 'scale-[1.01] ring-4 ring-purple-300' : ''}
          `}>
             {/* Decorative Circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-900/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

             <div className="relative z-10 text-center">
                 {winner && !isAnimating && (
                    <div className="animate-bounce mb-2 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold text-sm shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        恭喜中獎！
                    </div>
                 )}
                 <h1 className={`
                    font-bold text-white tracking-tight transition-all duration-100
                    ${isAnimating ? 'text-6xl opacity-80 blur-[1px]' : 'text-7xl drop-shadow-lg'}
                    ${!isAnimating && winner ? 'scale-110' : ''}
                 `}>
                     {displayParticipent}
                 </h1>
             </div>
          </div>

          <button
            onClick={handleDraw}
            disabled={isAnimating || remainingPool.length === 0}
            className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                ${isAnimating || remainingPool.length === 0 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 hover:shadow-indigo-200'}
            `}
          >
            {isAnimating ? '抽取中...' : remainingPool.length === 0 ? '名單已空' : '開始抽獎'}
          </button>
        </div>

        {/* History Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px] md:h-auto overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-500" />
                    中獎紀錄
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                        <p>尚無中獎者</p>
                    </div>
                ) : (
                    history.map((p, index) => (
                        <div key={`${p.id}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 shadow-sm animate-slide-in">
                            <span className="font-semibold text-slate-700">{p.name}</span>
                            <span className="text-xs font-mono text-slate-400">#{history.length - index}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LotterySection;

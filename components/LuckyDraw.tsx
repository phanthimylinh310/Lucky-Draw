
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { generateCongratulation } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [shuffledName, setShuffledName] = useState<string>('???');
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  const [remainingPool, setRemainingPool] = useState<Participant[]>([...participants]);
  const [congratsMsg, setCongratsMsg] = useState<string>('');
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingPool([...participants]);
    setWinner(null);
    setWinnersHistory([]);
    setCongratsMsg('');
  }, [participants]);

  const startDraw = async () => {
    if (isDrawing) return;
    
    const pool = allowRepeat ? participants : remainingPool;
    if (pool.length === 0) {
      alert('名單已抽完！請重置或切換為可重複抽取。');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    setCongratsMsg('');
    
    let iterations = 0;
    const maxIterations = 20;
    const interval = 100;

    const animate = () => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setShuffledName(pool[randomIndex].name);
      
      iterations++;
      if (iterations < maxIterations) {
        timerRef.current = window.setTimeout(animate, interval);
      } else {
        const finalWinner = pool[Math.floor(Math.random() * pool.length)];
        setWinner(finalWinner);
        setWinnersHistory(prev => [finalWinner, ...prev]);
        
        if (!allowRepeat) {
          setRemainingPool(prev => prev.filter(p => p.id !== finalWinner.id));
        }
        
        setIsDrawing(false);
        handleGeminiCongrats(finalWinner.name);
      }
    };

    animate();
  };

  const handleGeminiCongrats = async (name: string) => {
    const msg = await generateCongratulation(name);
    setCongratsMsg(msg);
  };

  const resetDraw = () => {
    setRemainingPool([...participants]);
    setWinner(null);
    setWinnersHistory([]);
    setShuffledName('???');
    setCongratsMsg('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8">幸運大抽獎</h2>
          
          <div className={`text-6xl md:text-8xl font-black transition-all duration-300 ${isDrawing ? 'scale-110 text-indigo-600' : 'text-slate-900'}`}>
            {isDrawing ? shuffledName : (winner ? winner.name : '等待開始')}
          </div>

          {winner && !isDrawing && congratsMsg && (
            <div className="mt-6 bg-yellow-50 text-yellow-800 px-6 py-3 rounded-full animate-bounce border border-yellow-200 font-medium">
              <i className="fas fa-gift mr-2"></i>
              {congratsMsg}
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={startDraw}
              disabled={isDrawing || participants.length === 0}
              className={`px-10 py-4 rounded-xl font-bold text-xl shadow-lg transition-all ${
                isDrawing || participants.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-1'
              }`}
            >
              {isDrawing ? '抽獎中...' : '開始抽獎'}
            </button>
            <button
              onClick={resetDraw}
              className="px-6 py-4 rounded-xl font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              重置
            </button>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={allowRepeat}
                onChange={(e) => setAllowRepeat(e.target.checked)}
              />
              <span className="ml-2 text-slate-700 font-medium">允許重複中獎</span>
            </label>
            <div className="text-sm text-slate-500">
              當前獎池人數: <span className="font-bold text-indigo-600">{allowRepeat ? participants.length : remainingPool.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 bg-white border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-history text-indigo-500"></i>
          中獎記錄 ({winnersHistory.length})
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {winnersHistory.length === 0 ? (
            <div className="text-center text-slate-400 py-10 italic">尚無中獎記錄</div>
          ) : (
            winnersHistory.map((w, i) => (
              <div key={`${w.id}-${i}`} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-slate-100 animate-fadeIn">
                <span className="font-semibold text-slate-700">{w.name}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  #{winnersHistory.length - i}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;

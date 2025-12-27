
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const AutoGrouping: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAINames, setUseAINames] = useState(true);

  const performGrouping = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    // Shuffle participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    // Create chunks
    const numGroups = Math.ceil(shuffled.length / groupSize);
    const newGroups: Group[] = [];

    // Optional AI team names
    let teamNames: string[] = [];
    if (useAINames) {
      teamNames = await generateTeamNames(numGroups);
    }

    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: teamNames[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "組別,姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">分組設定</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">每組人數</label>
            <input 
              type="number" 
              min="1" 
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-32 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <input 
              id="ai-names"
              type="checkbox" 
              checked={useAINames}
              onChange={(e) => setUseAINames(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="ai-names" className="text-slate-700 cursor-pointer">
              使用 AI 生成創意隊名
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={performGrouping}
              disabled={isGenerating || participants.length === 0}
              className={`px-8 py-2 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 ${
                isGenerating || participants.length === 0
                  ? 'bg-slate-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-layer-group"></i>}
              {isGenerating ? '生成中...' : '開始自動分組'}
            </button>
            
            {groups.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-all shadow-md flex items-center gap-2"
              >
                <i className="fas fa-file-download"></i>
                下載分組 CSV
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          * 總人數 {participants.length} 人，預計分為 {Math.ceil(participants.length / groupSize)} 組。
        </p>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fadeIn">
          {groups.map((group) => (
            <div key={group.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden transform hover:scale-[1.02] transition-transform group">
              <div className="bg-indigo-500 px-4 py-3 group-hover:bg-indigo-600 transition-colors">
                <h3 className="text-white font-bold truncate">{group.name}</h3>
              </div>
              <div className="p-4 bg-white">
                <ul className="space-y-2">
                  {group.members.map((member, idx) => (
                    <li key={member.id} className="flex items-center gap-3 text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-400 text-right">
                組員人數: {group.members.length}
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && participants.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <i className="fas fa-users text-4xl mb-4"></i>
          <p>點擊上方按鈕開始自動分組</p>
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;

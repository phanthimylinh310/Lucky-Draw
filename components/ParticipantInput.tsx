
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface Props {
  onParticipantsUpdate: (list: Participant[]) => void;
  initialList: Participant[];
}

const ParticipantInput: React.FC<Props> = ({ onParticipantsUpdate, initialList }) => {
  const [textInput, setTextInput] = useState(initialList.map(p => p.name).join('\n'));

  const mockNames = [
    "陳小明", "林美玲", "張大強", "李曉芬", "王家豪", "吳淑芬", 
    "劉得華", "蔡依林", "周杰倫", "郭雪芙", "許光漢", "柯佳嬿"
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);
    const names = text.split('\n').map(n => n.trim()).filter(n => n !== '');
    const newList = names.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));
    onParticipantsUpdate(newList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content
        .split(/\r?\n/)
        .map(line => line.split(',')[0].trim())
        .filter(n => n !== '' && n.toLowerCase() !== 'name');

      const newList = names.map((name, index) => ({
        id: `${Date.now()}-${index}`,
        name
      }));
      setTextInput(names.join('\n'));
      onParticipantsUpdate(newList);
    };
    reader.readAsText(file);
  };

  const generateMockData = () => {
    const names = mockNames.join('\n');
    setTextInput(names);
    const newList = mockNames.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));
    onParticipantsUpdate(newList);
  };

  const removeDuplicates = () => {
    const names = textInput.split('\n').map(n => n.trim()).filter(n => n !== '');
    const uniqueNames = Array.from(new Set(names));
    const newText = uniqueNames.join('\n');
    setTextInput(newText);
    
    const newList = uniqueNames.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));
    onParticipantsUpdate(newList);
  };

  const duplicateCount = useMemo(() => {
    const names = textInput.split('\n').map(n => n.trim()).filter(n => n !== '');
    const unique = new Set(names);
    return names.length - unique.size;
  }, [textInput]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">名單管理</h2>
          <p className="text-sm text-slate-500">上傳 CSV 文件、貼上姓名名單，或生成模擬數據</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateMockData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 font-medium text-sm"
          >
            <i className="fas fa-magic"></i>
            <span>生成模擬名單</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors border border-indigo-200 font-medium text-sm">
            <i className="fas fa-file-upload"></i>
            <span>上傳 CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea
          className={`w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm resize-none transition-colors ${
            duplicateCount > 0 ? 'border-orange-300 bg-orange-50/10' : 'border-slate-200'
          }`}
          placeholder="例如：&#10;王小明&#10;李大華&#10;張三..."
          value={textInput}
          onChange={handleTextChange}
        />
        
        {duplicateCount > 0 && (
          <div className="absolute top-4 right-4 animate-fadeIn">
            <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200 shadow-sm">
              <i className="fas fa-exclamation-triangle"></i>
              <span>發現 {duplicateCount} 個重複姓名</span>
              <button 
                onClick={removeDuplicates}
                className="ml-2 bg-orange-600 text-white px-2 py-0.5 rounded hover:bg-orange-700 transition-colors"
              >
                移除重複
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-indigo-600">
            總計人數: {initialList.length} 人
          </span>
          {duplicateCount > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              (含重複項)
            </span>
          )}
        </div>
        <button 
          onClick={() => { setTextInput(''); onParticipantsUpdate([]); }}
          className="text-xs text-red-500 hover:text-red-700 underline"
        >
          清空所有名單
        </button>
      </div>
    </div>
  );
};

export default ParticipantInput;

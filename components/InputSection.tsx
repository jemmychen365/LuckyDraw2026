import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, UserPlus, Trash2, Users, Wand2, AlertCircle, CopyX } from 'lucide-react';
import { Participant } from '../types';
import { generateId } from '../utils/random';

interface InputSectionProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
  onNext: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ participants, setParticipants, onNext }) => {
  const [inputText, setInputText] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze duplicates
  const { nameCounts, hasDuplicates } = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    const hasDupes = Object.values(counts).some(c => c > 1);
    return { nameCounts: counts, hasDuplicates: hasDupes };
  }, [participants]);

  const handleAddText = () => {
    if (!inputText.trim()) return;

    const names = inputText
      .split(/[\n,]+/) // Split by newlines or commas
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const newParticipants = names.map(name => ({
      id: generateId(),
      name
    }));

    setParticipants([...participants, ...newParticipants]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      let text = '';

      // Try decoding as UTF-8 first
      try {
        const decoder = new TextDecoder('utf-8', { fatal: true });
        text = decoder.decode(buffer);
      } catch (e) {
        // If UTF-8 fails (likely Big5/CP950 from Excel on Traditional Chinese Windows), try Big5
        try {
          const decoder = new TextDecoder('big5');
          text = decoder.decode(buffer);
        } catch (e2) {
          alert('無法辨識檔案編碼，請確認檔案為 UTF-8 或 Big5 格式');
          return;
        }
      }

      const names = text
        .split(/[\n\r]+/)
        .map(n => n.split(',')[0].trim()) // Assume first column if CSV
        .filter(n => n.length > 0);

      const newParticipants = names.map(name => ({
        id: generateId(),
        name
      }));

      setParticipants([...participants, ...newParticipants]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClear = () => {
    if (confirmClear) {
      setParticipants([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleLoadDemoData = () => {
    const demoNames = [
      "王小明", "李大華", "張美麗", "陳志豪", "林怡君",
      "陳建國", "吳雅婷", "楊宗緯", "蔡依林", "周杰倫",
      "張惠妹", "林俊傑", "田馥甄", "蕭敬騰", "鄧紫棋",
      "五月天", "孫燕姿", "梁靜茹", "陳奕迅", "王力宏",
      "劉德華", "張學友", "郭富城", "黎明", "金城武"
    ];

    // Add randomness to demo data creation so IDs are unique
    const newParticipants = demoNames.map(name => ({
      id: generateId(),
      name
    }));

    setParticipants([...participants, ...newParticipants]);
  };

  const handleRemoveDuplicates = () => {
    const uniqueNames = new Set();
    const uniqueParticipants: Participant[] = [];

    participants.forEach(p => {
      if (!uniqueNames.has(p.name)) {
        uniqueNames.add(p.name);
        uniqueParticipants.push(p);
      }
    });

    setParticipants(uniqueParticipants);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">匯入名單</h2>
        <p className="text-slate-500">輸入姓名、上傳 CSV 檔案，或使用範例資料</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Input */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">文字輸入</h3>
            </div>
            <button
              onClick={handleLoadDemoData}
              className="text-xs flex items-center gap-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
              title="自動填入測試用名單"
            >
              <Wand2 className="w-3 h-3" />
              載入範例
            </button>
          </div>
          <textarea
            className="w-full h-40 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400"
            placeholder="請貼上姓名，一行一個..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddText}
            disabled={!inputText.trim()}
            className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            加入名單
          </button>
        </div>

        {/* CSV Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <Upload className="w-5 h-5" />
            <h3 className="font-semibold">CSV 上傳</h3>
          </div>
          <div
            className="flex-1 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 mb-3 text-slate-400" />
            <p className="text-sm font-medium">點擊上傳 CSV 檔案</p>
            <p className="text-xs text-slate-400 mt-1">支援 .csv 格式 (每行一個姓名)</p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* List Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            <span className="font-semibold text-slate-700">目前名單 ({participants.length} 人)</span>
          </div>

          <div className="flex items-center gap-2">
            {hasDuplicates && (
              <button
                onClick={handleRemoveDuplicates}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-md bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
              >
                <CopyX className="w-4 h-4" />
                移除重複
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={handleClear}
                className={`text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${confirmClear
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                  }`}
              >
                <Trash2 className="w-4 h-4" />
                {confirmClear ? '確認清空?' : '清空'}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 max-h-60 overflow-y-auto bg-slate-50/50">
          {participants.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              尚無資料，請由上方新增
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => {
                const isDuplicate = nameCounts[p.name] > 1;
                return (
                  <span
                    key={p.id}
                    className={`
                            inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border shadow-sm transition-all
                            ${isDuplicate
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-white border-slate-200 text-slate-700'}
                        `}
                  >
                    {isDuplicate && <AlertCircle className="w-3 h-3" />}
                    {p.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {participants.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="py-3 px-8 bg-slate-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            開始使用功能
          </button>
        </div>
      )}
    </div>
  );
};

export default InputSection;

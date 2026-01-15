import React, { useState, useEffect } from 'react';
import { Users, Shuffle, Layers, Download } from 'lucide-react';
import { Participant, Group } from '../types';
import { shuffleArray, chunkArray } from '../utils/random';

interface GroupingSectionProps {
  participants: Participant[];
}

const GroupingSection: React.FC<GroupingSectionProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateGroups = () => {
    if (participants.length === 0) return;

    // Logic: Shuffle then Chunk
    const shuffled = shuffleArray([...participants]);
    const chunks = chunkArray(shuffled, groupSize);

    // If the last group is too small (e.g., 1 person), standard HR logic might be to distribute them to other groups.
    // For this simple version, we will just keep the chunks as is, but you could implement "distribute remainder" logic here.
    
    const generatedGroups: Group[] = chunks.map((members, index) => ({
      id: index + 1,
      members
    }));

    setGroups(generatedGroups);
    setIsGenerated(true);
  };

  const handleDownloadCSV = () => {
    if (groups.length === 0) return;

    // CSV Header
    let csvContent = "組別,姓名\n";

    // CSV Body
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `第 ${group.id} 組,${member.name}\n`;
      });
    });

    // Add BOM for UTF-8 compatibility in Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset if participants change
  useEffect(() => {
    setIsGenerated(false);
    setGroups([]);
  }, [participants]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-7 h-7 text-indigo-500" />
              自動分組
            </h2>
            <p className="text-slate-500">總人數: {participants.length} 人</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-full sm:w-auto">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600 whitespace-nowrap font-medium">每組人數:</span>
                <input 
                    type="number" 
                    min="1"
                    max={participants.length}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-white border border-slate-300 rounded-md px-2 py-1 text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>

             <div className="flex gap-2 w-full sm:w-auto">
                {isGenerated && (
                    <button
                        onClick={handleDownloadCSV}
                        className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        title="下載 CSV"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">下載</span>
                    </button>
                )}
                
                <button
                    onClick={handleGenerateGroups}
                    disabled={participants.length === 0}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Shuffle className="w-4 h-4" />
                    開始分組
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {isGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up">
            {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-700">第 {group.id} 組</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                            {group.members.length} 人
                        </span>
                    </div>
                    <ul className="p-4 space-y-2">
                        {group.members.map(member => (
                            <li key={member.id} className="flex items-center gap-2 text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                {member.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      )}

      {!isGenerated && participants.length > 0 && (
          <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>設定每組人數並點擊「開始分組」</p>
          </div>
      )}
    </div>
  );
};

export default GroupingSection;

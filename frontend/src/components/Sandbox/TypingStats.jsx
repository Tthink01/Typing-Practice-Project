import React from 'react';
import { RefreshCw } from 'lucide-react';

const TypingStats = ({ wordCount, totalWords, onReset }) => {
  return (
    <div className="flex justify-between items-center mb-8 text-stone-400">
      <div className="flex gap-6 text-sm font-medium">
        <div>
          Mode: <span className="text-orange-500">Speed Test</span>
        </div>
        <div>
          Words: <span className="text-stone-200">{wordCount} / {totalWords}</span>
        </div>
      </div>
      
      {/* ปุ่ม Refresh */}
      <button 
        onClick={onReset}
        className="p-2 hover:bg-stone-800 rounded-lg text-stone-500 hover:text-orange-400 transition-all active:rotate-180 duration-500"
        title="รีเซ็ตคำใหม่"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
};

export default TypingStats;
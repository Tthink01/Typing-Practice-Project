import React from 'react';
import { ArrowRight } from 'lucide-react';

const DrillHeader = ({ onBack, type, levelId, language }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors group">
        <div className="p-2 rounded-full bg-stone-800/80 border border-orange-500/30 group-hover:border-orange-500/60 transition-all">
            <ArrowRight className="rotate-180" size={20}/>
        </div>
        <span className="font-bold text-lg" style={{ fontFamily: "'Itim', cursive" }}>กลับไปหน้าหลัก</span>
      </button>
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 rounded-full bg-stone-800 text-stone-400 text-sm font-bold border border-stone-700 shadow-md">
            {type === 'basic' ? 'Basic' : 'Pro'} Level {levelId} ({language})
        </div>
      </div>
    </div>
  );
};

export default DrillHeader;
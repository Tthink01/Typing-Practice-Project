import React from 'react';
import { Lock, Play } from 'lucide-react';

const LevelButton = ({ item, unlocked, count, onSelect, themeStyles, PASS_TARGET = 3 }) => {
  return (
    <button 
      disabled={!unlocked}
      onClick={() => unlocked && onSelect(item.id)}
      className={`w-full py-4 rounded-2xl flex items-center justify-between relative transition-all duration-300 border-2 px-6 
        ${unlocked 
          ? `${themeStyles.bg} border-transparent ${themeStyles.text} ${themeStyles.shadow} cursor-pointer shadow-lg hover:scale-[1.02]` 
          : 'bg-stone-800/50 border-stone-700/50 cursor-not-allowed opacity-70'
        }`}
    >
      <div className="flex flex-col items-start text-left">
        <span className={`text-2xl font-bold ${unlocked ? themeStyles.text : 'text-stone-500'}`} style={{ fontFamily: "'Itim', cursive" }}>{item.title}</span>
        {item.sub && <span className={`text-xs ${unlocked ? 'opacity-80' : 'opacity-50'} ${unlocked ? themeStyles.text : 'text-stone-500'}`}>{item.sub}</span>}
      </div>
      
      <div className="flex items-center gap-3">
        {unlocked && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900/20 ${themeStyles.text}`}>
              {count >= PASS_TARGET ? 'Passed' : `${count}/${PASS_TARGET}`}
          </span>
        )}
        {unlocked 
          ? <div className={themeStyles.text}><Play size={24} fill="currentColor" strokeWidth={2.5} /></div> 
          : <div className="bg-stone-900/80 p-2 rounded-full border border-stone-700"><Lock size={20} className="text-stone-400" /></div>
        }
      </div>
    </button>
  );
};

export default LevelButton;
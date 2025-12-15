import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

const SummaryPopup = ({ stats, onNext }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm animate-in fade-in duration-200"></div>
    
    {/* Card */}
    <div className="relative bg-stone-900 border border-lime-500/30 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl animate-scale-up">
      <div className="w-16 h-16 bg-lime-500/20 text-lime-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-lime-500/40">
        <CheckCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-6">ทดสอบเสร็จสิ้น!</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
          <div className="text-3xl font-bold text-orange-400">{stats.wpm}</div>
          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">WPM</div>
        </div>
        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
          <div className="text-3xl font-bold text-lime-400">{stats.accuracy}%</div>
          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Accuracy</div>
        </div>
      </div>

      <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 mb-6 text-left text-sm space-y-2">
        <div className="flex justify-between border-b border-stone-700/50 pb-2">
          <span className="text-stone-400">⚡ เร็วที่สุด:</span> <span className="text-white font-mono">{stats.fastestKey}</span>
        </div>
        <div className="flex justify-between border-b border-stone-700/50 pb-2">
          <span className="text-stone-400">🐢 ช้าที่สุด:</span> <span className="text-white font-mono">{stats.slowestKey}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-stone-400">❌ คำที่ผิดบ่อย: </span>
          <span className="text-red-400 font-mono truncate max-w-[150px] text-right">
            {stats.wrongKeys.length > 0 ? stats.wrongKeys.slice(0, 3).join(', ') : '-'}
          </span>
        </div>
      </div>

      <button 
        onClick={onNext} 
        className="w-full py-3.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-bold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
      >
        <RefreshCw size={20} /> เล่นอีกครั้ง
      </button>
    </div>
  </div>
);

export default SummaryPopup;
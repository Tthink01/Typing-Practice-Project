import React from "react";
import { ChevronLeft, RefreshCw, Clock } from "lucide-react";

const GameInfo = ({ 
  mode, levelId, onBack, 
  passedCount, passTarget, 
  timeLeft, onReset 
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-orange-500 transition-colors">
          <div className="p-2 rounded-full bg-stone-900 border border-stone-800 hover:border-orange-500/50">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold">กลับหน้าหลัก</span>
        </button>
        <div className="bg-stone-900 px-4 py-1 rounded-full border border-stone-800 text-stone-400 text-sm font-bold">
          {mode === "basic" ? "Basic" : "Pro"} Level {levelId}
        </div>
      </div>

      {/* Stats Bar (Passed & Timer) */}
      <div className="flex items-center gap-6 mb-10 pb-6 border-b border-stone-800/50">
        <div className="flex items-center gap-2 text-stone-400 font-mono">
          <span>Passed:</span>
          <span className={`text-xl font-bold ${passedCount >= passTarget ? "text-green-500" : "text-orange-500"}`}>
            {passedCount}/{passTarget}
          </span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border ${timeLeft <= 5 ? "bg-red-900/20 border-red-500/50 text-red-400 animate-pulse" : "bg-stone-800 border-stone-700 text-stone-300"}`}>
          <Clock size={16} />
          <span className="font-mono text-lg tracking-widest">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
        <button onClick={onReset} className="ml-auto p-2 text-stone-600 hover:text-stone-300 transition-colors" title="เริ่มใหม่">
          <RefreshCw size={20} />
        </button>
      </div>
    </>
  );
};

export default GameInfo;
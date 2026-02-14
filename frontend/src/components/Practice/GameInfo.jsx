import React from "react";
import { ChevronLeft, RefreshCw, Clock } from "lucide-react";

const GameInfo = ({ 
  mode, 
  levelId, 
  onBack, 
  passedCount, 
  passTarget, 
  timeLeft, 
  onRetry // ✅ 1. แก้ชื่อตรงนี้จาก onReset เป็น onRetry (ให้ตรงกับไฟล์แม่)
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 dark:text-stone-500 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">
          <div className="p-2 rounded-full bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 hover:border-orange-500/50 transition-colors shadow-sm">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold">กลับหน้าหลัก</span>
        </button>
        <div className="bg-white dark:bg-stone-900 px-4 py-1 rounded-full border border-gray-200 dark:border-stone-800 text-gray-500 dark:text-stone-400 text-sm font-bold shadow-sm">
          {mode === "basic" ? "Basic" : "Pro"} Level {levelId}
        </div>
      </div>

      {/* Stats Bar (Passed & Timer) */}
      <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-200 dark:border-stone-800">
        <div className="flex items-center gap-2 text-gray-500 dark:text-stone-400 font-mono">
          <span>Passed:</span>
          <span className={`text-xl font-bold ${passedCount >= passTarget ? "text-green-600 dark:text-green-500" : "text-orange-600 dark:text-orange-500"}`}>
            {passedCount}/{passTarget}
          </span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border ${timeLeft <= 5 ? "bg-red-100 dark:bg-red-900/20 border-red-500/50 text-red-500 dark:text-red-400 animate-pulse" : "bg-gray-100 dark:bg-stone-800 border-gray-200 dark:border-stone-700 text-gray-700 dark:text-stone-300"}`}>
          <Clock size={16} />
          <span className="font-mono text-lg tracking-widest">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
        
        {/* ✅ 2. และแก้ตรง onClick นี้ด้วยครับ */}
        <button 
            onClick={onRetry} 
            className="ml-auto p-2 text-gray-400 dark:text-stone-600 hover:text-orange-500 dark:hover:text-orange-500 transition-colors" 
            title="เริ่มใหม่"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </>
  );
};

export default GameInfo;
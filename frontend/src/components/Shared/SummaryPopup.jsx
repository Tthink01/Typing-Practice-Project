import React from 'react';
import { Trophy, Activity, AlertCircle, Zap, Clock, Home, RotateCcw } from 'lucide-react';

const SummaryPopup = ({ stats, onRetry, onHome }) => {
  // 1. ฟังก์ชันคำนวณระดับความเร็ว (Rank)
  const getRank = (wpm) => {
    if (wpm >= 100) return { text: "พระเจ้า (Godlike)", color: "text-amber-400" };
    if (wpm >= 80) return { text: "ปีศาจ (Insane)", color: "text-red-400" };
    if (wpm >= 60) return { text: "มือโปร (Professional)", color: "text-purple-400" };
    if (wpm >= 40) return { text: "ใช้ได้เลย (Intermediate)", color: "text-lime-400" };
    return { text: "มือใหม่ฝึกหัด (Beginner)", color: "text-stone-400" };
  };

  const rank = getRank(stats.wpm);

  // 2. Mock Data: ข้อมูลจำลองสำหรับ UI (เนื่องจาก Logic เก่ายังไม่ได้ส่ง array เวลามา)
  // ถ้าในอนาคตคุณทำ Logic จับเวลาแต่ละปุ่มแล้ว ให้ส่งเข้ามาใน stats.fastestKeys ได้เลย
  const fastestKeys = stats.fastestKeys || [
    { char: stats.fastestKey || "-", time: "---", percent: 100 },
    // ข้อมูลสมมติเพื่อให้ UI ไม่โล่ง
    { char: "ก", time: "---", percent: 80 },
    { char: "ด", time: "---", percent: 60 },
  ];
  
  const slowestKeys = stats.slowestKeys || [
    { char: stats.slowestKey || "-", time: "---", percent: 100 },
    // ข้อมูลสมมติ
    { char: "ห", time: "---", percent: 80 },
    { char: "ฟ", time: "---", percent: 50 },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-sm animate-in fade-in duration-300"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl flex flex-col gap-6 animate-scale-up font-sans">
        
        {/* Header Text */}
        <h1 className="text-center text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 drop-shadow-lg" style={{ fontFamily: "'Itim', cursive" }}>
          ความเร็วไม่ใช่ทุกอย่าง ความพยายามต่างหากที่สำคัญ สู้ต่อ!
        </h1>

        {/* --- ส่วนบน: การ์ดใหญ่ 2 ใบ (WPM / Accuracy) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WPM Card */}
          <div className="relative bg-stone-900/50 border border-amber-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <Trophy size={48} className="text-amber-400 mb-2" />
            <span className="text-7xl md:text-8xl font-bold text-white tracking-tighter">{stats.wpm}</span>
            <span className="text-amber-200/60 text-sm md:text-lg uppercase tracking-widest font-bold">WPM (คำ/นาที)</span>
            <div className="mt-4 px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <span className="text-stone-400 text-sm">ระดับความเร็ว: </span>
              <span className={`font-bold ${rank.color}`}>{rank.text}</span>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="relative bg-stone-900/50 border border-lime-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(132,204,22,0.1)]">
            <Activity size={48} className="text-lime-400 mb-2" />
            <div className="flex items-baseline">
              <span className="text-7xl md:text-8xl font-bold text-white tracking-tighter">{stats.accuracy}</span>
              <span className="text-3xl md:text-4xl text-lime-500 ml-1">%</span>
            </div>
            <span className="text-lime-200/60 text-sm md:text-lg uppercase tracking-widest font-bold">ACCURACY (ความแม่นยำ)</span>
            {/* Progress Bar */}
            <div className="w-full max-w-[200px] h-2 bg-stone-800 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)] transition-all duration-1000" 
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* --- ส่วนล่าง: การ์ดรายละเอียด 3 ใบ --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* 1. ตัวอักษรที่กดผิด */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <AlertCircle size={20} />
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Itim', cursive" }}>ตัวอักษรที่กดผิด</h3>
            </div>
            <div className="flex flex-wrap gap-2 content-start h-[120px] overflow-y-auto custom-scrollbar">
              {stats.wrongKeys && stats.wrongKeys.length > 0 ? (
                // กรองเฉพาะตัวอักษรที่ไม่ซ้ำ หรือแสดงทั้งหมดตาม logic ที่ต้องการ
                Array.from(new Set(stats.wrongKeys.map(k => k.split(' ')[0]))).map((char, idx) => (
                    <div key={idx} className="w-10 h-10 flex items-center justify-center bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 font-bold text-xl shadow-inner">
                      {char}
                    </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600 italic">
                  ไม่มีที่ผิดเลย เยี่ยม!
                </div>
              )}
            </div>
          </div>

          {/* 2. ปุ่มที่กดเร็วที่สุด */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-lime-400">
              <Zap size={20} />
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Itim', cursive" }}>ปุ่มที่กดเร็วที่สุด</h3>
            </div>
            <div className="space-y-3">
              {fastestKeys.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="text-stone-500 text-xs font-mono">#{i+1}</div>
                   <div className="w-8 h-8 flex items-center justify-center bg-lime-900/20 border border-lime-500/30 rounded text-lime-400 font-bold">
                     {item.char}
                   </div>
                   <div className="flex-1">
                     <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                       <div className="h-full bg-lime-500 rounded-full" style={{ width: `${item.percent}%` }}></div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. ปุ่มที่ต้องปรับปรุง */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Clock size={20} />
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Itim', cursive" }}>ปุ่มที่ต้องปรับปรุง</h3>
            </div>
            <div className="space-y-3">
               {slowestKeys.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="text-stone-500 text-xs font-mono">#{i+1}</div>
                   <div className="w-8 h-8 flex items-center justify-center bg-orange-900/20 border border-orange-500/30 rounded text-orange-400 font-bold">
                     {item.char}
                   </div>
                   <div className="flex-1">
                     <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500 rounded-full" style={{ width: `${item.percent}%` }}></div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-center gap-4 mt-2">
          <button 
            onClick={onHome}
            className="flex items-center gap-2 px-6 md:px-8 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-full border border-stone-600 hover:border-amber-500/50 transition-all hover:scale-105"
          >
            <Home size={20} /> เมนูหลัก
          </button>
          
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-400 text-stone-950 font-bold rounded-full shadow-lg shadow-lime-900/20 transition-all hover:scale-105"
          >
            <RotateCcw size={20} /> เล่นอีกครั้ง
          </button>
        </div>

      </div>
    </div>
  );
};

export default SummaryPopup;
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Activity, AlertCircle, Zap, Clock, RotateCcw, Home, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SummaryPopup = ({ 
  stats = {
    wpm: 125,
    accuracy: 0,
    wrongKeys: ["า", "ก", "เ", "ส", "ง", "ห", "ด", "ว", "่"], 
    fastestKeys: [
      { key: "ฟ", speed: 93 },
      { key: "ก", speed: 141 },
      { key: "ห", speed: 161 },
    ],
    slowestKeys: [
      { key: "ห", speed: 161 },
      { key: "ก", speed: 141 },
      { key: "ฟ", speed: 93 },
    ]
  },
  onNext, 
  onHome 
}) => {
  const navigate = useNavigate();

  const handleHome = () => {
    if (onHome) onHome();
    else navigate("/");
  };

  // Helper function to calculate bar width based on speed (max ~200ms usually)
  const getBarWidth = (speed) => {
    // Inverse logic: faster (lower ms) = longer bar? 
    // Or direct logic: In typing stats, usually we visual 'performance'.
    // For Fastest: shorter time is better. Let's maximize bar for short time.
    // For Slowest: longer time is worse. Let's maximize bar for long time.
    return Math.min(Math.max((speed / 200) * 100, 10), 100) + "%";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 font-sans backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl flex flex-col gap-6 relative z-10 py-8"
      >
        
        {/* --- Header Text --- */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-tight">
            ความเร็วไม่ใช่ทุกอย่าง ความพยายามต่างหากที่สำคัญ สู้ต่อ!
          </h2>
        </div>

        {/* --- Top Row: Big Stats (WPM & Accuracy) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WPM Card */}
          <div className="relative group h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center justify-center h-full">
              <Trophy className="text-yellow-400 w-12 h-12 mb-3 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <div className="text-7xl font-mono font-bold text-white mb-2 tracking-tighter drop-shadow-lg">
                {stats.wpm}
              </div>
              <div className="text-yellow-200/80 text-sm font-bold uppercase tracking-widest mb-3">
                WPM (คำ/นาที)
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                ระดับความเร็ว: <span className="text-yellow-400 font-bold">พระเจ้า</span>
              </div>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="relative group h-[220px]">
             <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
             <div className="relative bg-black/40 backdrop-blur-xl border border-lime-500/30 rounded-2xl p-6 flex flex-col items-center justify-center h-full">
               <Activity className="text-lime-400 w-12 h-12 mb-3 filter drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
               <div className="flex items-baseline gap-1 mb-2">
                 <div className="text-7xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
                   {stats.accuracy}
                 </div>
                 <div className="text-4xl font-bold text-lime-400/80">%</div>
               </div>
               <div className="text-lime-200/80 text-sm font-bold uppercase tracking-widest mb-6">
                 ACCURACY (ความแม่นยำ)
               </div>
               {/* Accuracy Bar */}
               <div className="w-[60%] h-1.5 bg-gray-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-lime-400 rounded-full shadow-[0_0_10px_#a3e635]" 
                   style={{ width: `${stats.accuracy}%` }}
                 />
               </div>
             </div>
          </div>

        </div>

        {/* --- Bottom Row: Details (3 Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Wrong Keys (Red/Orange Theme) */}
          <div className="bg-[#0f1014]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 h-[280px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold text-lg">
               <AlertCircle size={20} />
               <span>ตัวอักษรที่กดผิด</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {stats.wrongKeys.length > 0 ? (
                 <div className="grid grid-cols-5 gap-2">
                   {stats.wrongKeys.map((char, i) => (
                     <div key={i} className="aspect-square flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-400 text-xl font-mono rounded-lg shadow-[0_0_10px_rgba(220,38,38,0.1)]">
                       {char}
                     </div>
                   ))}
                 </div>
              ) : (
                 <div className="h-full flex items-center justify-center text-gray-500 italic">ไม่มีคำผิด เยี่ยมมาก!</div>
              )}
            </div>
          </div>

          {/* 2. Fastest Keys (Lime Theme) */}
          <div className="bg-[#0f1014]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 h-[280px] flex flex-col">
             <div className="flex items-center gap-2 mb-4 text-lime-400 font-bold text-lg">
                <Zap size={20} />
                <span>ปุ่มที่กดเร็วที่สุด</span>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {stats.fastestKeys.map((item, index) => (
                   <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs font-mono w-4">#{index + 1}</span>
                      <div className="w-8 h-8 flex items-center justify-center bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded text-sm font-bold">
                         {item.key}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <div className="flex justify-between text-xs text-white/80 mb-1 font-mono">
                            <span>{item.speed}ms</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            {/* Short time = High bar (inverse for visual representation of 'speed') or direct. 
                                In the image, 93ms is full bar, 161ms is less full. 
                                So lower number = longer bar. */}
                             <div className="h-full bg-lime-500" style={{ width: `${Math.min((200 / item.speed) * 40, 100)}%` }}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* 3. Slowest Keys (Orange Theme) */}
          <div className="bg-[#0f1014]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 h-[280px] flex flex-col">
             <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold text-lg">
                <Clock size={20} />
                <span>ปุ่มที่ต้องปรับปรุง</span>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {stats.slowestKeys.map((item, index) => (
                   <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs font-mono w-4">#{index + 1}</span>
                      <div className="w-8 h-8 flex items-center justify-center bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded text-sm font-bold">
                         {item.key}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <div className="flex justify-between text-xs text-white/80 mb-1 font-mono">
                            <span>{item.speed}ms</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            {/* Higher time = Longer bar (Direct representation of 'slowness') */}
                             <div className="h-full bg-orange-500" style={{ width: getBarWidth(item.speed) }}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-center gap-6 mt-2">
           <button 
             onClick={handleHome}
             className="group px-10 py-3.5 rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 text-black font-bold shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:scale-105 transition-all duration-300 tracking-wide text-lg border border-yellow-400/50"
           >
             เมนูหลัก
           </button>
           
           <button 
             onClick={onNext}
             className="group px-10 py-3.5 rounded-full bg-gradient-to-r from-lime-500 to-green-600 text-black font-bold shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] hover:scale-105 transition-all flex items-center gap-3 text-lg"
           >
             <LayoutGrid size={24} className="group-hover:rotate-180 transition-transform duration-500"/>
             เล่นอีกครั้ง
           </button>
        </div>

      </motion.div>

       {/* Background Particles (Optional: Matches the starry background in image) */}
       <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full opacity-20 animate-pulse"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 2 + 's'
              }}
            />
          ))}
       </div>
    </div>
  );
};

export default SummaryPopup;
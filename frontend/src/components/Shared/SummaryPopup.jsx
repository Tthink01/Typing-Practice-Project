import React from "react";
import {
  Trophy,
  Activity,
  AlertCircle,
  Zap,
  Clock,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const SummaryPopup = ({
  stats,
  onRetry,
  onHome,
  isWin,
  onNext,
  currentCount = 0,
  isSandbox = false, // ✅ 1. รับ prop isSandbox เข้ามา (ค่า default เป็น false)
}) => {
  // 1. ฟังก์ชันคำนวณระดับความเร็ว (Rank)
  const getRank = (wpm) => {
    if (wpm >= 100)
      return {
        text: "พระเจ้า (Godlike)",
        color: "text-amber-400",
        message: "ระดับพระเจ้า! ไม่มีใครหยุดคุณได้แล้ว ⚡️", // ✅ เพิ่มข้อความตรงนี้
      };
    if (wpm >= 80)
      return {
        text: "ปีศาจ (Insane)",
        color: "text-red-400",
        message: "สุดยอด! ความเร็วระดับปีศาจชัดๆ 🔥",
      };
    if (wpm >= 60)
      return {
        text: "มือโปร (Professional)",
        color: "text-purple-400",
        message: "ยอดเยี่ยม! นี่แหละฝีมือมืออาชีพ 🚀",
      };
    if (wpm >= 40)
      return {
        text: "ใช้ได้เลย (Intermediate)",
        color: "text-lime-400",
        message: "ทำได้ดีมาก! มาถูกทางแล้ว 👍",
      };

    // กรณีคะแนนน้อยกว่า 40
    return {
      text: "มือใหม่ฝึกหัด (Beginner)",
      color: "text-stone-400",
      message: "ยินดีด้วย! ภารกิจสำเร็จแล้ว ✌️",
    };
  };

  const rank = getRank(stats.wpm);

  // 2. Mock Data
  const fastestKeys = stats.fastestKeys || [
    { char: stats.fastestKey || "-", time: "---", percent: 100 },
    { char: "ก", time: "---", percent: 80 },
    { char: "ด", time: "---", percent: 60 },
  ];

  const slowestKeys = stats.slowestKeys || [
    { char: stats.slowestKey || "-", time: "---", percent: 100 },
    { char: "ห", time: "---", percent: 80 },
    { char: "ฟ", time: "---", percent: 50 },
  ];

  // ✅ ฟังก์ชันแปลงชื่อปุ่ม (เรียกใช้แล้ว)
  const getKeyLabel = (char) => {
    if (char === " ") return "Spacebar";
    return char;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-sm animate-in fade-in duration-300"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl flex flex-col gap-6 animate-scale-up font-sans">
        {/* Header Text */}
        <h1
          className={`text-center text-2xl md:text-4xl font-bold text-transparent bg-clip-text drop-shadow-lg ${
            isWin
              ? "bg-gradient-to-r from-lime-400 to-green-200"
              : "bg-gradient-to-r from-red-400 to-orange-200"
          }`}
          style={{ fontFamily: "'Itim', cursive" }}
        >
          {isWin ? rank.message : "ไม่เป็นไร! พยายามอีกนิด คุณทำได้ ✌️"}
        </h1>

        {/* --- ส่วนบน: การ์ดใหญ่ 2 ใบ (WPM / Accuracy) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WPM Card */}
          <div className="relative bg-stone-900/50 border border-amber-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <Trophy size={48} className="text-amber-400 mb-2" />
            <span className="text-7xl md:text-8xl font-bold text-white tracking-tighter">
              {stats.wpm}
            </span>
            <span className="text-amber-200/60 text-sm md:text-lg uppercase tracking-widest font-bold">
              WPM (คำ/นาที)
            </span>
            <div className="mt-4 px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <span className="text-stone-400 text-sm">ระดับความเร็ว: </span>
              <span className={`font-bold ${rank.color}`}>{rank.text}</span>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="relative bg-stone-900/50 border border-lime-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(132,204,22,0.1)]">
            <Activity size={48} className="text-lime-400 mb-2" />
            <div className="flex items-baseline">
              <span className="text-7xl md:text-8xl font-bold text-white tracking-tighter">
                {stats.accuracy}
              </span>
              <span className="text-3xl md:text-4xl text-lime-500 ml-1">%</span>
            </div>
            <span className="text-lime-200/60 text-sm md:text-lg uppercase tracking-widest font-bold">
              ACCURACY (ความแม่นยำ)
            </span>
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
          {/* 1. Wrong Keys */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <AlertCircle size={20} />
              <h3
                className="font-bold text-lg"
                style={{ fontFamily: "'Itim', cursive" }}
              >
                ตัวอักษรที่กดผิด
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 content-start h-[120px] overflow-y-auto custom-scrollbar">
              {stats.wrongKeys && stats.wrongKeys.length > 0 ? (
                Array.from(
                  new Set(stats.wrongKeys.map((k) => k.split(" ")[0])),
                ).map((char, idx) => (
                  <div
                    key={idx}
                    // ✅ ปรับ CSS: ให้ยืดหยุ่น (min-w) เพื่อรองรับคำว่า Spacebar
                    className="h-10 px-3 min-w-[2.5rem] flex items-center justify-center bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 font-bold text-sm md:text-base shadow-inner"
                  >
                    {/* ✅ เรียกใช้ getKeyLabel */}
                    {getKeyLabel(char)}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600 italic">
                  ไม่มีที่ผิดเลย เยี่ยม!
                </div>
              )}
            </div>
          </div>

          {/* 2. Fastest Keys */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-lime-400">
              <Zap size={20} />
              <h3
                className="font-bold text-lg"
                style={{ fontFamily: "'Itim', cursive" }}
              >
                ปุ่มที่กดเร็วที่สุด
              </h3>
            </div>
            <div className="space-y-3">
              {fastestKeys.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-stone-500 text-xs font-mono">
                    #{i + 1}
                  </div>
                  {/* ✅ ปรับ CSS: ให้ยืดหยุ่น */}
                  <div className="h-8 px-2 min-w-[2rem] flex items-center justify-center bg-lime-900/20 border border-lime-500/30 rounded text-lime-400 font-bold text-sm">
                    {/* ✅ เรียกใช้ getKeyLabel */}
                    {getKeyLabel(item.char)}
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-sm font-mono text-lime-400">
                      {(item.time / 1000).toFixed(2)} วินาที
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Slowest Keys */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Clock size={20} />
              <h3
                className="font-bold text-lg"
                style={{ fontFamily: "'Itim', cursive" }}
              >
                ปุ่มที่ต้องปรับปรุง
              </h3>
            </div>
            <div className="space-y-3">
              {slowestKeys.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-stone-500 text-xs font-mono">
                    #{i + 1}
                  </div>
                  {/* ✅ ปรับ CSS: ให้ยืดหยุ่น */}
                  <div className="h-8 px-2 min-w-[2rem] flex items-center justify-center bg-orange-900/20 border border-orange-500/30 rounded text-orange-400 font-bold text-sm">
                    {/* ✅ เรียกใช้ getKeyLabel */}
                    {getKeyLabel(item.char)}
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-sm font-mono text-orange-400">
                      {(item.time / 1000).toFixed(2)} วินาที
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-center gap-4 mt-2">
          {/* ปุ่มเมนูหลัก */}
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 md:px-8 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-full border border-stone-600 transition-all hover:scale-105"
          >
            <Home size={20} /> เมนูหลัก
          </button>

          {isWin ? (
            // ✅✅✅ แก้ไข Logic ปุ่มตรงนี้ครับ ✅✅✅
            isSandbox ? (
              // กรณี 1: Sandbox (ชนะแต่ให้โชว์ปุ่ม Retry สีเขียว)
              <button
                onClick={onRetry} // เรียก onRetry (เริ่มเกมใหม่)
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-400 text-stone-950 font-bold rounded-full shadow-lg shadow-lime-900/20 transition-all hover:scale-105"
              >
                <RotateCcw size={20} /> ลองอีกครั้ง
              </button>
            ) : (
              // กรณี 2: โหมดปกติ (ชนะแล้วไปด่านถัดไป)
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-400 text-stone-950 font-bold rounded-full shadow-lg shadow-lime-900/20 transition-all hover:scale-105 animate-pulse-slow"
              >
                <span>ถัดไป / ดูผลทดสอบ</span> <ArrowRight size={20} />
              </button>
            )
          ) : (
            // กรณีแพ้ (สีส้ม)
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-full shadow-lg shadow-orange-900/20 transition-all hover:scale-105"
            >
              {currentCount > 0 ? (
                <>
                  <span>ถัดไป / ดูผลทดสอบ</span> <ArrowRight size={20} />
                </>
              ) : (
                <>
                  <RotateCcw size={20} /> ลองอีกครั้ง
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPopup;

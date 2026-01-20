import React, { useMemo,  } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Check, X, Trophy, Home, AlertTriangle } from "lucide-react";

const LevelUpgradePopup = ({
  isOpen,
  onNext,
  onBack,
  onHome,
  passCount = 0,
  targetCount = 3,
  isWin = false,
  history = [], // ✅ รับค่า history
}) => {
  // -------------------------------------------------------
  // Hooks
  // -------------------------------------------------------

  // สร้าง Session ID ครั้งเดียว
  // const [sessionID] = useState(() =>
  //   Math.random().toString(36).substr(2, 6).toUpperCase()
  // );

  // ✅ กำหนดจำนวนช่องเป็น 5 ช่อง (Fix ตายตัว)
  const TOTAL_SLOTS = 5;

  const isLevelComplete = passCount >= targetCount;

  // นับจำนวนครั้งที่ผิด
  const failCount = history.filter((result) => result === false).length;

  // คำนวณสถานะของแต่ละช่องจาก history
  const slots = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
      const result = history[index];

      if (result === true) return "passed";
      if (result === false) return "failed";

      return "pending"; // ยังเล่นไม่ถึงรอบนี้
    });
  }, [history, TOTAL_SLOTS]);

  // -------------------------------------------------------
  // Conditional Render
  // -------------------------------------------------------
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl h-[500px] flex rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
        >
          {/* --- LEFT PANEL (GOLD THEME) --- */}
          <div className="w-1/3 bg-gradient-to-b from-[#3a2a0d] to-[#1a1a1a] p-8 flex flex-col justify-between relative border-r border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-yellow-600/5 pointer-events-none" />

            <div>
              <div className="inline-block px-3 py-1 rounded-full border border-yellow-600/30 bg-yellow-900/20 text-yellow-500 text-[10px] font-bold tracking-wider mb-6">
                ● PROMOTION EXAM
              </div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-700 mb-4 leading-tight">
                สอบ
                <br />
                เลื่อนระดับ
              </h2>
              <p className="text-gray-400 text-sm font-light">
                พิสูจน์ความสามารถของคุณ
                <br />
                เพื่อปลดล็อคระดับถัดไป
              </p>
            </div>

            {/* Current Status Box */}
            <div className="bg-[#2a2a2a]/50 rounded-xl p-4 border border-white/5 backdrop-blur-md">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                  จำนวนรอบ
                </span>
                <Trophy className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-white">
                  {Math.min(passCount, targetCount)}
                </span>
                <span className="text-lg text-gray-500 mb-1">
                  /{targetCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (Math.min(passCount, targetCount) / targetCount) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT PANEL (CONTENT) --- */}
          <div className="w-2/3 bg-[#0f0f0f] p-10 flex flex-col relative">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                  <span className={isWin ? "text-green-500" : "text-red-500"}>
                    ⚡
                  </span>
                  ผลการทดสอบ
                </h3>
                {/* <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  SESSION ID: #{sessionID}
                </p> */}
              </div>
            </div>

            {/* Result Cards Row */}
            <div className="flex gap-4 mb-auto overflow-x-auto pb-2">
              {slots.map((status, index) => {
                let cardClass = "border-gray-800 bg-[#161616]";
                let icon = <div className="w-2 h-2 rounded-full bg-gray-700" />;
                let glow = "";
                let barColor = "";

                if (status === "passed") {
                  cardClass = "border-green-500/50 bg-green-500/10";
                  icon = (
                    <Check className="w-8 h-8 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  );
                  glow = "shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]";
                  barColor = "bg-green-500";
                } else if (status === "failed") {
                  cardClass = "border-red-500/50 bg-red-500/10";
                  icon = (
                    <X className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  );
                  glow = "shadow-[0_0_30px_-10px_rgba(220,38,38,0.3)]";
                  barColor = "bg-red-500";
                }

                return (
                  <div
                    key={index}
                    className={`min-w-[5rem] h-32 rounded-xl border-2 flex items-center justify-center transition-all duration-300 relative ${cardClass} ${glow}`}
                  >
                    <span className="absolute top-2 right-3 text-[10px] text-gray-600 font-mono">
                      {index + 1}
                    </span>
                    {icon}
                    {status !== "pending" && (
                      <div
                        className={`absolute bottom-3 w-8 h-1 rounded-full ${barColor}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 🔥🔥🔥 ส่วนที่เพิ่ม: ข้อความเตือนเมื่อผิดครบ 3 ครั้ง 🔥🔥🔥 */}
            {failCount >= 3 && (
              <div className="mt-4 w-full flex justify-center animate-bounce">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 font-bold shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  <AlertTriangle className="w-5 h-5" />
                  <span>ไม่ผ่าน 3 รอบ! ระบบจะทำการรีเซ็ต!</span>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-800">
              {isLevelComplete ? (
                <div className="w-full flex justify-center">
                  <button
                    onClick={onHome}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(202,138,4,0.4)]"
                  >
                    <Home className="w-4 h-4" />
                    กลับไปหน้าหลัก
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={onBack}
                    className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2 px-4 py-2"
                  >
                    &lt; กลับ
                  </button>

                  <button
                    onClick={onNext}
                    className={`
                      px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2
                      ${
                        isWin
                          ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:bg-lime-300"
                          : "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-500"
                      }
                    `}
                  >
                    {isWin ? "ต่อไป >" : "ลองอีกครั้ง"}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LevelUpgradePopup;
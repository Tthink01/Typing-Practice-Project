import React, { useState } from "react";
import { Keyboard, HelpCircle, Lock, ArrowRight, X } from "lucide-react"; // ✅ เพิ่ม icon X

const ModeCard = ({ title, level, description, isLocked, helpText, type }) => {
  const [showHelp, setShowHelp] = useState(false);

  // เช็ค type (ถ้าไม่ส่งมา หรือเป็น basic ให้เป็น true)
  const isBasic = (type || "basic") === "basic";
  const contentText = helpText || "";

  // ✅ 1. ฟังก์ชันเลือกธีม (คงเดิม)
  const getTheme = () => {
    // --- กรณี A: การ์ดล็อค (Locked) ---
    if (isLocked) {
      return {
        border: "border-gray-200 dark:border-stone-800",
        iconBox: "text-amber-500/80 bg-gray-100 dark:bg-stone-950/50 border-gray-200 dark:border-stone-800",
        textTitle: "text-gray-400 dark:text-stone-500",
        textSub: "text-gray-500 dark:text-stone-600",
        desc: "text-gray-400 dark:text-stone-500",
        bgGradient: "from-gray-200/50 dark:from-stone-800/20 to-transparent",
        button:
          "text-amber-500/80 border-amber-900/30 bg-gray-100 dark:bg-stone-950/40 cursor-not-allowed",
        helpIcon: "text-gray-400 dark:text-stone-500",
        helpTitle: "text-gray-400 dark:text-stone-500",
        helpBg: "bg-gray-100 dark:bg-stone-800/20 border-gray-200 dark:border-stone-700/20",
      };
    }

    // --- กรณี B: ระดับพื้นฐาน (Basic) -> สีเขียว (Lime) ---
    if (isBasic) {
      return {
        border:
          "border-gray-200 dark:border-stone-800 hover:border-lime-500/50 hover:shadow-2xl hover:-translate-y-2 cursor-pointer",
        iconBox:
          "text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-stone-900/80 border-lime-200 dark:border-stone-700 group-hover:border-lime-500/30 group-hover:bg-lime-900/10",
        textTitle: "text-gray-900 dark:text-stone-100 group-hover:text-black dark:group-hover:text-white",
        textSub: "text-lime-600 dark:text-lime-500/80",
        desc: "text-gray-600 dark:text-stone-400 group-hover:text-gray-800 dark:group-hover:text-stone-200",
        bgGradient: "from-lime-500/10 to-transparent",
        button:
          "bg-gradient-to-r from-lime-500 to-lime-400 dark:from-lime-600 dark:to-lime-500 text-white dark:text-stone-950 shadow-lg shadow-lime-900/20 group-hover:scale-[1.02]",
        helpIcon: "text-lime-600 dark:text-lime-400",
        helpTitle: "text-lime-600 dark:text-lime-400",
        helpBg: "bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-500/20",
      };
    }

    // --- กรณี C: ระดับโปร (Pro) -> สีทอง (Amber) ---
    return {
      border:
        "border-gray-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-2xl hover:-translate-y-2 cursor-pointer",
      iconBox:
        "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-stone-900/80 border-amber-200 dark:border-stone-700 group-hover:border-amber-500/30 group-hover:bg-amber-900/10",
      textTitle: "text-gray-900 dark:text-stone-100 group-hover:text-black dark:group-hover:text-white",
      textSub: "text-amber-600 dark:text-amber-500/80",
      desc: "text-gray-600 dark:text-stone-400 group-hover:text-gray-800 dark:group-hover:text-stone-200",
      bgGradient: "from-amber-500/10 to-transparent",
      button:
        "bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500 text-white dark:text-stone-950 shadow-lg shadow-amber-900/20 group-hover:scale-[1.02]",
      helpIcon: "text-amber-600 dark:text-amber-400",
      helpTitle: "text-amber-600 dark:text-amber-400",
      helpBg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/20",
    };
  };

  const theme = getTheme();

  // ฟังก์ชันสำหรับเปิด/ปิด Help
  const toggleHelp = (e) => {
    e.stopPropagation(); // ป้องกันไม่ให้ Event ทะลุไปกดการ์ด
    setShowHelp(!showHelp);
  };

  return (
    <div
      className={`group relative w-[380px] h-[400px] bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 ${theme.border}`}
    >
      {/* --- 1. Background Gradient Effect --- */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-0 ${!isLocked && "group-hover:opacity-100"} transition-opacity duration-500`}
      />

      {/* --- 2. Popup ข้อความแนะนำ (Overlay) --- */}
      <div
        // ✅ เพิ่ม: คลิกที่พื้นหลัง Popup เพื่อปิด
        onClick={(e) => {
          e.stopPropagation();
          setShowHelp(false);
        }}
        className={`absolute inset-0 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 cursor-default
        ${showHelp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* ✅ เพิ่ม: ปุ่มปิด X มุมขวาบน */}
        <button 
            className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                setShowHelp(false);
            }}
        >
            <X size={24} />
        </button>

        <div className={`relative z-40 p-4 rounded-full mb-4 border animate-pulse ${theme.helpBg}`}>
          <HelpCircle size={48} className={`${theme.helpIcon} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
        </div>

        <h3
          className={`${theme.helpTitle} font-bold text-xl mb-4`}
          style={{ fontFamily: "'Itim', cursive" }}
        >
          คำแนะนำ
        </h3>

        <p
          className="text-gray-600 dark:text-stone-300 leading-relaxed font-light text-lg"
          style={{ fontFamily: "'Itim', cursive" }}
        >
          {contentText}
        </p>
        
        {/* ข้อความบอกวิธีกดปิด */}
        <span className="mt-6 text-xs text-stone-600 font-light">(แตะเพื่อปิด)</span>
      </div>

      {/* --- 3. เนื้อหาการ์ด --- */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Icon & Help */}
        <div className="flex justify-between items-start mb-6">
          {/* Main Icon Box */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${theme.iconBox}`}>
            <Keyboard size={32} />
          </div>

          {/* Help Icon (Trigger Button) */}
          <div
            // ✅ แก้ไข: ขยายขนาดปุ่มเป็น w-12 h-12 และจัดกึ่งกลาง
            className={`
              relative z-20 
              w-12 h-12 flex items-center justify-center rounded-full 
              border transition-all duration-300 cursor-pointer
              ${
                type === "basic"
                  ? "border-lime-500/30 bg-stone-900/60 text-lime-400 hover:bg-lime-500/20 hover:shadow-[0_0_15px_rgba(132,204,22,0.5)]"
                  : "border-orange-500/30 bg-stone-900/60 text-orange-400 hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
              }
            `}
            // ✅ แก้ไข: ใช้ onClick แทน onMouseEnter
            onClick={toggleHelp}
          >
            <HelpCircle size={24} />
          </div>
        </div>

        {/* Text Info */}
        <div className="flex flex-col gap-1">
          <h2
            className={`text-3xl font-bold transition-colors ${theme.textTitle}`}
            style={{ fontFamily: "'Itim', cursive" }}
          >
            {title}
          </h2>
          <span className={`text-xs font-bold tracking-widest uppercase ${theme.textSub}`}>
            {level}
          </span>
        </div>

        <p
          className={`mt-6 leading-relaxed text-lg h-24 overflow-hidden transition-colors ${theme.desc}`}
          style={{ fontFamily: "'Itim', cursive" }}
        >
          {description}
        </p>

        {/* --- 4. Footer Button --- */}
        <div className="mt-auto pt-4">
          <div className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between font-bold transition-all duration-300 ${theme.button}`}>
            {isLocked ? (
              <div className="flex items-center justify-center w-full">
                <Lock size={20} className="mr-2" /> <span>ยังไม่ปลดล็อค</span>
              </div>
            ) : (
              <>
                <span>เริ่มฝึกฝน</span>
                <ArrowRight
                  size={22}
                  className="opacity-70 group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeCard;

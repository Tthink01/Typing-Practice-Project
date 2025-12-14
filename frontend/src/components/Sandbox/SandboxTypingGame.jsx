import React, { useRef, useEffect, useMemo } from "react";
import { preprocessThaiText } from "../../utils/thaiTextHandler";

const SandboxTypingGame = ({
  targetText,
  userInput,
  onInputChange,
  isGameActive = true,
  fontSize = "text-3xl md:text-4xl",
}) => {
  const inputRef = useRef(null);

  // Auto-focus เมื่อเริ่มเกม หรือเปลี่ยนประโยค
  useEffect(() => {
    if (isGameActive) inputRef.current?.focus();
  }, [isGameActive, targetText]);

  const handleClick = () => inputRef.current?.focus();

  // จัดการสระลอยและลำดับคำ (ยังคงต้องใช้เพื่อให้แสดงผลภาษาไทยถูกต้อง)
  const processedWords = useMemo(() => {
    const cleanedChars = preprocessThaiText(targetText);
    return cleanedChars.join("").split(" ");
  }, [targetText]);

  let globalCharIndex = 0;

  return (
    <div
      className="relative w-full max-w-6xl mx-auto pt-10 px-4 outline-none"
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
        value={userInput}
        onChange={onInputChange}
        autoComplete="off"
        spellCheck="false"
        disabled={!isGameActive}
      />

      {/* Main Container */}
      <div
        className={`${fontSize} leading-[2.5] font-mono tracking-wide flex flex-wrap gap-y-4 text-stone-400 select-none`}
      >
        {processedWords.map((word, wIndex) => {
          const chars = word.split("");
          const isLastWord = wIndex === processedWords.length - 1;

          return (
            <div key={wIndex} className="inline-block whitespace-nowrap">
              {/* --- ตัวอักษร --- */}
              {chars.map((char, cIndex) => {
                const currentIndex = globalCharIndex++;
                const isTyped = currentIndex < userInput.length;
                const isCorrect = isTyped && userInput[currentIndex] === char;
                const isWrong = isTyped && !isCorrect;
                const isActive =
                  currentIndex === userInput.length && isGameActive;

                // --- Color Logic (ปรับให้สว่างขึ้นสำหรับโหมด Sandbox) ---
                let textColor = "text-stone-500 opacity-60"; // ยังไม่พิมพ์ (สีเทากลางๆ อ่านออกง่าย)
                if (isCorrect) textColor = "text-stone-100 opacity-100"; // พิมพ์ถูก (สีขาว)
                if (isWrong) textColor = "text-red-400 opacity-100"; // พิมพ์ผิด (สีแดง)
                if (isActive) textColor = "text-orange-400 opacity-100"; // ตัวปัจจุบัน (สีส้ม)

                // --- Cursor Logic (แบบขีดเส้นใต้เรียบๆ) ---
                // ไม่ใช้ Background Box แล้ว เพื่อความคลีน
                const cursorClass = isActive
                  ? "border-b-4 border-orange-500 animate-pulse pb-1"
                  : "";

                // พื้นหลังสีแดงจางๆ เฉพาะตอนพิมพ์ผิด
                const bgClass = isWrong ? "bg-red-500/20 rounded-sm" : "";

                return (
                  <span
                    key={`char-${wIndex}-${cIndex}`}
                    className={`relative inline-flex justify-center items-center px-[1px] transition-colors duration-75 ${textColor} ${cursorClass} ${bgClass}`}
                  >
                    {char}
                    {/* ไม่มีการใส่ลูกศร Helper ใดๆ ตรงนี้ */}
                  </span>
                );
              })}

              {/* --- Spacebar Logic (แบบเรียบ) --- */}
              {!isLastWord &&
                (() => {
                  const spaceIndex = globalCharIndex++;
                  const isActive =
                    spaceIndex === userInput.length && isGameActive;
                  const isWrong =
                    spaceIndex < userInput.length &&
                    userInput[spaceIndex] !== " ";

                  return (
                    <span
                      key={`space-${wIndex}`}
                      className={`relative inline-block w-[0.6em] text-center mx-[2px] rounded-sm align-middle
                      ${isWrong ? "bg-red-500/50" : ""}
                      ${
                        isActive
                          ? "bg-stone-700/50 ring-2 ring-orange-500/50"
                          : ""
                      } 
                    `}
                    >
                      {/* แสดงสัญลักษณ์ ␣ จางๆ เฉพาะตอนถึงคิวพิมพ์ (Optional: ลบออกได้ถ้าต้องการคลีนสุดๆ) */}
                      {isActive && (
                        <span className="text-xs text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
                          ␣
                        </span>
                      )}
                      &nbsp;
                    </span>
                  );
                })()}
            </div>
          );
        })}
      </div>

      {!isGameActive && userInput.length === 0 && (
        <div className="mt-12 text-center text-stone-500 animate-pulse font-light">
          เริ่มพิมพ์ได้เลย...
        </div>
      )}
    </div>
  );
};

export default SandboxTypingGame;

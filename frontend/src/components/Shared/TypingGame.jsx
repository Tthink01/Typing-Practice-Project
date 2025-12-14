import React, { useRef, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

// --- Helper Functions ---
const isUpperMark = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0x0E31 && code <= 0x0E37) || (code >= 0x0E47 && code <= 0x0E4E);
};

const isLowerMark = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0x0E38 && code <= 0x0E3A;
};

// --- Component ---
const TypingGame = ({ 
  targetText, 
  userInput, 
  onInputChange, 
  isGameActive = true, 
  fontSize = "text-3xl md:text-4xl"
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isGameActive) inputRef.current?.focus();
  }, [isGameActive, targetText]);

  const handleClick = () => inputRef.current?.focus();

  let globalCharIndex = 0;
  // แยกเป็นคำๆ เพื่อจัดการ Word Wrap (คำไม่ขาด)
  const words = targetText.split(' ');

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

      {/* Main Container:
         - leading-loose: เพิ่มระยะห่างบรรทัดให้พอสำหรับสระบน/ล่าง (สำคัญมากสำหรับภาษาไทย)
         - flex-wrap: ให้คำไหลตกบรรทัดได้
      */}
      <div className={`${fontSize} leading-[3] font-mono tracking-wide flex flex-wrap gap-y-2 text-stone-600 select-none`}>
        
        {words.map((word, wIndex) => {
          const chars = word.split('');
          const isLastWord = wIndex === words.length - 1;

          return (
            // 📦 Word Wrapper: ห่อคำไว้ด้วยกัน ห้ามแตกกลางคัน
            <div key={wIndex} className="inline-block whitespace-nowrap"> 
              
              {chars.map((char, cIndex) => {
                const currentIndex = globalCharIndex++;
                const isTyped = currentIndex < userInput.length;
                const isCorrect = isTyped && userInput[currentIndex] === char;
                const isWrong = isTyped && !isCorrect;
                const isActive = currentIndex === userInput.length && isGameActive;
                
                // Color Logic
                let textColor = "text-stone-700 opacity-30"; // ยังไม่พิมพ์ (จางๆ)
                if (isCorrect) textColor = "text-stone-100 opacity-100";
                if (isWrong) textColor = "text-red-400 opacity-100";
                if (isActive) textColor = "text-orange-400 opacity-100";

                // Background Highlight (เฉพาะตัวที่กำลังพิมพ์ หรือ พิมพ์ผิด)
                // ใช้ bg แทน cursor ขีดๆ เพราะเข้ากับภาษาไทยมากกว่า (ไม่บังวรรณยุกต์)
                const bgClass = isActive 
                  ? "bg-stone-800 rounded-sm shadow-[0_0_10px_rgba(251,146,60,0.5)]" 
                  : isWrong 
                    ? "bg-red-900/40 rounded-sm" 
                    : "";

                return (
                  // ✨ Core Logic: ใช้ relative + inline 
                  // เพื่อให้ Browser ผสมคำไทยให้อัตโนมัติ (สระจะไม่ลอยมั่วแล้ว)
                  <span 
                    key={`char-${wIndex}-${cIndex}`}
                    className={`relative inline px-[1px] transition-colors duration-100 ${textColor} ${bgClass}`}
                  >
                    {char}

                    {/* 🏹 Smart Arrow: ลูกศรบอกใบ้ (ยังอยู่เหมือนเดิม) */}
                    {isActive && isUpperMark(char) && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce text-orange-500 z-20 pointer-events-none">
                        <ArrowDown size={20} strokeWidth={3} />
                      </div>
                    )}
                    {isActive && isLowerMark(char) && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-orange-500 z-20 pointer-events-none">
                        <ArrowUp size={20} strokeWidth={3} />
                      </div>
                    )}
                  </span>
                );
              })}

              {/* Spacebar Logic */}
              {!isLastWord && (() => {
                const spaceIndex = globalCharIndex++;
                const isActive = spaceIndex === userInput.length && isGameActive;
                const isWrong = spaceIndex < userInput.length && userInput[spaceIndex] !== ' ';
                
                return (
                  <span 
                    key={`space-${wIndex}`}
                    className={`relative inline-block w-[0.6em] text-center mx-[2px] rounded-sm
                      ${isWrong ? "bg-red-500/50" : ""}
                      ${isActive ? "bg-stone-700 animate-pulse ring-2 ring-orange-500/50" : ""}
                    `}
                  >
                    &nbsp; {/* ใช้ Non-breaking space เพื่อดันระยะ */}
                  </span>
                );
              })()}
            </div>
          );
        })}
      </div>

      {!isGameActive && userInput.length === 0 && (
         <div className="mt-12 text-center text-stone-500 animate-pulse font-light">
            แตะแป้นพิมพ์เพื่อเริ่ม...
         </div>
      )}
    </div>
  );
};

export default TypingGame;
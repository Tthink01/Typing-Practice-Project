import React, { useRef, useEffect, useMemo } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'; 
import { preprocessThaiText } from '../../utils/thaiTextHandler'; 

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

  // จัดการข้อความ
  const processedWords = useMemo(() => {
     const cleanedChars = preprocessThaiText(targetText); 
     return cleanedChars.join('').split(' ');
  }, [targetText]);

  let globalCharIndex = 0;

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto pt-16 px-4 outline-none" 
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
      <div className={`${fontSize} leading-[3] font-mono tracking-wide flex flex-wrap gap-y-6 text-gray-500 dark:text-stone-600 select-none transition-colors duration-300`}>
        
        {processedWords.map((word, wIndex) => {
          const chars = word.split('');
          const isLastWord = wIndex === processedWords.length - 1;

          return (
            <div key={wIndex} className="inline-block whitespace-nowrap"> 
              
              {/* --- 1. ตัวอักษรในคำ --- */}
              {chars.map((char, cIndex) => {
                const currentIndex = globalCharIndex++;
                const isTyped = currentIndex < userInput.length;
                const isCorrect = isTyped && userInput[currentIndex] === char;
                const isWrong = isTyped && !isCorrect;
                const isActive = currentIndex === userInput.length && isGameActive;
                
                // Color Logic
                let textColor = "text-gray-400 dark:text-stone-700 opacity-40 dark:opacity-30";
                if (isCorrect) textColor = "text-gray-900 dark:text-stone-100 opacity-100 font-medium";
                if (isWrong) textColor = "text-red-500 dark:text-red-400 opacity-100";
                if (isActive) textColor = "text-orange-600 dark:text-orange-400 opacity-100 font-bold scale-110";

                // Background Logic
                const bgClass = isActive 
                  ? "bg-orange-100 dark:bg-stone-800 rounded-md shadow-[0_0_15px_rgba(251,146,60,0.3)] ring-1 ring-orange-500/30 dark:ring-0" 
                  : isWrong 
                    ? "bg-red-100 dark:bg-red-900/40 rounded-sm" 
                    : "";

                return (
                  <span 
                    key={`char-${wIndex}-${cIndex}`}
                    className={`relative inline-flex justify-center items-center px-[1px] transition-all duration-100 ${textColor} ${bgClass}`}
                  >
                    {char}

                    {/* ลูกศรบอกใบ้ (Smart Arrow) */}
                    {isActive && (
                      <>
                        {isUpperMark(char) && (
                          <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center z-20">
                            <span className="text-[9px] font-bold text-orange-500 uppercase mb-[-2px]">บน</span>
                            <ArrowDown size={20} strokeWidth={3} className="text-orange-500" />
                          </div>
                        )}
                        {isLowerMark(char) && (
                          <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col-reverse items-center z-20">
                             <span className="text-[9px] font-bold text-orange-500 uppercase mt-[-2px]">ล่าง</span>
                             <ArrowUp size={20} strokeWidth={3} className="text-orange-500" />
                          </div>
                        )}
                        {!isUpperMark(char) && !isLowerMark(char) && (
                           <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_orange]" />
                        )}
                      </>
                    )}
                  </span>
                );
              })}

              {/* --- 2. Spacebar Logic --- */}
              {!isLastWord && (() => {
                const spaceIndex = globalCharIndex++;
                const isActive = spaceIndex === userInput.length && isGameActive;
                const isTyped = spaceIndex < userInput.length;
                const isWrong = isTyped && userInput[spaceIndex] !== ' ';
                
                return (
                  <span 
                    key={`space-${wIndex}`}
                    className={`relative inline-block mx-[2px] rounded-sm align-middle transition-all duration-100
                      ${isActive ? "w-[1.5em]" : "w-[0.8em]"} 
                      ${isWrong ? "bg-red-500/50" : ""}
                      ${isActive ? "bg-orange-100 dark:bg-stone-800 ring-2 ring-orange-500 shadow-[0_0_15px_rgba(251,146,60,0.4)]" : ""}
                    `}
                  >
                    {/* ถ้าถึงตา Spacebar ให้โชว์คำว่า Space เด้งๆ */}
                    {isActive && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center min-w-[50px] z-30">
                        <span className="text-[10px] font-bold text-orange-500 bg-white dark:bg-stone-900/80 px-2 py-0.5 rounded-full border border-orange-500/50 mb-1 shadow-sm">
                          Space
                        </span>
                        <ArrowDown size={16} className="text-orange-500" />
                      </div>
                    )}

                    {/* สัญลักษณ์ ␣ จางๆ ตรงกลางปุ่ม */}
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold
                      ${isActive ? "text-orange-500 opacity-100" : "text-gray-300 dark:text-stone-600 opacity-0"}
                    `}>
                      ␣
                    </span>

                    &nbsp;
                  </span>
                );
              })()}
            </div>
          );
        })}
      </div>

      {!isGameActive && userInput.length === 0 && (
         <div className="mt-12 text-center text-gray-400 dark:text-stone-500 animate-pulse font-light">
            เริ่มพิมพ์ได้เลย...
         </div>
      )}
    </div>
  );
};

export default TypingGame;
import React from 'react';

const SandboxTypingGame = ({ targetText, userInput, isGameActive }) => {
  return (
    <div className="relative font-mono text-2xl md:text-3xl break-words w-full outline-none" style={{ lineHeight: '2em' }}>
      {targetText.split('').map((char, index) => {
        let colorClass = "text-stone-600";
        let extraClass = "";

        if (index < userInput.length) {
          if (userInput[index] === char) {
            colorClass = "text-stone-100";
          } else {
            colorClass = "text-red-500 bg-red-500/10 rounded";
          }
        } else if (index === userInput.length && isGameActive) {
          colorClass = "text-orange-400 border-b-2 border-orange-400";
          extraClass = "animate-pulse";
        }

        return (
          // ✅ สำคัญ: ต้องใส่ id เพื่อให้ Floater หาตำแหน่งเจอ
          <span 
            key={index} 
            id={`sb-char-${index}`} 
            className={`${colorClass} ${extraClass} transition-colors duration-100 inline-block min-w-[12px]`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default SandboxTypingGame;
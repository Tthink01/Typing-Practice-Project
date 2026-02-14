import React from "react";

const TypingDisplay = ({ targetText, userInput, inputRef, handleInputChange }) => {
  return (
    <div 
      className="relative font-mono text-3xl md:text-4xl leading-relaxed break-words outline-none select-none flex-grow flex flex-col justify-center"
      onClick={() => inputRef.current?.focus()}
    >
      <div>
        {targetText.normalize("NFC").split("").map((char, index) => {
          let colorClass = "text-gray-400 dark:text-stone-600";
          let borderClass = "";
          let extraClass = "";

          if (index < userInput.length) {
            if (userInput[index] === char) {
              colorClass = "text-gray-900 dark:text-stone-100";
            } else {
              colorClass = "text-red-500 bg-red-100 dark:bg-red-500/10 rounded";
            }
          } else if (index === userInput.length) {
            colorClass = "text-orange-600 dark:text-orange-400";
            borderClass = "border-b-2 border-orange-500 dark:border-orange-400";
            extraClass = "animate-pulse";
          }

          const isCombining = /[\u0E31\u0E33\u0E34-\u0E3A\u0E47-\u0E4E]/.test(char);
          const finalChar = (index === userInput.length && isCombining) 
            ? <><span className="opacity-50 font-sans">◌</span>{char}</> 
            : char;

          return (
            <span 
              key={index} 
              id={`game-char-${index}`} 
              className={`${colorClass} ${borderClass} ${extraClass} transition-colors duration-100 inline min-w-[1px] relative`}
            >
              {finalChar}
            </span>
          );
        })}
      </div>

      <input 
        ref={inputRef} 
        type="text" 
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default" 
        value={userInput} 
        onChange={handleInputChange} 
        autoComplete="off" 
      />
    </div>
  );
};

export default TypingDisplay;
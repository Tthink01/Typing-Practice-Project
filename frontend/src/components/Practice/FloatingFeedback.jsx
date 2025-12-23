import React, { useEffect } from 'react';

const Floater = ({ x, y, char, onRemove, isCorrect }) => {
  useEffect(() => {
    // ตั้งเวลาให้ลบตัวเองออกเมื่อ Animation จบ (500ms)
    const timer = setTimeout(onRemove, 500);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div 
      className="fixed pointer-events-none text-4xl font-bold animate-float-popup z-[9999]" 
      style={{ left: x, top: y, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
    >
      <span className={isCorrect ? "text-green-400" : "text-red-500"}>
        {char === ' ' ? '␣' : char}
      </span>
    </div>
  );
};

export default Floater;
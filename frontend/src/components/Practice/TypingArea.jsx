import React from 'react';

const TypingArea = ({ targetText, userInput, inputRef, handleInput, handleKeyDown }) => {
  return (
    <div className="bg-stone-900 rounded-3xl p-6 md:p-12 shadow-2xl border border-stone-800 relative" onClick={() => inputRef.current?.focus()}>
      
      {/* ส่วนแสดงผลข้อความ */}
      <div className="relative font-mono text-2xl md:text-3xl break-words outline-none cursor-text select-none min-h-[150px]" style={{ letterSpacing: '0.05em', lineHeight: '2em', whiteSpace: 'pre-wrap' }}>
        {targetText.split('').map((char, i) => {
           // ... (Copy Logic การ Render map จากโค้ดเดิมของคุณมาใส่ตรงนี้) ...
           // ตัวแปร statusClass, cursorClass, Logic isCombining ฯลฯ
           // สิ่งที่ต้องแก้: เปลี่ยนการเช็ค floating effect ให้ไปใช้ Component แยก หรือ Logic ที่สะอาดขึ้น
           
           // ตัวอย่างย่อ:
           let statusClass = "text-stone-600";
           if (i < userInput.length) {
               statusClass = userInput[i] === char ? "text-stone-100" : "text-red-500 bg-red-900/20";
           }
           
           return <span key={i} className={`${statusClass}`}>{char}</span>
        })}

        {/* Input ซ่อน */}
        <input 
            ref={inputRef} 
            type="text" 
            value={userInput} 
            onChange={handleInput} 
            onKeyDown={handleKeyDown} 
            className="absolute opacity-0 top-0 left-0 w-full h-full cursor-text" 
            autoComplete="off" 
        />
      </div>
    </div>
  );
};

export default TypingArea;
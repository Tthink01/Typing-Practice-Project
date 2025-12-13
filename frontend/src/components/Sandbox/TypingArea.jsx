import React, { useRef, useEffect } from "react";

const TypingArea = ({ targetText, userInput, onInputChange }) => {
  const inputRef = useRef(null);
  

  // Auto-focus เมื่อโหลดหน้า
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // คลิกที่กล่องข้อความแล้วให้โฟกัส input ทันที
  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative flex-1 outline-none cursor-text group"
      onClick={handleClick}
    >
      {/* Input ซ่อน (รับค่าจากคีย์บอร์ด) */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-full w-full cursor-text"
        value={userInput}
        onChange={onInputChange}
        autoComplete="off"
        spellCheck="false"
      />

      {/* พื้นที่แสดงตัวอักษร */}
      <div className="text-2xl md:text-3xl leading-relaxed font-mono tracking-wide break-words text-stone-600 transition-all">
        {targetText.split("").map((char, index) => {
          let colorClass = "text-stone-600"; // ยังไม่พิมพ์ (สีเทาเข้ม)
          let cursorClass = "";

          // Logic ตรวจสอบตัวอักษร
          if (index < userInput.length) {
            if (userInput[index] === char) {
              colorClass = "text-stone-100"; // พิมพ์ถูก (สีขาว)
            } else {
              colorClass = "text-red-500 border-b border-red-500"; // พิมพ์ผิด (สีแดง)
            }
          }

          // Logic Cursor (ขีดส้มๆ กระพริบ)
          if (index === userInput.length) {
            cursorClass = "border-l-2 border-orange-500 animate-pulse pl-[1px]";
          }

          return (
            <span key={index} className={`${colorClass} ${cursorClass}`}>
              {char}
            </span>
          );
        })}
      </div>

      {/* ข้อความด้านล่าง */}
      <div className="absolute bottom-0 left-0 w-full text-center py-6 mt-10 border-t border-stone-800/50">
        <span className="text-stone-600 text-sm group-hover:text-stone-400 transition-colors">
          กดปุ่มใดก็ได้เพื่อเริ่มพิมพ์ทดสอบความเร็ว
        </span>
      </div>
    </div>
  );
};

export default TypingArea;

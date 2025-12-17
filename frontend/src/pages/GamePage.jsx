import React, { useState,  useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import TypingGame from '../components/Shared/TypingGame'; // ใช้ตัวเดียวกับ Sandbox
import { EXERCISES_DATA } from '../data/exercises';

const GamePage = () => {
  const { mode, levelId } = useParams(); // รับค่าจาก URL (เช่น basic, 1)
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // หาข้อมูลด่านปัจจุบัน (Title, Subtitle)
  // หมายเหตุ: โค้ดนี้สมมติว่าเป็นภาษา TH ถ้าคุณมี State ภาษา global ต้องดึงมาใช้
  const currentLevelData = EXERCISES_DATA[mode]?.['TH']?.find(l => l.id === parseInt(levelId));

  // --- Mockup ข้อมูลโจทย์ (ในอนาคตควรแยกไปไฟล์ data จริงๆ) ---
  const getLevelContent = (m, l) => {
    if (m === 'basic' && l === '1') return "ฟ ห ก ด ่ า ส ว"; // โจทย์ด่าน 1
    if (m === 'basic' && l === '2') return "ภ ถ ุ ึ ค ต จ ข ช"; 
    return "ตัวอย่าง ข้อความ สำหรับ ฝึก พิมพ์"; // Default
  };

  const [targetText, ] = useState(() => getLevelContent(mode, levelId));
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= targetText.length) {
      setUserInput(val);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans" onClick={() => inputRef.current?.focus()}>
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 mt-8 flex flex-col">
        {/* Header ส่วนบน */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-stone-400 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft /> กลับหน้าหลัก
          </button>
          
          <div className="text-center">
             <h1 className="text-2xl font-bold text-orange-500">{currentLevelData?.title || `Level ${levelId}`}</h1>
             <p className="text-stone-500">{currentLevelData?.sub}</p>
          </div>
          
          <div className="w-24"></div> {/* Spacer ให้ title อยู่ตรงกลาง */}
        </div>

        {/* พื้นที่เกม */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 min-h-[400px] relative flex flex-col items-center justify-center shadow-2xl">
           
           <TypingGame 
              targetText={targetText}
              userInput={userInput}
              isGameActive={true}
           />

           {/* Hidden Input สำหรับรับค่าพิมพ์ */}
           <input 
              ref={inputRef}
              type="text"
              className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default"
              value={userInput}
              onChange={handleInputChange}
              autoFocus
           />

           <div className="mt-10 text-stone-500 text-sm">
             พิมพ์ตามตัวอักษรด้านบน
           </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
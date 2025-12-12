import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ModeCard from '../components/ModeCard';
import { GAME_MODES } from '../data/gameMode.js';
import WelcomeScreen from './WelcomePage.jsx';
import LevelSelectModal from '../components/LevelSelectModal'; // ✅ 1. นำเข้า Modal ที่สร้างไว้

// ✅ 2. ข้อมูลด่าน (Mock Data)
const EXERCISES_DATA = {
  basic: {
    TH: [
      { id: 1, title: "ด่านที่ 1", sub: "แป้นเหย้า (Home Row)" },
      { id: 2, title: "ด่านที่ 2", sub: "แถวบน (Top Row)" },
      { id: 3, title: "ด่านที่ 3", sub: "แถวล่าง (Bottom Row)" },
      { id: 4, title: "ด่านที่ 4", sub: "สลับแถว (Mixed Rows)" },
      { id: 5, title: "ด่านที่ 5", sub: "ผสมคำง่าย (Simple Words)" }
    ],
    EN: [
      { id: 1, title: "Level 1", sub: "Home Row" },
      { id: 2, title: "Level 2", sub: "Top Row" },
      { id: 3, title: "Level 3", sub: "Bottom Row" },
      { id: 4, title: "Level 4", sub: "Mixed Rows" },
      { id: 5, title: "Level 5", sub: "Simple Words" }
    ]
  },
  pro: {
    TH: [
      { id: 1, title: "ด่านที่ 1", sub: "ประโยคสั้น" },
      { id: 2, title: "ด่านที่ 2", sub: "บทความ" },
      { id: 3, title: "ด่านที่ 3", sub: "โค้ดโปรแกรม" }
    ],
    EN: [
      { id: 1, title: "Level 1", sub: "Sentences" },
      { id: 2, title: "Level 2", sub: "Articles" },
      { id: 3, title: "Level 3", sub: "Programming" }
    ]
  }
};

const HeroSection = () => (
  <div className="text-center mb-16 z-10">
    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
      ฝึกพิมพ์สัมผัส <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">E & T</span>
    </h1>
    <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
      โหมดฝึกฝนเพื่อพัฒนาทักษะ หรือเลื่อนไปทางขวาเพื่อทดสอบความเร็ว
    </p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  // ✅ 3. State ควบคุม Modal
  const [activeModal, setActiveModal] = useState(null); // 'basic' หรือ 'pro' หรือ null
  const [practiceLanguage, setPracticeLanguage] = useState('TH');

  // ✅ 4. ฟังก์ชันปลดล็อค (ให้เล่นได้หมดไปก่อน)
  const isLevelUnlocked = () => true; 

  // ✅ 5. ฟังก์ชันเมื่อกดการ์ด (สำคัญ! เปลี่ยนจากการเปลี่ยนหน้า เป็นเปิด Modal)
  const handleCardClick = (mode) => {
    if (mode.isLocked) return;

    // ถ้ากดการ์ดที่มี id เป็น 'basic' หรือ 'pro' ให้เปิด Modal
    // ** ต้องไปเช็คในไฟล์ data/gameMode.js ว่า id ตั้งเป็นอะไร **
    if (mode.id === 'basic' || mode.id === 'pro') {
       setActiveModal(mode.id);
    } else {
       navigate(mode.path);
    }
  };

  const handleLevelStart = (levelId) => {
      console.log(`เริ่มเกมโหมด: ${activeModal} ด่านที่: ${levelId}`);
      setActiveModal(null); // ปิด Modal ก่อน
      // ในอนาคตค่อยใส่ navigate ไปหน้าเกมจริงๆ ตรงนี้
      // navigate(`/game/${activeModal}/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Glow Effect */}
      {showWelcome && (
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      )}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-10">
        <HeroSection />

        {/* Card Container */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center w-full max-w-4xl z-10">
          {GAME_MODES.map((mode) => (
            // ✅ 6. แก้ไข onClick ให้เรียก handleCardClick
            <div key={mode.id} onClick={() => handleCardClick(mode)}>
               <ModeCard 
                 title={mode.title}
                 level={mode.level}
                 description={mode.description}
                 isLocked={mode.isLocked}
               />
            </div>
          ))}
        </div>
      </main>

      {/* ปุ่มลูกศรขวา */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
         <button className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-500 text-orange-500 transition-colors">
           ❯
         </button>
      </div>

      {/* ✅ 7. เรียกใช้ Modal ไว้ท้ายสุด */}
      <LevelSelectModal 
          isOpen={!!activeModal} 
          onClose={() => setActiveModal(null)}
          title={activeModal === 'basic' ? "ระดับพื้นฐาน (Basic)" : "ระดับใช้งานจริง (Pro)"}
          type={activeModal || 'basic'}
          exercises={activeModal ? EXERCISES_DATA[activeModal] : EXERCISES_DATA['basic']}
          language={practiceLanguage}
          setLanguage={setPracticeLanguage}
          isLevelUnlocked={isLevelUnlocked}
          onSelect={handleLevelStart}
       />

    </div>
  );
};

export default HomePage;
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ModeCard from '../components/ModeCard';
import { GAME_MODES } from '../data/gameMode.js'; // เรียกใช้ข้อมูล
import WelcomeScreen from './WelcomePage.jsx';

// ส่วนหัวข้อ (Hero Section)
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

// หน้าหลัก (HomePage)
const HomePage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    
    
    // Background Wrapper
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Glow Effect */}
      {showWelcome && (
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      )}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-10">
        <HeroSection />

        {/* Card Container: วนลูปสร้างการ์ด */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center w-full max-w-4xl z-10">
          {GAME_MODES.map((mode) => (
            <div key={mode.id} onClick={() => !mode.isLocked && navigate(mode.path)}>
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
    </div>
  );
};

export default HomePage;
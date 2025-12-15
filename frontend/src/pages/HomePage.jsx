import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Components ---
import ModeCard from "../components/ModeCard";
import WelcomeScreen from "./WelcomePage";
import LevelSelectModal from "../components/LevelSelectModal";
import HeroSection from "../components/Home/HeroSection";

// --- Data ---
import { GAME_MODES } from "../data/gameMode.js";
import { EXERCISES_DATA } from "../data/exercises.js";

// ==========================================
// 1. Custom Hook: จัดการเรื่อง Welcome Screen
// ==========================================
const useWelcomeLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State เริ่มต้น: เช็คจาก Session ว่าเคยดูหรือยัง
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem("hasSeenWelcome");
  });

  // Effect: ดักจับการเปลี่ยนหน้า (Navigation State)
  useEffect(() => {
    if (location.state?.forceShowWelcome) {
      setTimeout(() => setShowWelcome(true), 0);
      sessionStorage.removeItem("hasSeenWelcome");
    } else if (location.state?.forceShowContent) {
      setTimeout(() => setShowWelcome(false), 0);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, [location.state]);

  // Handler: เมื่อกดปุ่ม Start ในหน้า Welcome
  const handleStartGame = useCallback(() => {
    navigate("/", { state: { forceShowContent: true }, replace: true });
  }, [navigate]);

  return { showWelcome, handleStartGame };
};

// ==========================================
// 2. Custom Hook: จัดการเรื่อง Game Mode & Modal
// ==========================================
const useGameFlow = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'basic', 'pro', or null
  const [practiceLanguage, setPracticeLanguage] = useState("TH");

  // Logic: เช็คว่าเลเวลปลดล็อคหรือยัง (Mockup)
  const isLevelUnlocked = () => true;

  // Handler: เมื่อคลิกการ์ดเลือกโหมด
  const handleCardClick = (mode) => {
    if (mode.isLocked) return;

    if (mode.id === "basic" || mode.id === "pro") {
      setActiveModal(mode.id); // เปิด Modal
    } else {
      navigate(mode.path); // ไปหน้าอื่นทันที (เช่น Sandbox)
    }
  };

  // Handler: เมื่อกดเริ่มเกมจากใน Modal
  const handleLevelStart = (levelId) => {
    console.log(`Start Game: Mode ${activeModal}, Level ${levelId}`);
    setActiveModal(null);
    // navigate(`/game/${activeModal}/${levelId}`); // รอเปิดใช้งาน
  };

  return {
    activeModal,
    setActiveModal,
    practiceLanguage,
    setPracticeLanguage,
    isLevelUnlocked,
    handleCardClick,
    handleLevelStart,
  };
};

// ==========================================
// 3. Main Component: ส่วนแสดงผล (UI Only)
// ==========================================
const HomePage = () => {
  // เรียกใช้ Logic จาก Hooks
  const { showWelcome, handleStartGame } = useWelcomeLogic();
  const {
    activeModal,
    setActiveModal,
    practiceLanguage,
    setPracticeLanguage,
    isLevelUnlocked,
    handleCardClick,
    handleLevelStart,
  } = useGameFlow();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* --- Layer 1: Welcome Screen Overlay --- */}
      {showWelcome && <WelcomeScreen onStart={handleStartGame} />}

      {/* --- Layer 2: Background Effects --- */}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Layer 3: Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-10 z-10">
        
        <HeroSection />

        {/* Mode Selection Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center w-full max-w-4xl mt-8">
          {GAME_MODES.map((mode) => (
            <div 
              key={mode.id} 
              onClick={() => handleCardClick(mode)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ModeCard
                title={mode.title}
                level={mode.level}
                description={mode.description}
                isLocked={mode.isLocked}
                helpText={mode.id === "basic" ? "ผู้ใช้ต้องเล่นให้ผ่าน 3/5 รอบ เพื่อปลดล็อคด่านถัดไป🩷" : "คำแนะนำ Pro..."}
              />
            </div>
          ))}
        </div>
      </main>

      {/* --- Layer 4: Floating UI Elements --- */}
      {/* Right Arrow (Desktop Only) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block z-20">
        <button className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-500 text-orange-500 transition-colors shadow-lg">
          ❯
        </button>
      </div>

      {/* --- Layer 5: Modals --- */}
      <LevelSelectModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal === "basic" ? "ระดับพื้นฐาน (Basic)" : "ระดับใช้งานจริง (Pro)"}
        type={activeModal || "basic"}
        exercises={activeModal ? EXERCISES_DATA[activeModal] : EXERCISES_DATA["basic"]}
        language={practiceLanguage}
        setLanguage={setPracticeLanguage}
        isLevelUnlocked={isLevelUnlocked}
        onSelect={handleLevelStart}
      />
    </div>
  );
};

export default HomePage;
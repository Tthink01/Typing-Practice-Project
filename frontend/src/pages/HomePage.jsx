import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ 1. เพิ่ม useLocation


// --- Components ---
import ModeCard from "../components/ModeCard";
import WelcomeScreen from "./WelcomePage";
import LevelSelectModal from "../components/LevelSelectModal";
import HeroSection from "../components/Home/HeroSection";

// --- Data ---
import { GAME_MODES } from "../data/gameMode.js";
import { EXERCISES_DATA } from "../data/exercises.js";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 2. ประกาศตัวแปรเพื่อรับค่าจาก Navbar

  // --- States ---
  const [showWelcome, setShowWelcome] = useState(() => {
    // ถ้ามีค่า 'hasSeenWelcome' ใน session แล้ว ให้เป็น false (ไม่โชว์)
    return !sessionStorage.getItem("hasSeenWelcome");
  });

  // ✅ 3. เพิ่ม useEffect ดักจับการกดปุ่มจาก Navbar
  useEffect(() => {
    if (location.state?.forceShowWelcome) {
      // ใช้ setTimeout เพื่อรอให้ React Render เสร็จสมบูรณ์ก่อน ค่อยเปลี่ยนค่า
      setTimeout(() => {
        setShowWelcome(true);
      }, 0);
      sessionStorage.removeItem("hasSeenWelcome");
    } else if (location.state?.forceShowContent) {
      setTimeout(() => {
        setShowWelcome(false);
      }, 0);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, [location.state]); // ทำงานทุกครั้งที่ State ของ Link เปลี่ยนแปลง

  const handleStart = () => {
    // setShowWelcome(false);
    // sessionStorage.setItem("hasSeenWelcome", "true");
    navigate("/", { state: { forceShowContent: true }, replace: true });
  };

  const [activeModal, setActiveModal] = useState(null); // 'basic', 'pro', or null
  const [practiceLanguage, setPracticeLanguage] = useState("TH");

  // --- Handlers ---

  // ฟังก์ชันปลดล็อคจำลอง
  const isLevelUnlocked = () => true;

  // ฟังก์ชันกดการ์ด
  const handleCardClick = (mode) => {
    if (mode.isLocked) return;

    if (mode.id === "basic" || mode.id === "pro") {
      setActiveModal(mode.id);
    } else {
      navigate(mode.path);
    }
  };

  // ฟังก์ชันเริ่มเกม (รับค่าจาก Modal)
  const handleLevelStart = (levelId) => {
    console.log(`Start Game: Mode ${activeModal}, Level ${levelId}`);
    setActiveModal(null);
    // navigate(`/game/${activeModal}/${levelId}`);
  };

  return (
    
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
        {/* Background & Effects */}
        {showWelcome && <WelcomeScreen onStart={handleStart} />}

        <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 mt-10">
          {/* เรียกใช้ Component ที่แยกออกไป */}
          <HeroSection />

          {/* Card Grid */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center w-full max-w-4xl z-10">
            {GAME_MODES.map((mode) => (
              <div key={mode.id} onClick={() => handleCardClick(mode)}>
                <ModeCard
                  title={mode.title}
                  level={mode.level}
                  description={mode.description}
                  isLocked={mode.isLocked}
                  helpText={
                    mode.id === "basic"
                      ? "คำแนะนำสำหรับโหมดพื้นฐาน..."
                      : "คำแนะนำสำหรับโหมด Pro..."
                  }
                />
              </div>
            ))}
          </div>
        </main>

        {/* Right Arrow Button */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
          <button className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-500 text-orange-500 transition-colors">
            ❯
          </button>
        </div>

        {/* Modal System */}
        <LevelSelectModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={
            activeModal === "basic"
              ? "ระดับพื้นฐาน (Basic)"
              : "ระดับใช้งานจริง (Pro)"
          }
          type={activeModal || "basic"}
          exercises={
            activeModal ? EXERCISES_DATA[activeModal] : EXERCISES_DATA["basic"]
          }
          language={practiceLanguage}
          setLanguage={setPracticeLanguage}
          isLevelUnlocked={isLevelUnlocked}
          onSelect={handleLevelStart}
        />
      </div>
    
  );
};

export default HomePage;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Components ---
import ModeCard from "../components/ModeCard";
import WelcomeScreen from "./WelcomePage";
import LevelSelectModal from "../components/LevelSelectModal"; // หรือ path ที่คุณเก็บไฟล์ index ของ Shared
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

  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem("hasSeenWelcome");
  });

  useEffect(() => {
    if (location.state?.forceShowWelcome) {
      setTimeout(() => setShowWelcome(true), 0);
      sessionStorage.removeItem("hasSeenWelcome");
    } else if (location.state?.forceShowContent) {
      setTimeout(() => setShowWelcome(false), 0);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, [location.state]);

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
  const [activeModal, setActiveModal] = useState(null);
  const [practiceLanguage, setPracticeLanguage] = useState("TH");

  // ✅ แก้ไขตรงนี้: ย้าย Logic การเช็ค User มาใส่ใน useState โดยตรง
  const [userProgress,] = useState(() => {
    // 1. อ่านค่าจาก LocalStorage ทันทีที่หน้าเว็บโหลด
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      // 🟢 กรณีมี User: ให้ Return ค่า Progress ของ User นั้นออกไปเลย
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Logged in as:", parsedUser.username);

        // Mock Data สำหรับคนล็อกอิน (ในอนาคตเปลี่ยนเป็น parsedUser.progress)
        return {
          basic: { highestPassedLevel: 2, scores: { 1: 3, 2: 2 } },
          pro: { highestPassedLevel: 0, scores: {} },
        };
      } catch  {
        // กัน Error กรณี JSON พัง
        return {
          basic: { highestPassedLevel: 0, scores: {} },
          pro: { highestPassedLevel: 0, scores: {} },
        };
      }
    } else {
      // 🔴 กรณีไม่มี User: Return ค่าเริ่มต้น (ล็อกหมด)
      return {
        basic: { highestPassedLevel: 0, scores: {} },
        pro: { highestPassedLevel: 0, scores: {} },
      };
    }
  });

  // ... (ฟังก์ชัน isLevelUnlocked และอื่นๆ เหมือนเดิม) ...
  const isLevelUnlocked = (levelId) => {
    if (!activeModal) return false;
    const currentModeProgress = userProgress[activeModal] || {
      highestPassedLevel: 0,
    };
    return levelId <= currentModeProgress.highestPassedLevel + 1;
  };

  // ✅ (Optional) ถ้าอยากให้คนไม่ล็อกอิน "กดเลือกโหมดไม่ได้เลย" ให้แก้ตรงนี้
  const handleCardClick = (mode) => {
    if (mode.isLocked) return;

    // เช็คก่อนว่าล็อกอินไหม?
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser && (mode.id === "basic" || mode.id === "pro")) {
      if (
        window.confirm(
          "กรุณาเข้าสู่ระบบก่อนเริ่มเล่นเกม\nต้องการไปหน้าเข้าสู่ระบบหรือไม่?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    if (mode.id === "basic" || mode.id === "pro") {
      setActiveModal(mode.id);
    } else {
      navigate(mode.path);
    }
  };

  const handleLevelStart = (levelId) => {
    if (activeModal && levelId) {
      navigate(`/game/${activeModal}/${levelId}`);
      setActiveModal(null);
    }
  };

  return {
    activeModal,
    setActiveModal,
    practiceLanguage,
    setPracticeLanguage,
    isLevelUnlocked,
    handleCardClick,
    handleLevelStart,
    userProgress,
  };
};

// ... (ส่วน Component HomePage เหมือนเดิม)

// ==========================================
// 3. Main Component: ส่วนแสดงผล (UI Only)
// ==========================================
const HomePage = () => {
  const { showWelcome, handleStartGame } = useWelcomeLogic();
  const {
    activeModal,
    setActiveModal,
    practiceLanguage,
    setPracticeLanguage,
    isLevelUnlocked,
    handleCardClick,
    handleLevelStart,
    userProgress, // รับค่ามา
  } = useGameFlow();

  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* --- Layer 1: Welcome Screen Overlay --- */}
      {showWelcome && <WelcomeScreen onStart={handleStartGame} />}

      {/* --- Layer 2: Background Effects --- */}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Layer 3: Main Content --- */}
      <main className="flex flex-col items-center justify-center relative z-10 p-30">
        <HeroSection />

        {/* Mode Selection Grid */}
        <div className="flex flex-col md:flex-row font-itim gap-6 md:gap-8 justify-center items-center w-full max-w-4xl mt-8">
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
                helpText={
                  mode.id === "basic"
                    ? "ผู้ใช้ต้องเล่นให้ผ่าน 3/5 รอบ เพื่อปลดล็อคด่านถัดไป🩷"
                    : "ต้องเล่นให้ผ่าน 3 ด่าน ของระดับพื้นฐาน เพื่อปลดล็อค ระดับใช้ได้✌🏻❤️"
                }
              />
            </div>
          ))}
        </div>
      </main>

      {/* --- Layer 4: Floating UI Elements --- */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block z-20">
        <button
          onClick={() => navigate("/sandbox")}
          className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-500 text-orange-500 transition-colors shadow-lg cursor-pointer"
          title="ไปโหมดพิมพ์อิสระ"
        >
          ❯
        </button>
      </div>

      {/* --- Layer 5: Modals --- */}
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
        // ✅ 3. ส่งฟังก์ชัน Logic ที่แก้ไขแล้วเข้าไป
        isLevelUnlocked={isLevelUnlocked}
        // ✅ 4. ส่งข้อมูลคะแนน (Passed count) เข้าไปแสดงผล
        progress={activeModal ? userProgress[activeModal]?.scores : {}}
        onSelect={handleLevelStart}
      />
    </div>
  );
};

export default HomePage;

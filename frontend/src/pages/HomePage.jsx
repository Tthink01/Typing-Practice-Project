import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// --- Components ---
import ModeCard from "../components/ModeCard";
import WelcomeScreen from "./WelcomePage";
import LevelSelectModal from "../components/LevelSelectModal"; // หรือ path ที่คุณเก็บไฟล์ index ของ Shared
import HeroSection from "../components/Home/HeroSection";

// --- Data ---
import { GAME_MODES } from "../data/gameMode.js";
import { EXERCISES_DATA } from "../data/exercises.js";
import { checkLevelStatus, GAME_CONFIG } from "../utils/gameRule";

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
  const [userProgress, setUserProgress] = useState({
    basic: { highestPassedLevel: 0, scores: {} },
    pro: { highestPassedLevel: 0, scores: {} },
  });

  // ✅ เพิ่ม useEffect: เช็คว่า User ยัง valid อยู่ไหม หรือ Server เปิดอยู่ไหม
  useEffect(() => {
    const checkUserStatus = async () => {
      const storedUser = localStorage.getItem("currentUser");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // ยิงไปถาม Server: "เฮ้ย User ID นี้ยังมีตัวตนไหม?"
          const res = await axios.get(
            `http://localhost:3001/users/${parsedUser._id}`
          );

          if (res.data.status === "Success") {
            // 🟢 Server ตอบกลับมาว่ามีตัวตน -> อัปเดต Progress ล่าสุดจาก DB เลย
            const realUser = res.data.user;
            if (realUser.progress) {
              setUserProgress(realUser.progress);
            }
            // (Optional) อัปเดต localStorage ให้สดใหม่เสมอ
            localStorage.setItem("currentUser", JSON.stringify(realUser));
          }
        } catch (err) {
          // 🔴 กรณีเกิด Error (เช่น ปิด Server อยู่ หรือ User โดนลบไปแล้ว)
          console.error("Server check failed:", err);

          // ล้างข้อมูลทิ้ง -> ถือว่าไม่ได้ล็อกอิน
          localStorage.removeItem("currentUser");
          setUserProgress({
            basic: { highestPassedLevel: 0, scores: {} },
            pro: { highestPassedLevel: 0, scores: {} },
          });

          // (Optional) ถ้าอยากให้เด้งไปหน้า Login เลย ให้เปิดบรรทัดล่าง
          // navigate("/login");
        }
      }
    };

    checkUserStatus();
  }, []); // ทำงานครั้งเดียวตอนโหลดหน้า

  // ... (ฟังก์ชัน isLevelUnlocked และอื่นๆ เหมือนเดิม) ...
  const isLevelUnlocked = (levelId) => {
    // 1. ถ้ายังไม่ได้เลือกโหมด (Modal ปิดอยู่)
    if (!activeModal) return false;

    // ✅ 2. แก้จุดนี้: สร้าง Key ให้ตรงกับที่ Backend บันทึก (Mode + Language)
    // เช่น: activeModal="basic" + practiceLanguage="TH"  =>  "basic_TH"
    const progressKey = `${activeModal}_${practiceLanguage}`;

    // 3. ดึงข้อมูลจาก Key ใหม่
    const currentProgress = userProgress[progressKey] || {
      highestPassedLevel: 0,
    };

    // 4. ใช้ฟังก์ชันเช็คอันเดิม (Logic การคำนวณถูกต้องแล้ว)
    const status = checkLevelStatus(
      levelId,
      currentProgress.highestPassedLevel
    );

    return status.isUnlocked;
  };

  // ✅ (Optional) ถ้าอยากให้คนไม่ล็อกอิน "กดเลือกโหมดไม่ได้เลย" ให้แก้ตรงนี้
  const handleCardClick = (mode) => {
    if (mode.id === "basic" || mode.id === "pro") {
      setActiveModal(mode.id);
    }

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
      // ✅ ส่ง language ไปด้วยผ่าน state (practiceLanguage คือ state ที่เราเลือก TH/EN)
      navigate(`/game/${activeModal}/${levelId}`, {
        state: { language: practiceLanguage },
      });

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

  const basicTHLevel = userProgress["basic_TH"]?.highestPassedLevel || 0;
  const basicENLevel = userProgress["basic_EN"]?.highestPassedLevel || 0;

  // เอาค่าที่มากที่สุด (สมมติเล่น TH ถึงด่าน 5 แต่ EN ถึงด่าน 1 ก็ให้ผ่าน)
  const currentMaxLevel = Math.max(basicTHLevel, basicENLevel);

  const REQUIRED_LEVELS = 5; // ต้องผ่าน 5 ด่าน
  const isProUnlocked = currentMaxLevel >= REQUIRED_LEVELS;

  // ----------------------------------------------------
  // 🔥 2. สร้างตัวแปร Game Mode แบบ Dynamic (เพิ่มใหม่)
  // ----------------------------------------------------
  const dynamicGameModes = GAME_MODES.map((mode) => {
    if (mode.id === "pro") {
      return {
        ...mode,
        isLocked: !isProUnlocked, // ถ้าผ่านเงื่อนไข = ไม่ล็อค
      };
    }
    return mode; // Basic ปล่อยเหมือนเดิม (ตามไฟล์ config)
  });

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* --- Layer 1: Welcome Screen --- */}
      {showWelcome && <WelcomeScreen onStart={handleStartGame} />}

      {/* --- Layer 2: Background --- */}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Layer 3: Main Content --- */}
      <main className="flex flex-col items-center justify-center relative z-10 p-30">
        <HeroSection />

        {/* Mode Selection Grid */}
        <div className="flex flex-col md:flex-row font-itim gap-6 md:gap-8 justify-center items-center w-full max-w-4xl mt-2">
          {/* ✅ ใช้ dynamicGameModes แทน GAME_MODES เดิม */}
          {dynamicGameModes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => {
                // ✅ เช็คก่อนว่าล็อคไหม ถ้าไม่ล็อคค่อยให้กด
                if (!mode.isLocked) {
                  handleCardClick(mode);
                }
              }}
              className={`
                transition-transform duration-300
                ${
                  mode.isLocked
                    ? "cursor-not-allowed opacity-80 grayscale-[0.5]" // Style ตอนล็อค
                    : "cursor-pointer hover:scale-105" // Style ตอนปกติ
                }
              `}
            >
              <div className="relative">
                <ModeCard
                  title={mode.title}
                  level={mode.level}
                  description={mode.description}
                  isLocked={mode.isLocked} // ส่งสถานะล็อคไปให้การ์ดแสดงผล
                  type={mode.id}
                  helpText={
                    mode.id === "basic"
                      ? "ผู้ใช้ต้องเล่นให้ผ่าน 0 รอบ เพื่อปลดล็อคด่านถัดไป🩷"
                      : "ต้องเล่นให้ผ่าน 3 ด่าน ของระดับพื้นฐาน เพื่อปลดล็อค ระดับใช้ได้✌🏻❤️"
                  }
                />

                {/* ✅ เพิ่มข้อความเตือนถ้ายังล็อคอยู่ */}
                {mode.isLocked && (
                  <div className="absolute -bottom-10 left-0 w-full text-center">
                    <span className="text-sm text-red-400 bg-black/50 px-3 py-1 rounded-full border border-red-500/30">
                      🔒 ขาดอีก {Math.max(0, REQUIRED_LEVELS - currentMaxLevel)}{" "}
                      ด่าน
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Layer 4: Floating UI --- */}
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
        isLevelUnlocked={isLevelUnlocked}
        progress={
          activeModal
            ? userProgress[`${activeModal}_${practiceLanguage}`] || {}
            : {}
        }
        onSelect={handleLevelStart}
      />
    </div>
  );
};

export default HomePage;

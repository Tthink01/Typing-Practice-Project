import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; 

// Components
import Floater from "../components/Shared/Floater";
import SummaryPopup from "../components/Shared/SummaryPopup";
import LevelUpgradePopup from "../components/Practice/LevelUpgradePopup"; //
import TypingDisplay from "../components/Practice/TypingDisplay";
import GameInfo from "../components/Practice/GameInfo";
import { useTypingGame } from "../hooks/useTypingGame";

const GameContent = () => {
  const { mode, levelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || "TH";

  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const {
    targetText,
    userInput,
    timeLeft,
    passedCount,
    floaters,
    showSummary,
    finalStats,
    PASS_TARGET,
    TIME_LIMIT,
    history, // ✅ ต้องมีตัวนี้ (และต้องแน่ใจว่าแก้ใน Hook แล้ว)
    inputRef,
    isWin,
    handleInputChange,
    resetRound,
    removeFloater,
  } = useTypingGame(mode, levelId, language);

  // --- Functions ---


  const saveProgress = async () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

        // ยิง API ไปบันทึก
        await axios.post(`${apiUrl}/users/progress`, {
          userId: user._id, // หรือ user.id แล้วแต่โครงสร้างข้อมูลคุณ
          mode: mode,
          level: parseInt(levelId), // แปลงเป็นตัวเลข
          score: 0, // ถ้ามีคะแนนก็ใส่ไป
          wpm: finalStats.wpm,
          accuracy: finalStats.accuracy,
          language: language // ✅ ส่งภาษาไปด้วย (TH/EN)
        });

        console.log("✅ Progress Saved:", mode, levelId, language);
        const storageKey = `pass_count_${mode}_${levelId}_${language}`;
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error("❌ Save Progress Error:", error);
    }
  };

  // ฟังก์ชันรีเซ็ตเกม (ปิด Popup + เริ่มใหม่)
  const handleRestart = () => {
    setShowUpgradePopup(false);
    resetRound();
  };

  // 🔥 Logic หัวใจสำคัญ: ตัดสินใจว่าจะ "ไปต่อ" หรือ "รีเซ็ตเงียบๆ"
  const handleSummaryAction = () => {
    // กรณี 1: ถ้าชนะ -> เปิด Popup เสมอ
    if (isWin) {
      const newPassedCount = passedCount + 1;
      if (newPassedCount >= PASS_TARGET) {
         // 🎉 ถ้าครบแล้ว ให้บันทึกลง Database
         saveProgress();
         setShowUpgradePopup(true);
      return;
      }
    }

    // กรณี 2: ถ้าแพ้
    // เช็คว่าเคยผ่านมาก่อนไหม? (passedCount > 0)
    if (passedCount > 0 || history.length > 0) {
       setShowUpgradePopup(true);
    } else {
       handleRestart();
    }
  };

  const progressPercent = targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;

  return (
    <div
      className="w-full min-h-screen bg-gray-50 dark:bg-stone-950 text-gray-800 dark:text-orange-50 font-sans flex flex-col relative overflow-hidden transition-colors duration-300"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[120px] transition-colors duration-300"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col mt-8 px-4 relative z-10">
        <GameInfo
          mode={mode}
          levelId={levelId}
          onBack={() => navigate("/")}
          passedCount={passedCount}
          passTarget={PASS_TARGET}
          timeLeft={timeLeft}
          onRetry={handleRestart}
        />

        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 shadow-xl dark:shadow-2xl border border-gray-200 dark:border-stone-800 relative flex flex-col min-h-[500px] transition-all duration-300">
          <div className="w-full h-1.5 bg-gray-200 dark:bg-stone-800 rounded-full mb-8 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 transition-all duration-200"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <TypingDisplay
            targetText={targetText}
            userInput={userInput}
            inputRef={inputRef}
            handleInputChange={handleInputChange}
          />
          <div className="mt-12 text-center text-gray-400 dark:text-stone-500 text-sm">
            พิมพ์ให้เร็วและแม่นยำ (Time Limit: {TIME_LIMIT}s)
          </div>
        </div>
      </div>

      {floaters.map((f) => (
        <Floater
          key={f.id}
          x={f.x}
          y={f.y}
          char={f.char}
          isCorrect={f.isCorrect}
          onRemove={() => removeFloater(f.id)}
        />
      ))}

      {/* --- Popups Logic --- */}

      {showSummary && !showUpgradePopup && (
        <SummaryPopup
          stats={finalStats}
          isWin={isWin}
          // ✅ ไม่ว่าจะกดปุ่มไหน ให้วิ่งเข้า handleSummaryAction เพื่อเช็คเงื่อนไขก่อน
          onNext={handleSummaryAction} 
          onRetry={handleSummaryAction}
          onHome={() => navigate("/")}
          isLevelMode={true}
          currentCount={passedCount}
          targetCount={PASS_TARGET}
        />
      )}

      {showUpgradePopup && (
        <LevelUpgradePopup
          isOpen={true}
          // ปุ่ม Next Exam / Try Again ในหน้านี้คือกดแล้วเริ่มใหม่
          onNext={handleRestart} 
          onBack={() => setShowUpgradePopup(false)}
          onHome={() => navigate('/')}
          passCount={passedCount}
          targetCount={PASS_TARGET}
          isWin={isWin}
          history={history} // ✅✅✅ ใส่ตัวนี้เพิ่มเข้าไปครับ สำคัญมาก!
        />
      )}
    </div>
  );
};

const GamePage = () => {
  const { mode, levelId } = useParams();
  return <GameContent key={`${mode}-${levelId}`} />;
};

export default GamePage;
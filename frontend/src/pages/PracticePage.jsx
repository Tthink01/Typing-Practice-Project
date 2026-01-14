import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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

  // ฟังก์ชันรีเซ็ตเกม (ปิด Popup + เริ่มใหม่)
  const handleRestart = () => {
    setShowUpgradePopup(false);
    resetRound();
  };

  // 🔥 Logic หัวใจสำคัญ: ตัดสินใจว่าจะ "ไปต่อ" หรือ "รีเซ็ตเงียบๆ"
  const handleSummaryAction = () => {
    // กรณี 1: ถ้าชนะ -> เปิด Popup เสมอ
    if (isWin) {
      setShowUpgradePopup(true);
      return;
    }

    // กรณี 2: ถ้าแพ้
    // เช็คว่าเคยผ่านมาก่อนไหม? (passedCount > 0)
    if (passedCount > 0) {
       // เคยผ่านแล้ว -> เปิด Popup (เพื่อให้เห็นกากบาทแดงต่อจากช่องเขียว)
       setShowUpgradePopup(true);
    } else {
       // ยังไม่เคยผ่านเลย (ครั้งแรก หรือ ตกซ้ำๆ ตั้งแต่เริ่ม) -> รีเซ็ตเลย ไม่โชว์ Popup
       handleRestart();
    }
  };

  const progressPercent = targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;

  return (
    <div
      className="w-full min-h-screen bg-stone-950 text-orange-50 font-sans flex flex-col relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col mt-8 px-4 relative z-10">
        <GameInfo
          mode={mode}
          levelId={levelId}
          onBack={() => navigate("/")}
          passedCount={passedCount}
          passTarget={PASS_TARGET}
          timeLeft={timeLeft}
          onRetry={handleRestart} // ✅ ใช้ handleRestart
        />

        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-stone-800 relative flex flex-col min-h-[500px]">
          <div className="w-full h-1.5 bg-stone-800 rounded-full mb-8 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-200"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <TypingDisplay
            targetText={targetText}
            userInput={userInput}
            inputRef={inputRef}
            handleInputChange={handleInputChange}
          />
          <div className="mt-12 text-center text-stone-600 text-sm">
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
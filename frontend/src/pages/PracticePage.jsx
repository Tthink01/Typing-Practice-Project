import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Components
import Floater from "../components/Shared/Floater";
import LevelUpgradePopup from "../components/Practice/LevelUpgadePopup"; 
import TypingDisplay from "../components/Practice/TypingDisplay"; 
import GameInfo from "../components/Practice/GameInfo";         
import { useTypingGame } from "../hooks/useTypingGame"; 

// ----------------------------------------------------------------------
// ส่วนที่ 1: GameContent (UI ล้วนๆ)
// ----------------------------------------------------------------------
const GameContent = () => {
  const { mode, levelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || "TH"; 

  // เรียก Logic จาก Hook
  const {
    targetText,
    userInput,
    timeLeft,
    passedCount,
    floaters,
    showSummary,
    // finalStats, // ตัวแปรนี้ไม่ได้ใช้ใน Popup ใหม่ แต่เก็บไว้เผื่ออนาคต
    PASS_TARGET,
    TIME_LIMIT,
    inputRef,
    isWin, // ✅ ต้องใช้ตัวนี้ส่งไปบอก Popup ว่ารอบนี้ผ่านไหม
    handleInputChange,
    resetRound,
    removeFloater
  } = useTypingGame(mode, levelId, language);

  const handleNextAction = () => {
    // ถ้าผ่านครบแล้ว (passedCount >= PASS_TARGET) อาจจะให้ไปหน้าเลือกด่าน หรือด่านถัดไป
    // แต่เบื้องต้นให้ Reset เพื่อเล่นต่อ หรือเริ่มใหม่ตาม Logic เดิม
    resetRound();
  };

  const progressPercent = targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;

  return (
    <div className="w-full min-h-screen bg-stone-950 text-orange-50 font-sans flex flex-col relative overflow-hidden" onClick={() => inputRef.current?.focus()}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col mt-8 px-4 relative z-10">
        
        {/* Header & Stats */}
        <GameInfo 
          mode={mode} 
          levelId={levelId} 
          onBack={() => navigate("/")}
          passedCount={passedCount}
          passTarget={PASS_TARGET}
          timeLeft={timeLeft}
          onRetry={resetRound}
        />

        {/* Game Card */}
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-stone-800 relative flex flex-col min-h-[500px]">
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-stone-800 rounded-full mb-8 overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-200" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
          </div>

          {/* Typing Display */}
          <TypingDisplay 
            targetText={targetText}
            userInput={userInput}
            inputRef={inputRef}
            handleInputChange={handleInputChange}
          />

          <div className="mt-12 text-center text-stone-600 text-sm">พิมพ์ให้เร็วและแม่นยำ (Time Limit: {TIME_LIMIT}s)</div>
        </div>
      </div>

      {/* Floaters */}
      {floaters.map((f) => (
        <Floater 
            key={f.id} 
            x={f.x} y={f.y} 
            char={f.char} 
            isCorrect={f.isCorrect} 
            onRemove={() => removeFloater(f.id)} 
        />
      ))}

      {/* ✅ แก้ไขตรงนี้: ใช้ LevelUpgradePopup แทน SummaryPopup */}
      {showSummary && (
        <LevelUpgradePopup
          isOpen={showSummary}
          onNext={handleNextAction}   // ปุ่ม Next Exam / Try Again จะเรียกฟังก์ชันนี้
          onBack={() => navigate('/')} // ปุ่ม Back
          passCount={passedCount}      // ส่งจำนวนที่ผ่านไป (เพื่อโชว์ 1/3, 2/3)
          targetCount={PASS_TARGET}    // เป้าหมาย (3)
          isWin={isWin}                // ผลรอบล่าสุด (เพื่อโชว์ติ๊กถูกเขียว หรือ กากบาทแดง)
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
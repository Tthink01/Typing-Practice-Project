import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Components
import Floater from "../components/Shared/Floater";
import SummaryPopup from "../components/Shared/SummaryPopup";
import TypingDisplay from "../components/Practice/TypingDisplay"; 
import GameInfo from "../components/Practice/GameInfo";         
import { useTypingGame } from "../hooks/useTypingGame"; // ✅ เรียกใช้ Hook

// ----------------------------------------------------------------------
// ส่วนที่ 1: GameContent (UI ล้วนๆ)
// ----------------------------------------------------------------------
const GameContent = () => {
  const { mode, levelId } = useParams();
  const navigate = useNavigate();

  // ✅ เรียก Logic ทั้งหมดจาก Hook บรรทัดเดียวจบ
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
    inputRef,
    handleInputChange,
    resetRound,
    setShowSummary,
    removeFloater
  } = useTypingGame(mode, levelId);

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
          onReset={resetRound}
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

      {/* Summary Popup */}
      {showSummary && (
        <SummaryPopup
          stats={finalStats}
          onNext={() => {
            if (passedCount >= PASS_TARGET) {
              navigate("/");
            } else {
              setShowSummary(false);
              resetRound(); 
            }
          }}
          isLevelMode={true}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// ส่วนที่ 2: GamePage Wrapper
// ----------------------------------------------------------------------
const GamePage = () => {
  const { mode, levelId } = useParams();
  // ใช้ key เพื่อให้ Hook รีเซ็ตตัวเองเมื่อเปลี่ยนด่าน
  return <GameContent key={`${mode}-${levelId}`} />;
};

export default GamePage;
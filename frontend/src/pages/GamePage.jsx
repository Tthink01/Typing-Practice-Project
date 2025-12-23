import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw, Clock } from "lucide-react";

// --- Components ---
// ตรวจสอบว่า path ถูกต้อง (ถ้ามีปัญหา ให้เช็คไฟล์ ../data/exercises)
import Floater from "../components/Shared/Floater";
import SummaryPopup from "../components/Shared/SummaryPopup";
import { EXERCISES_DATA } from "../data/exercises";

const GamePage = () => {
  const { mode, levelId } = useParams();
  const navigate = useNavigate();

  // --- Configuration ---
  const PASS_TARGET = 3; // ต้องผ่าน 3 รอบ
  const TIME_LIMIT = 30; // เวลา 30 วินาทีต่อรอบ

  // --- Data Fetching ---
  const currentLevelData = EXERCISES_DATA?.[mode]?.["TH"]?.find(
    (l) => l.id === parseInt(levelId, 10)
  );

  // ดึงโจทย์: ถ้า content เป็น Array ให้สุ่ม หรือเอาตัวแรก (ในที่นี้เอาตัวแรกเพื่อความง่าย)
  const getLevelText = () => {
    if (!currentLevelData?.content) return "ไม่พบข้อมูลด่าน";
    if (Array.isArray(currentLevelData.content)) {
      return currentLevelData.content[0];
    }
    return currentLevelData.content;
  };

  // --- States ---
  const [targetText] = useState(getLevelText);
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // Stats & Progress
  const [passedCount, setPassedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  // const [wpm, setWpm] = useState(0); // (ถ้าไม่ใช้ค่า wpm ใน JSX ให้คอมเมนต์ออกเพื่อลด warning)

  // Visuals
  const [floaters, setFloaters] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    accuracy: 0,
    wrongKeys: [],
    fastestKey: "-",
    slowestKey: "-",
  });

  // Refs
  const inputRef = useRef(null);
  const keyTimes = useRef({});
  const lastKeyTime = useRef(0);
  const wrongKeysRef = useRef(new Set());
  const timerRef = useRef(null);
  const startTimeRef = useRef(null); // เปลี่ยนเป็น ref แทน state

  // --- Logic Helpers ---
  // NOTE: resetRound และ handleRoundFail ต้องประกาศแค่ครั้งเดียวเท่านั้น

  const resetRound = useCallback(() => {
    setUserInput("");
    setIsGameActive(false);
    setIsFinished(false);
    setTimeLeft(TIME_LIMIT);
    keyTimes.current = {};
    lastKeyTime.current = 0;
    wrongKeysRef.current = new Set();
    setFloaters([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [TIME_LIMIT]);

  const handleRoundFail = useCallback(() => {
    setIsGameActive(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    setTimeout(() => {
      resetRound();
    }, 1000);
  }, [resetRound]);
  // --- Timer Logic ---
  useEffect(() => {
    if (!isGameActive || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleRoundFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isGameActive, isFinished, handleRoundFail]);

  // Focus Input on Load
  useEffect(() => {
    if (!showSummary) inputRef.current?.focus();
  }, [showSummary]);

  const handleLevelComplete = useCallback(
    (stats) => {
      setIsGameActive(false);
      setIsFinished(true);
      clearInterval(timerRef.current);

      setPassedCount((prev) => {
        const newPassed = prev + 1;
        if (newPassed >= PASS_TARGET) {
          setFinalStats(stats);
          setTimeout(() => setShowSummary(true), 500);
        } else {
          setTimeout(() => resetRound(), 800);
        }
        return newPassed;
      });
    },
    [PASS_TARGET, resetRound]
  );

  // --- Floater Logic ---
  const addFloater = useCallback((char, index, isCorrect) => {
    const el = document.getElementById(`game-char-${index}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setFloaters((prev) => [
        ...prev,
        { id, char, x: rect.left + rect.width / 2, y: rect.top, isCorrect },
      ]);
    }
  }, []);

  // --- Typing Handler ---
  const handleInputChange = (e) => {
    if (showSummary || isFinished) return;
    if (isComposing) return; // ⭐ สำคัญมาก

    const val = e.target.value;
    const now = Date.now();

    // เริ่มจับเวลาเมื่อพิมพ์ตัวแรก
    if (!isGameActive && val.length === 1) {
      setIsGameActive(true);
      startTimeRef.current = now;
    }

    // ห้ามลบ (Optional) — หากต้องการอนุญาตให้ลบ ให้ลบเงื่อนไขนี้ออก
    if (val.length < userInput.length) return;

    if (val.length <= targetText.length) {
      if (val.length > userInput.length) {
        const char = val.slice(-1);
        const index = val.length - 1;
        const targetChar = targetText[index];
        const duration =
          lastKeyTime.current === 0 ? 0 : now - lastKeyTime.current;

        if (!keyTimes.current[char]) keyTimes.current[char] = [];
        keyTimes.current[char].push(duration);

        const isCorrect = char === targetChar;
        if (!isCorrect) wrongKeysRef.current.add(`${targetChar} (${char})`);

        addFloater(char, index, isCorrect);
        lastKeyTime.current = now;
      }

      setUserInput(val);

      // คำนวณ WPM Realtime — ป้องกันหารด้วยศูนย์
      const elapsedSeconds = TIME_LIMIT - timeLeft;
      const elapsedMin = Math.max(elapsedSeconds / 60, 1 / 60);
      const currentWpm = Math.round(val.length / 5 / elapsedMin);
      // setWpm(currentWpm);

      // Check Win Condition
      if (val.length === targetText.length) {
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
          if (val[i] === targetText[i]) correctChars++;
        }
        const accuracy = Math.round((correctChars / val.length) * 100);

        const stats = {
          wpm: currentWpm,
          accuracy,
          wrongKeys: Array.from(wrongKeysRef.current),
          fastestKey: "-",
          slowestKey: "-",
        };

        handleLevelComplete(stats);
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-stone-950 text-orange-50 font-sans flex flex-col relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col mt-8 px-4 relative z-10">
        {/* --- Header: Back & Title --- */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-stone-500 hover:text-orange-500 transition-colors"
          >
            <div className="p-2 rounded-full bg-stone-900 border border-stone-800 hover:border-orange-500/50">
              <ChevronLeft size={20} />
            </div>
            <span className="font-bold">กลับหน้าหลัก</span>
          </button>

          <div className="bg-stone-900 px-4 py-1 rounded-full border border-stone-800 text-stone-400 text-sm font-bold">
            {mode === "basic" ? "Basic" : "Pro"} Level {levelId}
          </div>
        </div>

        {/* --- Game Card --- */}
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-stone-800 relative flex flex-col min-h-[500px]">
          {/* --- Info Bar (Passed & Timer) --- */}
          <div className="flex items-center gap-6 mb-10 pb-6 border-b border-stone-800/50">
            <div className="flex items-center gap-2 text-stone-400 font-mono">
              <span>Passed:</span>
              <span
                className={`text-xl font-bold ${
                  passedCount >= PASS_TARGET
                    ? "text-green-500"
                    : "text-orange-500"
                }`}
              >
                {passedCount}/{PASS_TARGET}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border ${
                timeLeft <= 5
                  ? "bg-red-900/20 border-red-500/50 text-red-400 animate-pulse"
                  : "bg-stone-800 border-stone-700 text-stone-300"
              }`}
            >
              <Clock size={16} />
              <span className="font-mono text-lg tracking-widest">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>

            <button
              onClick={resetRound}
              className="ml-auto p-2 text-stone-600 hover:text-stone-300 transition-colors"
              title="เริ่มใหม่"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* --- Text Display Area --- */}
          
          {/* --- Text Display Area --- */}
<div className="relative font-mono text-3xl md:text-4xl leading-relaxed break-words outline-none select-none flex-grow flex flex-col justify-center">
  <div>
    {targetText.split("").map((char, index) => {
      // 1. เช็คสถานะ
      const isTyped = index < userInput.length;
      const isActive = index === userInput.length; // Cursor
      const isCombining = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/.test(char); // สระ/วรรณยุกต์

      let colorClass = "text-stone-700";
      let extraClass = "";

      // 2. กำหนดสีตัวอักษร
      if (isTyped) {
        colorClass = userInput[index] === char ? "text-stone-200" : "text-red-500 bg-red-500/10 rounded-sm";
      } else if (isActive) {
        colorClass = "text-orange-500 bg-orange-500/20 rounded-sm";
        extraClass = "animate-pulse z-20"; // z-20 เพื่อให้ cursor ของสระทับตัวพยัญชนะ
      }

      // 3. ✨ สูตรจัดวาง (Layout Magic) ✨
      // ใช้หน่วย 'ch' (character unit) ซึ่งแม่นยำมากสำหรับ font-mono
      let positionClass = "inline-block text-center align-bottom";

      if (isCombining) {
        // ✅ สระ/วรรณยุกต์: 
        // w-[1ch] = กว้าง 1 ตัวอักษร (เพื่อให้เห็น BG Cursor)
        // -ml-[1ch] = ถอยหลังกลับไป 1 ตัวอักษร (เพื่อไปซ้อนทับตัวหน้า และคืนพื้นที่ให้ตัวถัดไป)
        positionClass += " w-[1ch] -ml-[1ch] relative z-10"; 
      } else {
        // ✅ ตัวปกติ:
        // w-[1ch] = กว้าง 1 ตัวอักษร
        positionClass += " w-[1ch] relative z-0";
      }

      return (
        <span
          key={index}
          id={`game-char-${index}`}
          className={`${colorClass} ${extraClass} ${positionClass} transition-colors duration-100`}
        >
          {isCombining ? (
            <span className="relative">
               {/* วงกลม: โชว์เฉพาะตอน isActive (กำลังพิมพ์) */}
              <span className={`font-sans absolute top-0 left-1/2 -translate-x-1/2 transition-opacity duration-200 ${isActive ? "opacity-50" : "opacity-0"}`}>
                ◌
              </span>
              <span className="relative">
                 {char}
              </span>
            </span>
          ) : (
             char === " " ? "\u00A0" : char
          )}
        </span>
      );
    })}
  </div>
</div>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default"
            value={userInput}
            onChange={handleInputChange}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              handleInputChange(e); // ค่อยประมวลผลตอนจบ
            }}
            autoComplete="off"
          />

          {/* Footer Text */}
          <div className="mt-12 text-center text-stone-600 text-sm">
            พิมพ์ให้เร็วและแม่นยำ (Time Limit: {TIME_LIMIT}s)
          </div>
        </div>
      </div>

      {/* --- Overlay Elements --- */}
      {floaters.map((f) => (
        <Floater
          key={f.id}
          x={f.x}
          y={f.y}
          char={f.char}
          isCorrect={f.isCorrect}
          onRemove={() =>
            setFloaters((prev) => prev.filter((item) => item.id !== f.id))
          }
        />
      ))}

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

export default GamePage;

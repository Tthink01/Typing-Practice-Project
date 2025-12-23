import React, { useState, useEffect, useRef, useCallback } from "react";
import { Clock } from "lucide-react";

// Components
import DrillHeader from "./DrillHeader";
import TypingArea from "./TypingArea";
import SummaryPopup from "../Modals/SummaryPopup";
import UnlockModal from "../Modals/UnlockModal";
import ResultPopup from "../Modals/ResultPopup";

// Helpers & Constants
import { generateDrillContent, calculateStats } from "../../utils/drillHelpers";
import {
  PASS_ACCURACY_PRO,
  PASS_ACCURACY_BASIC,
  PASS_WPM_PRO,
  PASS_WPM_BASIC,
} from "../../constants/gameConfig";

const PracticeDrill = ({ config, language, onBack, onComplete, progress }) => {
  // --- Constants ---
  const timeLimit = config.type === "basic" ? 30 : 60;
  const requiredAccuracy =
    config.type === "pro" ? PASS_ACCURACY_PRO : PASS_ACCURACY_BASIC;
  const requiredWpm = config.type === "pro" ? PASS_WPM_PRO : PASS_WPM_BASIC;

  // --- Refs ---
  const keyTimes = useRef({});
  const lastKeyTime = useRef(0);
  const wrongKeysRef = useRef(new Set());
  const inputRef = useRef(null);
  // ❌ ลบ isFirstRun ออก (ไม่จำเป็นแล้ว)

  // --- State ---
  
  // ✅ 1. Lazy Init: โหลดโจทย์ครั้งแรกสุด
  // เมื่อ Parent เปลี่ยน key -> Component นี้จะถูกสร้างใหม่ -> บรรทัดนี้จะทำงานใหม่เอง
  const [targetText, setTargetText] = useState(() => 
    generateDrillContent(config.type, config.levelId, language)
  );

  const [userInput, setUserInput] = useState("");
  const [drillState, setDrillState] = useState("typing");
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    wrongKeys: [],
    fastestKey: "",
    slowestKey: "",
  });
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // --- Logic Functions ---

  // ✅ 2. startNewGame เอาไว้ใช้สำหรับปุ่ม "Retry" (เล่นซ้ำด่านเดิม) เท่านั้น
  const startNewGame = useCallback(() => {
    const newText = generateDrillContent(config.type, config.levelId, language);
    setTargetText(newText);
    
    // Batch Reset
    setUserInput("");
    setDrillState("typing");
    setStartTime(null);
    setTimeLeft(timeLimit);
    setStats({ wpm: 0, accuracy: 0, wrongKeys: [], fastestKey: "", slowestKey: "" });
    
    keyTimes.current = {};
    wrongKeysRef.current = new Set();
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [config.type, config.levelId, language, timeLimit]);

  // ✅ 3. Callback จบเกม
  const finishLevel = useCallback(
    (finalInput, isTimeout) => {
      const endTime = Date.now();
      const durationMin = isTimeout
        ? timeLimit / 60
        : (endTime - (startTime || endTime)) / 60000 || 0.001;

      const { wpm, accuracy, fast, slow } = calculateStats(
        finalInput,
        targetText,
        durationMin,
        keyTimes.current
      );

      const isPass =
        wpm >= requiredWpm && accuracy >= requiredAccuracy && !isTimeout;

      const wrongKeysList = Array.from(wrongKeysRef.current).slice(0, 20);

      const resultStats = {
        wpm,
        accuracy,
        wrongKeys: wrongKeysList,
        fastestKey: fast.char !== "-" ? `${fast.char} (${Math.round(fast.time)}ms)` : "-",
        slowestKey: slow.char !== "-" ? `${slow.char} (${Math.round(slow.time)}ms)` : "-",
      };

      setStats(resultStats);
      setDrillState("summary");
      onComplete(resultStats, isPass);
    },
    [startTime, timeLimit, targetText, onComplete, requiredAccuracy, requiredWpm]
  );

  // --- Effects ---

  // ❌ ลบ useEffect ที่คอย watch config ออกไปเลย (ต้นเหตุ Error)
  // เพราะเราจะใช้ key prop ใน Parent แทน

  // 4. Timer Effect
  useEffect(() => {
    let interval = null;
    if (startTime && drillState === "typing" && timeLeft > 0) {
      interval = setInterval(
        () => setTimeLeft((p) => (p <= 1 ? 0 : p - 1)),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [startTime, drillState, timeLeft]);

  // 5. Timeout Check Effect
  useEffect(() => {
    if (timeLeft === 0 && drillState === "typing" && startTime) {
      finishLevel(userInput, true);
    }
  }, [timeLeft, drillState, startTime, userInput, finishLevel]);

  // --- Handlers ---
  const handleInput = (e) => {
    if (drillState !== "typing" || timeLeft === 0) return;
    const val = e.target.value;
    if (val.length < userInput.length) return; 

    const now = Date.now();
    if (!startTime && val.length === 1) {
      setStartTime(now);
      lastKeyTime.current = now;
    }

    if (val.length > userInput.length && startTime) {
      const char = val.slice(-1);
      const duration = now - lastKeyTime.current;
      if (!keyTimes.current[char]) keyTimes.current[char] = [];
      keyTimes.current[char].push(duration);

      const expectedChar = targetText[val.length - 1];
      if (char !== expectedChar) wrongKeysRef.current.add(expectedChar);
      lastKeyTime.current = now;
    }

    setUserInput(val);
    
    if (val.length >= targetText.length) {
      finishLevel(val, false);
    }
  };

  // ปุ่ม Retry
  const resetLevel = () => {
    startNewGame();
  };

  // --- Render ---
  const progressPercent =
    targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 animate-fade-in relative min-h-[80vh]">
      <DrillHeader
        onBack={onBack}
        type={config.type}
        levelId={config.levelId}
        language={language}
      />

      {/* Main Container */}
      <div className="bg-stone-900 rounded-3xl p-6 md:p-12 shadow-2xl border border-stone-800 relative">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-stone-800 rounded-full mb-8 overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-200"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-stone-400 text-sm">
            Passed:{" "}
            <span className="font-bold text-orange-400">{progress}/3</span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
              timeLeft <= 10
                ? "border-red-500/30 text-red-400"
                : "border-stone-700 text-stone-300"
            }`}
          >
            <Clock size={16} />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>

        {/* Typing Area */}
        <TypingArea
          targetText={targetText}
          userInput={userInput}
          inputRef={inputRef}
          handleInput={handleInput}
        />

        <div className="mt-16 text-center text-stone-600 text-sm">
          {drillState !== "typing"
            ? "เสร็จสิ้น!"
            : `พิมพ์ให้เร็วและแม่นยำ (WPM ${requiredWpm}+, Acc ${requiredAccuracy}%)`}
        </div>
      </div>

      {/* Modals */}
      {drillState === "summary" && (
        <SummaryPopup
          stats={stats}
          onRetry={resetLevel}
        />
      )}
      
      {drillState === "unlock" && (
        <UnlockModal 
            // Props...
        />
      )}
      
      {drillState === "levelup" && (
        <ResultPopup 
            // Props...
        />
      )}
    </div>
  );
};

export default PracticeDrill;
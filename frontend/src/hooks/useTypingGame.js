import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { EXERCISES_DATA } from "../data/exercises";
import { GAME_CONFIG } from "../utils/gameRule";

// ✅ 1. เพิ่ม parameter 'language' เข้ามา
export const useTypingGame = (mode, levelId, language) => {
  const PASS_TARGET = GAME_CONFIG.PASS_REQUIRED_COUNT;
  const TIME_LIMIT = GAME_CONFIG.TIME_LIMIT_SEC;

  // --- Helpers ---
  const getLevelContent = useCallback(() => {
    // ✅ 2. ใช้ [language] แทนการ Hardcode ["TH"]
    // จะได้ดึงข้อมูลจาก EXERCISES_DATA.basic.TH หรือ EXERCISES_DATA.basic.EN ตามที่ส่งมา
    const currentLevelData = EXERCISES_DATA?.[mode]?.[language]?.find(
      (l) => l.id === parseInt(levelId, 10)
    );

    if (!currentLevelData?.content) return "ไม่พบข้อมูลด่าน";
    if (Array.isArray(currentLevelData.content)) {
      return currentLevelData.content[0];
    }
    return currentLevelData.content;
  }, [mode, levelId, language]); // อย่าลืมใส่ language ใน dependency

  // --- States ---
  // เพิ่ม setTargetText เพื่อให้อัปเดตโจทย์ได้
  const [targetText, setTargetText] = useState(() => getLevelContent());
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [passedCount, setPassedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [floaters, setFloaters] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    accuracy: 0,
    wrongKeys: [],
    fastestKey: "-",
    slowestKey: "-",
  });

  // --- Refs ---
  const inputRef = useRef(null);
  const keyTimes = useRef({});
  const lastKeyTime = useRef(0);
  const wrongKeysRef = useRef(new Set());
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // --- Core Logic ---

  // ✅ เพิ่ม Effect: เมื่อเปลี่ยนด่านหรือภาษา ให้โหลดโจทย์ใหม่ทันที
  useEffect(() => {
    setTargetText(getLevelContent());
    resetRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, language, getLevelContent]);

  const resetRound = useCallback(() => {
    setUserInput("");
    setIsGameActive(false);
    setIsFinished(false);
    setTimeLeft(TIME_LIMIT);
    keyTimes.current = {};
    lastKeyTime.current = 0;
    wrongKeysRef.current = new Set();
    setFloaters([]);
    startTimeRef.current = null;

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

  // Timer Effect
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

  // Auto Focus
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

        // ถ้าผ่านครบตามเป้า
        if (newPassed >= PASS_TARGET) {
          setFinalStats(stats);

          // -------------------------------------------------------------
          // ✅ 3. Logic บันทึก Progress (อัปเดตให้ส่ง language)
          // -------------------------------------------------------------
          const storedUser = localStorage.getItem("currentUser");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);

              axios
                .post("http://localhost:3001/users/progress", {
                  userId: user._id,
                  mode: mode,
                  language: language, // ✅ ส่งภาษาไปด้วย (TH หรือ EN)
                  level: parseInt(levelId), // ✅ เปลี่ยนชื่อ key เป็น level ให้ตรงกับ Backend
                  score: stats.wpm,
                  wpm: stats.wpm, // ส่ง wpm เพิ่มเผื่อไว้
                  accuracy: stats.accuracy, // ส่ง accuracy เพิ่มเผื่อไว้
                })
                .then((res) => {
                  console.log("Progress Saved:", res.data);

                  if (res.data.progress) {
                    user.progress = res.data.progress;
                    localStorage.setItem("currentUser", JSON.stringify(user));
                  }
                })
                .catch((err) => {
                  console.error("Failed to save progress:", err);
                });
            } catch (e) {
              console.error("Error parsing user data:", e);
            }
          }
          // -------------------------------------------------------------

          setTimeout(() => setShowSummary(true), 500);
        } else {
          // ถ้ายังไม่ครบ ให้เล่นรอบถัดไป
          setTimeout(() => resetRound(), 800);
        }
        return newPassed;
      });
    },
    [PASS_TARGET, resetRound, mode, levelId, language] // ✅ เพิ่ม language ใน dependency
  );

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

  const handleInputChange = (e) => {
    if (showSummary || isFinished) return;
    if (isComposing) return;

    const val = e.target.value;
    const now = Date.now();

    if (!isGameActive && val.length === 1) {
      setIsGameActive(true);
      startTimeRef.current = now;
    }

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

      if (val.length === targetText.length) {
        const elapsedSeconds = TIME_LIMIT - timeLeft;
        const elapsedMin = Math.max(elapsedSeconds / 60, 1 / 60);
        const currentWpm = Math.round(val.length / 5 / elapsedMin);

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

  const removeFloater = (id) => {
    setFloaters((prev) => prev.filter((item) => item.id !== id));
  };

  return {
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
    setIsComposing,
    resetRound,
    setShowSummary,
    removeFloater,
  };
};

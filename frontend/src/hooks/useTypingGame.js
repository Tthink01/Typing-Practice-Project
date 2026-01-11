import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { EXERCISES_DATA } from "../data/exercises";
import { GAME_CONFIG } from "../utils/gameRule";

export const useTypingGame = (mode, levelId, language) => {
  // ✅ 1. ดึง Config แบบปลอดภัย
  const safeMode = mode?.toLowerCase() === "pro" ? "PRO" : "BASIC";
  const config = GAME_CONFIG[safeMode];

  const PASS_TARGET = GAME_CONFIG.PASS_REQUIRED_COUNT;
  const TIME_LIMIT = GAME_CONFIG.TIME_LIMIT_SEC;

  // --- States ---
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const [passedCount, setPassedCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [floaters, setFloaters] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  
  // State เช็คผลแพ้ชนะ
  const [isWin, setIsWin] = useState(false); 
  
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

  // --- Helpers ---

  // 🔥 ฟังก์ชันสลับตำแหน่ง (Shuffle)
  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // 🔥 ปรับ Logic การดึงโจทย์
  const getLevelContent = useCallback(() => {
    const currentLevelData = EXERCISES_DATA?.[mode]?.[language]?.find(
      (l) => l.id === parseInt(levelId, 10)
    );
    if (!currentLevelData?.content) return "ไม่พบข้อมูลด่าน";

    const isProMode = (mode || "").toLowerCase() === "pro";
    let rawContent;

    if (Array.isArray(currentLevelData.content)) {
      const randomIndex = Math.floor(Math.random() * currentLevelData.content.length);
      rawContent = currentLevelData.content[randomIndex];
    } else {
      rawContent = currentLevelData.content;
    }

    if (isProMode) {
      return rawContent;
    }

    const wordsArray = rawContent.trim().split(/\s+/);
    const shuffledWords = shuffleArray(wordsArray);
    const selectedWords = shuffledWords.slice(0, 15);

    return selectedWords.join(" ");
  }, [mode, levelId, language]);

  // ✅ 2. รีเซ็ตเกมเมื่อเปลี่ยนด่าน
  useEffect(() => {
    setTargetText(getLevelContent()); 
    setPassedCount(0);
    resetRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, language]); 

  // ฟังก์ชันรีเซ็ตกระดาน
  const resetRound = useCallback(() => {
    setTargetText(getLevelContent());

    setUserInput("");
    setIsGameActive(false);
    setIsFinished(false);
    setTimeLeft(TIME_LIMIT);
    keyTimes.current = {};
    lastKeyTime.current = 0;
    wrongKeysRef.current = new Set();
    setFloaters([]);
    startTimeRef.current = null;
    setShowSummary(false); 

    setTimeout(() => inputRef.current?.focus(), 50);
  }, [TIME_LIMIT, getLevelContent]); 

  // 🔥 แก้ไข: ฟังก์ชันบันทึก รับค่า stats โดยตรง (ไม่รอ State)
  const saveProgressToBackend = (currentStats) => {
    const cleanMode = mode ? mode.toLowerCase() : "basic";
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      console.log("Saving Progress...", { mode: cleanMode, level: levelId });

      axios
        .post("http://localhost:3001/users/progress", {
          userId: user._id,
          mode: cleanMode,
          language: language,
          level: parseInt(levelId),
          score: currentStats.wpm,     // ใช้ค่าจาก parameter
          wpm: currentStats.wpm,       // ใช้ค่าจาก parameter
          accuracy: currentStats.accuracy, // ใช้ค่าจาก parameter
        })
        .then((res) => {
          console.log("Progress Saved Successfully:", res.data);
          if (res.data.progress) {
            user.progress = res.data.progress;
            localStorage.setItem("currentUser", JSON.stringify(user));
          }
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoundFail = useCallback(() => {
    setIsGameActive(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    alert("หมดเวลา! ลองใหม่อีกครั้ง");
    setTimeout(() => resetRound(), 1000);
  }, [resetRound]);

  // Timer Counting
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

  // ✅ 4. ฟังก์ชันจบด่าน (Logic ใหม่ + Save ทันที)
  const handleLevelComplete = useCallback(
    (stats) => {
      setIsGameActive(false);
      setIsFinished(true);
      clearInterval(timerRef.current);

      const isPassCriteria =
        stats.accuracy >= config.MIN_ACCURACY && stats.wpm >= config.MIN_WPM;

      setFinalStats({ ...stats, isPassed: isPassCriteria });  
      setIsWin(isPassCriteria);

      let nextPassedCount = passedCount;

      if (isPassCriteria) {
        console.log("Passed! Checking count...");
        
        // ถ้ายังไม่ครบ 3 ให้บวกเพิ่ม
        if (passedCount < PASS_TARGET) {
           nextPassedCount = passedCount + 1;
           setPassedCount(nextPassedCount);
        }

        // 🔥 เช็คเงื่อนไขตรงนี้เลย: ถ้าครบ 3 รอบ (หรือมากกว่า) ให้บันทึกทันที!
        if (nextPassedCount >= PASS_TARGET) {
             console.log("Target Reached! Saving to backend...");
             saveProgressToBackend(stats); // ส่ง stats เข้าไปบันทึกเลย
        }

      } else {
        console.log("Failed Criteria. Count remains same.");
      }

      setShowSummary(true);
    },
    [config, PASS_TARGET, passedCount, mode, levelId, language]
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

        const processKeyStats = () => {
          const times = keyTimes.current;
          const processed = Object.entries(times).map(([char, timeArr]) => {
            const avgTime = timeArr.reduce((a, b) => a + b, 0) / timeArr.length;
            return { char, time: Math.round(avgTime) };
          });

          if (processed.length === 0) return { fastest: [], slowest: [] };
          processed.sort((a, b) => a.time - b.time);

          const fastest = processed.slice(0, 3).map((k) => ({
            char: k.char,
            time: k.time,
            percent: Math.min(100, Math.max(10, (1 - k.time / 500) * 100)),
          }));

          const slowest = [...processed]
            .sort((a, b) => b.time - a.time)
            .slice(0, 3)
            .map((k) => ({
              char: k.char,
              time: k.time,
              percent: Math.min(100, (k.time / 1000) * 100),
            }));

          return { fastest, slowest };
        };

        const { fastest, slowest } = processKeyStats();

        const stats = {
          wpm: currentWpm,
          accuracy,
          wrongKeys: Array.from(wrongKeysRef.current),
          fastestKeys: fastest,
          slowestKeys: slowest,
          fastestKey: fastest.length > 0 ? fastest[0].char : "-",
          slowestKey: slowest.length > 0 ? slowest[0].char : "-",
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
    isWin, 
    handleInputChange,
    setIsComposing,
    resetRound,
    setShowSummary,
    removeFloater,
  };
};
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { EXERCISES_DATA } from "../data/exercises";
import { GAME_CONFIG } from "../utils/gameRule";

export const useTypingGame = (mode, levelId, language) => {
  // ✅ 1. ดึง Config แบบปลอดภัย (รองรับทั้ง "basic", "Basic", "pro", "Pro")
  const safeMode = mode?.toLowerCase() === "pro" ? "PRO" : "BASIC";
  const config = GAME_CONFIG[safeMode]; // ดึงเกณฑ์คะแนน (MIN_ACCURACY, MIN_WPM)

  const PASS_TARGET = GAME_CONFIG.PASS_REQUIRED_COUNT;
  const TIME_LIMIT = GAME_CONFIG.TIME_LIMIT_SEC;

  // --- States ---
  const [targetText, setTargetText] = useState(""); 
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  
  // ตัวนับรอบ (0/3)
  const [passedCount, setPassedCount] = useState(0); 

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [floaters, setFloaters] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [finalStats, setFinalStats] = useState({
    wpm: 0, accuracy: 0, wrongKeys: [], fastestKey: "-", slowestKey: "-",
  });

  // --- Refs ---
  const inputRef = useRef(null);
  const keyTimes = useRef({});
  const lastKeyTime = useRef(0);
  const wrongKeysRef = useRef(new Set());
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // --- Helpers ---
  const getLevelContent = useCallback(() => {
    // ดึงโจทย์ตามภาษา (TH/EN)
    const currentLevelData = EXERCISES_DATA?.[mode]?.[language]?.find(
      (l) => l.id === parseInt(levelId, 10)
    );
    if (!currentLevelData?.content) return "ไม่พบข้อมูลด่าน";
    return Array.isArray(currentLevelData.content) ? currentLevelData.content[0] : currentLevelData.content;
  }, [mode, levelId, language]);

  // ✅ 2. รีเซ็ตเกมเมื่อเปลี่ยนด่าน
  useEffect(() => {
    setTargetText(getLevelContent());
    setPassedCount(0); // รีเซ็ตตัวนับเป็น 0
    resetRound(); 
  }, [levelId, language, getLevelContent]);

  // ฟังก์ชันรีเซ็ตกระดาน
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

  // ✅ 3. Logic จัดการเมื่อตัวเลข passedCount เปลี่ยน (Save หรือ ไปต่อ)
  useEffect(() => {
    if (passedCount === 0) return;

    // ถ้าผ่านครบตามเป้า (เช่น 3/3)
    if (passedCount >= PASS_TARGET) {
      saveProgressToBackend(); // บันทึกข้อมูล
      setTimeout(() => setShowSummary(true), 500); // แสดงหน้าสรุป
    } else {
      // ถ้ายังไม่ครบ (เช่น 1/3) -> รีเซ็ตกระดานเล่นต่อ
      setTimeout(() => resetRound(), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedCount, PASS_TARGET]);

  // ฟังก์ชันบันทึกข้อมูล (แยกออกมาให้ชัดเจน)
  const saveProgressToBackend = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      
      axios.post("http://localhost:3001/users/progress", {
        userId: user._id,
        mode: mode,
        language: language,
        level: parseInt(levelId),
        score: finalStats.wpm, 
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
      })
      .then((res) => {
        console.log("Progress Saved:", res.data);
        // อัปเดต localStorage เพื่อให้หน้า Home รู้ทันที
        if (res.data.progress) {
          user.progress = res.data.progress;
          localStorage.setItem("currentUser", JSON.stringify(user));
        }
      })
      .catch((err) => console.error(err));
    } catch (e) { console.error(e); }
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

  // ✅ 4. ฟังก์ชันจบด่าน (หัวใจสำคัญ: ตรวจสอบเกณฑ์)
  const handleLevelComplete = useCallback((stats) => {
      setIsGameActive(false);
      setIsFinished(true);
      clearInterval(timerRef.current);
      setFinalStats(stats); // เก็บสถิติไว้ก่อน

      // --- LOGIC ตรวจคะแนน (ของจริง) ---
      // ต้องแม่นยำ >= ค่าที่ตั้งไว้ และ ความเร็ว >= ค่าที่ตั้งไว้
      const isPassCriteria = stats.accuracy >= config.MIN_ACCURACY && stats.wpm >= config.MIN_WPM;

      if (!isPassCriteria) {
        // ❌ ถ้าไม่ผ่าน: แจ้งเตือน + รีเซ็ต + ไม่นับคะแนน
        alert(
            `ไม่ผ่านเกณฑ์! ❌\n` +
            `ความแม่นยำของคุณ: ${stats.accuracy}% (ต้องการ ${config.MIN_ACCURACY}%)\n` +
            `ความเร็วของคุณ: ${stats.wpm} WPM (ต้องการ ${config.MIN_WPM} WPM)`
        );
        setTimeout(() => resetRound(), 1000);
        return; // 🛑 จบการทำงาน ไม่ไปบรรทัดถัดไป
      }

      // 🟢 ถ้าผ่านเกณฑ์: สั่งบวกเลข (เดี๋ยว useEffect ด้านบนจะทำงานต่อเอง)
      console.log("Passed Criteria! Incrementing count...");
      setPassedCount((prev) => prev + 1);
    },
    [config, resetRound]
  );

  const addFloater = useCallback((char, index, isCorrect) => {
    const el = document.getElementById(`game-char-${index}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setFloaters((prev) => [...prev, { id, char, x: rect.left + rect.width / 2, y: rect.top, isCorrect }]);
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
        const duration = lastKeyTime.current === 0 ? 0 : now - lastKeyTime.current;

        if (!keyTimes.current[char]) keyTimes.current[char] = [];
        keyTimes.current[char].push(duration);

        const isCorrect = char === targetChar;
        if (!isCorrect) wrongKeysRef.current.add(`${targetChar} (${char})`);

        addFloater(char, index, isCorrect);
        lastKeyTime.current = now;
      }

      setUserInput(val);

      if (val.length === targetText.length) {
        // คำนวณ Stats
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
    targetText, userInput, timeLeft, passedCount, floaters, showSummary, finalStats,
    PASS_TARGET, TIME_LIMIT, inputRef,
    handleInputChange, setIsComposing, resetRound, setShowSummary, removeFloater,
  };
};
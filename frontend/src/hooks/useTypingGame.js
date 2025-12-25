import { useState, useEffect, useRef, useCallback } from "react";
import { EXERCISES_DATA } from "../data/exercises";

export const useTypingGame = (mode, levelId) => {
  const PASS_TARGET = 3;
  const TIME_LIMIT = 30;

  // --- Helpers ---
  const getLevelContent = useCallback(() => {
    const currentLevelData = EXERCISES_DATA?.[mode]?.["TH"]?.find(
      (l) => l.id === parseInt(levelId, 10)
    );
    
    if (!currentLevelData?.content) return "ไม่พบข้อมูลด่าน";
    if (Array.isArray(currentLevelData.content)) {
      return currentLevelData.content[0];
    }
    return currentLevelData.content;
  }, [mode, levelId]);

  // --- States ---
  const [targetText, ] = useState(() => getLevelContent());
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
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

  // --- Core Logic ---
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
    // Data
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
    
    // Actions
    handleInputChange,
    setIsComposing,
    resetRound,
    setShowSummary,
    removeFloater
  };
};
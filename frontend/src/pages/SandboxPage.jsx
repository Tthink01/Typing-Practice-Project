import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw, Globe } from "lucide-react";
import axios from "axios";


// Components


// New Components (Shared)
import Floater from "../components/Shared/Floater";
import SummaryPopup from "../components/Shared/SummaryPopup";

import { getRandomText } from "../data/wordList";

const SandboxPage = () => {
  const navigate = useNavigate();
  const TOTAL_WORDS = 40;

  // --- States ---
  const [lang, setLang] = useState("TH");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(true);
  const [targetText, setTargetText] = useState(() => {
    try {
      return getRandomText("TH", TOTAL_WORDS) || "";
    } catch (e) {
      console.error("Error getting random text:", e);
      return "";
    }
  });

  // --- Stats & Logic States ---
  const [, setStartTime] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    accuracy: 0,
    wrongKeys: [],
    fastestKey: "-",
    slowestKey: "-",
  });
  const [floaters, setFloaters] = useState([]);

  // Refs
  const inputRef = useRef(null);
  const keyTimes = useRef({});
  const lastKeyTime = useRef(0);
  const wrongKeysRef = useRef(new Set());

  // คำนวณ Progress Bar
  const progressPercent =
    targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;
  const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length;

  const isSavedRef = useRef(false);

  // --- Effects ---
  useEffect(() => {
    if (isGameActive && !showSummary) {
      inputRef.current?.focus();
    }
  }, [isGameActive, showSummary, targetText]);

  // --- Helper: Reset Logic ---
  const resetLogic = () => {
    setStartTime(null);
    keyTimes.current = {};
    lastKeyTime.current = 0;
    wrongKeysRef.current = new Set();
    setFloaters([]);
    setShowSummary(false);

    isSavedRef.current = false;
  };

  const startNewGame = (selectedLang = lang) => {
    setLang(selectedLang);
    setIsGameActive(false);
    resetLogic();

    setTimeout(() => {
      setTargetText(getRandomText(selectedLang, TOTAL_WORDS));
      setUserInput("");
      setIsGameActive(true);
    }, 50);
  };

  // --- Floater Logic ---
  const addFloater = useCallback((char, index, isCorrect) => {
    const el = document.getElementById(`sb-char-${index}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setFloaters((prev) => [
        ...prev,
        {
          id,
          char,
          x: rect.left + rect.width / 2,
          y: rect.top,
          isCorrect,
        },
      ]);
    }
  }, []);

  const saveSandboxResult = async (wpm, accuracy, language) => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

        await axios.post(`${apiUrl}/users/${user.username}/sandbox`, {
          wpm,
          accuracy,
          language,
        });
        console.log("✅ Saved sandbox result to DB");
      }
    } catch (error) {
      console.error("❌ Save sandbox error:", error);
    }
  };

  // --- Typing Handler ---
  const handleInputChange = useCallback(
    (e) => {
      if (!isGameActive || showSummary) return;

      const val = e.target.value;
      const now = Date.now();

      if (val.length < userInput.length) return;

      if (val.length <= targetText.length) {
        if (val.length === 1 && userInput.length === 0) {
          setStartTime(now);
          lastKeyTime.current = now;
        }

        if (val.length > userInput.length) {
          const char = val.slice(-1);
          const index = val.length - 1;
          const targetChar = targetText[index];
          const duration =
            lastKeyTime.current === 0 ? 0 : now - lastKeyTime.current;

          if (!keyTimes.current[char]) keyTimes.current[char] = [];
          keyTimes.current[char].push(duration);

          const isCorrect = char === targetChar;
          if (!isCorrect) {
            wrongKeysRef.current.add(targetChar + " (" + char + ")");
          }

          addFloater(char, index, isCorrect);
          lastKeyTime.current = now;
        }

        setUserInput(val.normalize("NFC"));

        if (val.length === targetText.length) {
          setIsGameActive(false);
          const endTime = Date.now();
          setStartTime((currentStartTime) => {
            const startT = currentStartTime || endTime;
            const durationMin = (endTime - startT) / 60000 || 0.001;
            const wpm = Math.round(val.length / 5 / durationMin);

            let correctChars = 0;
            for (let i = 0; i < val.length; i++) {
              if (val[i] === targetText[i]) correctChars++;
            }
            const accuracy = Math.round((correctChars / val.length) * 100);

            // ... (โค้ดส่วนคำนวณ fast/slow เหมือนเดิม) ...
            let fast = { char: "-", time: Infinity };
            let slow = { char: "-", time: 0 };
            Object.entries(keyTimes.current).forEach(([char, times]) => {
              const avg = times.reduce((a, b) => a + b, 0) / times.length;
              if (avg < fast.time) fast = { char, time: avg };
              if (avg > slow.time) slow = { char, time: avg };
            });

            const processStatsArray = () => {
              const times = keyTimes.current;
              const processed = Object.entries(times).map(([char, timeArr]) => {
                const avgTime =
                  timeArr.reduce((a, b) => a + b, 0) / timeArr.length;
                return { char, time: Math.round(avgTime) };
              });
              processed.sort((a, b) => a.time - b.time);
              const fastArr = processed
                .slice(0, 3)
                .map((k) => ({ ...k, percent: 100 }));
              const slowArr = [...processed]
                .sort((a, b) => b.time - a.time)
                .slice(0, 3)
                .map((k) => ({ ...k, percent: 100 }));
              return { fastArr, slowArr };
            };
            const { fastArr, slowArr } = processStatsArray();

            setFinalStats({
              wpm,
              accuracy,
              wrongKeys: Array.from(wrongKeysRef.current),
              fastestKeys: fastArr,
              slowestKeys: slowArr,
              fastestKey:
                fast.char !== "-"
                  ? `${fast.char} (${Math.round(fast.time)}ms)`
                  : "-",
              slowestKey:
                slow.char !== "-"
                  ? `${slow.char} (${Math.round(slow.time)}ms)`
                  : "-",
            });

            // ✅✅✅ แก้ไขตรงนี้ครับ (เพิ่ม if เช็ค isSavedRef และส่ง lang ไปด้วย) ✅✅✅
            if (!isSavedRef.current) {
              isSavedRef.current = true; // ล็อคทันทีกันซ้ำ
              saveSandboxResult(wpm, accuracy, lang); // ส่งภาษา (lang) ไปด้วย
            }
            return currentStartTime;
          });

          setTimeout(() => setShowSummary(true), 500);
        }
      }
      // ✅✅✅ เพิ่ม lang ใน dependency array ด้วยครับ ✅✅✅
    },
    [isGameActive, showSummary, userInput, targetText, addFloater, lang],
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-stone-950 text-gray-800 dark:text-orange-50 font-sans flex flex-col relative overflow-hidden pt-20 transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[120px] transition-colors duration-300"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full h-full flex flex-col mt-8 relative z-20 px-4 flex-grow">
        {/* Header Control */}
        <div className="flex justify-between items-center mb-6 pl-2 md:pl-0 w-full">
          {/* ปุ่มย้อนกลับ (ซ้าย) */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group z-50"
          >
            <div className="p-2 rounded-full bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 group-hover:border-orange-500/50 transition-colors shadow-lg">
              <ChevronLeft size={20} />
            </div>
            <span className="text-sm font-bold">กลับเมนูหลัก</span>
          </button>

          {/* ปุ่มเปลี่ยนภาษา (ขวา) */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-900 rounded-full p-1 border border-gray-200 dark:border-stone-800 shadow-xl z-50 transition-colors">
            <div className="px-3 flex items-center gap-2 text-gray-500 dark:text-stone-400">
              <Globe size={14} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                Lang:
              </span>
            </div>

            {["TH", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => startNewGame(l)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                  lang === l
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-500 dark:text-stone-500 hover:bg-gray-100 dark:hover:bg-stone-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {l === "TH" ? "ไทย" : "Eng"}
              </button>
            ))}
          </div>
        </div>

        {/* Typing Area Card */}
        <div
          className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-12 shadow-xl dark:shadow-2xl border border-gray-200 dark:border-stone-800 relative flex-grow max-h-[600px] flex flex-col z-10 transition-colors duration-300"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-200 dark:bg-stone-800 rounded-full mb-8 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(249,115,22,0.6)]"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          {/* Stats Header */}
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex gap-6 items-baseline">
              <div className="text-gray-500 dark:text-stone-400 text-sm">
                Mode:{" "}
                <span className="text-orange-600 dark:text-orange-400 font-bold">Speed Test</span>
              </div>
              <div className="text-gray-500 dark:text-stone-400 text-sm">
                Words:{" "}
                <span className="text-gray-900 dark:text-white font-bold">
                  {wordCount} / {TOTAL_WORDS}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startNewGame(lang);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg text-gray-400 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors group"
            >
              <RefreshCw
                size={20}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
            </button>
          </div>

          {/* Text Display Area */}
          <div
            className="relative font-mono text-2xl md:text-3xl break-words flex-grow overflow-y-auto custom-scrollbar outline-none cursor-text select-none pt-4"
            style={{
              letterSpacing: "0.05em",
              lineHeight: "2em",
              whiteSpace: "pre-wrap",
            }}
          >
            {targetText.split("").map((char, index) => {
              let colorClass = "text-gray-400 dark:text-stone-600";
              let borderClass = "";
              let extraClass = "";

              if (index < userInput.length) {
                if (userInput[index] === char) {
                  colorClass = "text-gray-900 dark:text-stone-100";
                } else {
                  colorClass = "text-red-500 bg-red-100 dark:bg-red-500/10 rounded";
                }
              } else if (index === userInput.length) {
                colorClass = "text-orange-600 dark:text-orange-400";
                borderClass = "border-b-2 border-orange-500 dark:border-orange-400";
                extraClass = "animate-pulse";
              }

              const isCombining = /[\u0E31\u0E33\u0E34-\u0E3A\u0E47-\u0E4E]/.test(
                char,
              );
              const finalChar =
                index === userInput.length && isCombining ? (
                  <>
                    <span className="opacity-50 font-sans">◌</span>
                    {char}
                  </>
                ) : (
                  char
                );

              return (
                <span
                  id={`sb-char-${index}`}
                  key={index}
                  className={`${colorClass} ${borderClass} ${extraClass} transition-colors duration-100 inline min-w-[1px] relative`}
                >
                  {finalChar}
                </span>
              );
            })}

            <input
              ref={inputRef}
              type="text"
              className="absolute opacity-0 top-0 left-0 w-full h-full cursor-text"
              value={userInput}
              onChange={handleInputChange}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-stone-800 flex justify-center text-gray-500 dark:text-stone-500 text-sm">
            กดปุ่มใดก็ได้เพื่อเริ่มพิมพ์ทดสอบความเร็ว
          </div>
        </div>
      </div>

      {/* Floater & Popup */}
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

      {/* ✅✅✅ แก้ไขส่วน Popup ตรงนี้ครับ ✅✅✅ */}
      {showSummary && (
        <SummaryPopup
          stats={finalStats}
          isWin={true}
          onRetry={() => startNewGame(lang)}
          onHome={() => navigate("/")}
          onNext={() => startNewGame(lang)}
          currentCount={0}
          isSandbox={true} // 👈 เพิ่มบรรทัดนี้ครับ
        />
      )}
    </div>
  );
};

export default SandboxPage;

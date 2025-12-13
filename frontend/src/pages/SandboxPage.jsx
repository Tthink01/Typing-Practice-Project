import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import TypingStats from "../components/Sandbox/TypingStats";
import TypingArea from "../components/Sandbox/TypingArea";
import { getRandomText } from "../data/wordList";

const SandboxPage = () => {
  const navigate = useNavigate();

  const TOTAL_WORDS = 40;
  const [lang, setLang] = useState("TH");
  const [userInput, setUserInput] = useState("");
  const [targetText, setTargetText] = useState(() =>
    getRandomText("TH", TOTAL_WORDS)
  );

  const resetGame = () => {
    setTargetText(getRandomText(lang, TOTAL_WORDS));
    setUserInput("");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= targetText.length) {
      setUserInput(val);
    }
  };

  const startNewGame = (lang) => {
    setLang(lang);
    setTargetText(getRandomText(lang, TOTAL_WORDS));
    setUserInput("");
  };

  const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold group"
        >
          <div className="p-2 rounded-full bg-stone-900 border border-stone-800 group-hover:border-orange-500/50">
            <ChevronLeft size={20} />
          </div>
          กลับไปหน้าหลัก
        </button>

        <div className="bg-stone-900 p-1 rounded-full border border-stone-800 flex gap-1">
          <button
            onClick={() => startNewGame("TH")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              lang === "TH"
                ? "bg-orange-500 text-white"
                : "text-stone-500 hover:text-white"
            }`}
          >
            ไทย
          </button>

          <button
            onClick={() => startNewGame("EN")}
            
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              lang === "EN"
                ? "bg-orange-500 text-white"
                : "text-stone-500 hover:text-white"
            }`}
          >
            Eng
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-[#111111] border border-stone-800 rounded-3xl p-8 shadow-2xl flex flex-col">
          <TypingStats
            wordCount={wordsTyped}
            totalWords={TOTAL_WORDS}
            onReset={resetGame}
          />

          <TypingArea
            targetText={targetText}
            userInput={userInput}
            onInputChange={handleInputChange}
          />
        </div>
      </main>
    </div>
  );
};

export default SandboxPage;

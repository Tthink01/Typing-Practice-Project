import React, { useState, useEffect, useRef } from "react"; // ✅ เพิ่ม useRef
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, ChevronDown } from "lucide-react";

import Navbar from "../components/Navbar";
import TypingStats from "../components/Sandbox/TypingStats";

import SandboxTypingGame from '../components/Sandbox/SandboxTypingGame';
import TypingGame from '../components/Shared/TypingGame';

import { getRandomText } from "../data/wordList";

const SandboxPage = () => {
  const navigate = useNavigate();
  const TOTAL_WORDS = 40;

  // --- States ---
  const [lang, setLang] = useState("TH");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(true);
  
  const [visualMode, setVisualMode] = useState("sandbox");
  
  // ✅ State สำหรับคุมการเปิด/ปิด Dropdown (แก้ปัญหาหุบเอง)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ใช้เช็คคลิกข้างนอก

  const [targetText, setTargetText] = useState(() =>
    getRandomText("TH", TOTAL_WORDS)
  );

  // --- Effects ---
  // เพิ่ม: คลิกที่อื่นเพื่อปิด Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---
  const resetGame = () => {
    setIsGameActive(false);
    setTimeout(() => {
        setTargetText(getRandomText(lang, TOTAL_WORDS));
        setUserInput("");
        setIsGameActive(true);
    }, 50);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= targetText.length) {
      setUserInput(val);
    }
  };

  const startNewGame = (selectedLang) => {
    setLang(selectedLang);
    setIsGameActive(false);
    setTimeout(() => {
        setTargetText(getRandomText(selectedLang, TOTAL_WORDS));
        setUserInput("");
        setIsGameActive(true);
    }, 50);
  };

  const handleModeSelect = (mode) => {
      setVisualMode(mode);
      setIsDropdownOpen(false); // เลือกเสร็จสั่งปิดเมนูทันที
  };

  const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Header */}
      <header className="px-8 py-6 flex flex-col md:flex-row gap-4 justify-between items-center max-w-7xl mx-auto w-full z-10 relative">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold group self-start md:self-auto"
        >
          <div className="p-2 rounded-full bg-stone-900 border border-stone-800 group-hover:border-orange-500/50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          กลับไปหน้าหลัก
        </button>

        <div className="bg-stone-900 p-1 rounded-full border border-stone-800 flex gap-1">
          <button
            onClick={() => startNewGame("TH")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              lang === "TH"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-stone-500 hover:text-white"
            }`}
          >
            ไทย
          </button>
          <button
            onClick={() => startNewGame("EN")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              lang === "EN"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-stone-500 hover:text-white"
            }`}
          >
            Eng
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-[#111111] border border-stone-800 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-visible"> 
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ✅ Control Zone: สลับตำแหน่งแล้ว */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-end gap-4 mb-6 relative z-20">
                
                {/* 1. Dropdown (ย้ายมาซ้าย) */}
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // คลิกเพื่อเปิด/ปิด
                        className={`flex items-center gap-2 px-3 py-2 bg-stone-900 border rounded-lg text-xs font-bold transition-all shadow-lg
                            ${isDropdownOpen ? "border-orange-500 text-white" : "border-stone-800 text-stone-400 hover:text-white hover:border-stone-600"}
                        `}
                    >
                        <Eye size={16} className={visualMode === 'sandbox' ? "text-stone-500" : "text-orange-500"} />
                        <span>{visualMode === 'sandbox' ? "Clean Mode" : "Hint Mode"}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Menu (แสดงเมื่อ state เป็น true) */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-stone-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div 
                                onClick={() => handleModeSelect("sandbox")}
                                className={`px-4 py-3 text-xs cursor-pointer hover:bg-stone-800 flex items-center gap-3 ${visualMode === 'sandbox' ? 'text-orange-500 bg-orange-500/10' : 'text-stone-400'}`}
                            >
                                <span className="text-lg">✨</span>
                                <div>
                                    <div className="font-bold">แบบคลีน</div>
                                    <div className="text-[10px] opacity-70">ไม่มีตัวช่วย สบายตา</div>
                                </div>
                            </div>
                            <div 
                                onClick={() => handleModeSelect("practice")}
                                className={`px-4 py-3 text-xs cursor-pointer hover:bg-stone-800 flex items-center gap-3 ${visualMode === 'practice' ? 'text-orange-500 bg-orange-500/10' : 'text-stone-400'}`}
                            >
                                <span className="text-lg">🎯</span>
                                <div>
                                    <div className="font-bold">แบบมีตัวช่วย</div>
                                    <div className="text-[10px] opacity-70">ลูกศรบอกใบ้ + Space</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Stats (อยู่ขวา / เต็มพื้นที่) */}
                <div className="w-full md:w-auto flex-1">
                    <TypingStats
                        wordCount={wordsTyped}
                        totalWords={TOTAL_WORDS}
                        onReset={resetGame}
                    />
                </div>

            </div>

            {/* Game Content */}
            <div className="min-h-[200px] flex items-center z-10">
                {visualMode === "sandbox" ? (
                    <SandboxTypingGame
                        targetText={targetText}
                        userInput={userInput}
                        onInputChange={handleInputChange}
                        isGameActive={isGameActive}
                    />
                ) : (
                    <TypingGame
                        targetText={targetText}
                        userInput={userInput}
                        onInputChange={handleInputChange}
                        isGameActive={isGameActive}
                    />
                )}
            </div>
            
        </div>
      </main>
    </div>
  );
};

export default SandboxPage;
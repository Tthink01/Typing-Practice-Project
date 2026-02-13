import React, { useState, useEffect, useRef } from "react";
import { Keyboard, ArrowRight } from "lucide-react";

// --- Helper Data & Functions ---
const CHAR_SET =
  "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

const getRandomPos = () => ({
  top: Math.floor(Math.random() * 80) + 10 + "%",
  left: Math.floor(Math.random() * 90) + 5 + "%",
});

// 1. ตัวอักษรลอยไปมา (FloatingChar)
const FloatingChar = ({ className }) => {
  const [char, setChar] = useState(
    () => CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
  );
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(() => getRandomPos());
  const [opacity, setOpacity] = useState(() => 0.05 + Math.random() * 0.15);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const runCycle = () => {
      setIsVisible(true);
      const stayDuration = 8000 + Math.random() * 7000;

      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);

        timeoutRef.current = setTimeout(() => {
          setChar(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]);
          setPosition(getRandomPos());
          setOpacity(0.05 + Math.random() * 0.15);
          runCycle();
        }, 3000);
      }, stayDuration);
    };

    const initialDelay = Math.random() * 5000;
    timeoutRef.current = setTimeout(runCycle, initialDelay);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className={`${className} absolute select-none pointer-events-none transition-opacity duration-[3000ms]`}
      style={{
        opacity: isVisible ? opacity : 0,
        top: position.top,
        left: position.left,
        transitionProperty: "opacity",
      }}
    >
      {char}
    </div>
  );
};

// 2. ชื่อหัวข้อ (FloatingTitle) - Updated
const FloatingTitle = () => {
  const text = "E & T Touch Typing";
  const words = text.split(" ");

  return (
    <h1
      className="text-5xl sm:text-7xl md:text-8xl mb-2 -mt-6 flex flex-nowrap justify-center gap-x-3 md:gap-x-6 leading-normal select-none whitespace-nowrap"
      style={{ fontFamily: "'Mali', cursive", fontWeight: 600 }}
    >
      {words.map((word, wIndex) => (
        <div key={wIndex} className="flex">
          {word.split("").map((char, cIndex) => {
            // Logic การคำนวณ Delay ใหม่
            const calculateDelay = (wIndex * 3 + cIndex) * 0.25;
            const finalDelay = calculateDelay - 20;

            return (
              <span
                key={cIndex}
                className="inline-block pb-4 px-1"
                style={{
                  animation: `float-letter 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                  animationDelay: `${finalDelay}s`,
                }}
              >
                <span
                  className="text-shine-effect filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
                  style={{ WebkitTextStroke: "1px #FCD34D" }}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </h1>
  );
};

// --- Main Component: WelcomeScreen ---
const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-stone-950 flex flex-col items-center justify-center text-center overflow-hidden animate-fade-in font-sans transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Floating Characters Background */}
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-8xl font-black animate-float" />
      <FloatingChar className="text-gray-300 dark:text-stone-500 text-5xl font-bold animate-float-slow" />
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-9xl font-black animate-float-reverse" />
      <FloatingChar className="text-gray-300 dark:text-stone-700 text-4xl font-bold animate-float" />
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-7xl font-black animate-float-slow" />
      <FloatingChar className="text-gray-300 dark:text-stone-500 text-3xl font-bold animate-float-reverse" />
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-6xl font-black animate-float" />
      <FloatingChar className="text-gray-300 dark:text-stone-500 text-5xl font-bold animate-float-slow" />
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-4xl font-black animate-float-reverse" />
      <FloatingChar className="text-gray-300 dark:text-stone-500 text-7xl font-bold animate-float" />
      <FloatingChar className="text-gray-300 dark:text-stone-600 text-3xl font-black animate-float-slow" />
      <FloatingChar className="text-gray-300 dark:text-stone-700 text-5xl font-bold animate-float-reverse" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl px-6 animate-fade-in-up -translate-y-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl shadow-2xl shadow-orange-500/20 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-500">
          <Keyboard className="text-white w-12 h-12" />
        </div>

        {/* Title & Description */}
        <div>
          <FloatingTitle />
          <p className="text-gray-500 dark:text-stone-400 text-xl md:text-2xl font-itim tracking-wide mt-4">
            ฝึกฝนทักษะการพิมพ์สัมผัสของคุณให้{" "}
            <span className="text-orange-500 dark:text-orange-400 font-bold">เร็ว</span> และ{" "}
            <span className="text-lime-600 dark:text-lime-400 font-bold">แม่นยำ</span>
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative px-14 py-5 rounded-full font-bold text-xl text-stone-900 shadow-[0_0_20px_rgba(132,204,22,0.6)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400 via-yellow-400 to-amber-400" />

          <div
            className="absolute top-0 -left-1/4 w-[150%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              transform: "skewX(-25deg)",
              animation: "shine-sweep 5s infinite ease-in-out",
            }}
          />

          <span className="relative flex items-center gap-3 z-10 font-niramit">
            เข้าสู่หน้าฝึกพิมพ์{" "}
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              strokeWidth={2.5}
            />
          </span>
        </button>

        <p className="text-gray-400 dark:text-stone-500 text-lg font-itim mt-8">
          พัฒนาทักษะการพิมพ์ ไทย & อังกฤษ
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
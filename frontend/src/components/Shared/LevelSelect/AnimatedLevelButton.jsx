import React, { useState, useEffect } from "react";
import { Lock, Play } from "lucide-react";

const AnimatedLevelButton = ({
  item,
  count,
  onAnimationComplete,
  themeStyles,
  PASS_TARGET = 3,
}) => {
  const [stage, setStage] = useState("locked");
  const [particles] = useState(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 150}px`,
      ty: `${(Math.random() - 0.5) * 150}px`,
      rot: `${Math.random() * 720}deg`,
      color: Math.random() > 0.5 ? "#FFFFFF" : "#FCD34D",
      size: `${Math.random() * 6 + 2}px`,
    }));
  });

  useEffect(() => {
    // Sequence Animation
    const timers = [
      setTimeout(() => setStage("shaking"), 300),
      setTimeout(() => setStage("exploding"), 1100),
      setTimeout(() => setStage("dissolving"), 1300),
      setTimeout(() => {
        setStage("unlocked");
        if (onAnimationComplete) onAnimationComplete();
      }, 3800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  return (
    <div className="relative w-full">
      <button
        className={`w-full py-4 rounded-2xl flex items-center justify-between relative transition-all duration-300 border-2 px-6 ${themeStyles.bg} border-transparent shadow-lg transform active:scale-95`}
      >
        <div className="flex flex-col items-start">
          <span
            className={`text-2xl font-bold ${themeStyles.text}`}
            style={{ fontFamily: "'Itim', cursive" }}
          >
            {item.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900/20 ${themeStyles.text}`}
          >
            {count >= PASS_TARGET ? "Passed" : `${count}/${PASS_TARGET}`}
          </span>
          <div className={themeStyles.text}>
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </button>

      {stage !== "unlocked" && (
        <div
          className={`absolute inset-0 w-full h-full bg-stone-900 border-2 border-stone-700/50 rounded-2xl flex items-center justify-between px-6 z-20 transition-all ${
            stage === "dissolving" ? "animate-dissolve-slow" : ""
          }`}
        >
          <div className="flex flex-col items-start opacity-60">
            <span
              className="text-2xl font-bold text-stone-500"
              style={{ fontFamily: "'Itim', cursive" }}
            >
              {item.title}
            </span>
          </div>
          <div className="relative">
            <div
              className={`bg-stone-950 p-3 rounded-full border border-stone-800 relative z-10 ${
                stage === "shaking" ? "animate-shake-extreme" : ""
              } ${stage === "exploding" ? "animate-explode" : ""}`}
            >
              <Lock size={24} className="text-stone-400" />
            </div>
            {(stage === "exploding" || stage === "dissolving") && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-0">
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full animate-particle"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      "--tx": p.tx,
                      "--ty": p.ty,
                      "--rot": p.rot,
                      top: 0,
                      left: 0,
                    }}
                  />
                ))}
                <div
                  className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-4xl animate-explode"
                  style={{ animationDuration: "0.5s" }}
                >
                  💥
                </div>
                <div
                  className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full blur-xl opacity-80 animate-explode"
                  style={{ animationDuration: "0.2s" }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedLevelButton;

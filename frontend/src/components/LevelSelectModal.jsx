import React, { useState, useEffect } from 'react'; // ✅ ลบ useMemo, ใช้ useState/useEffect แทน
import { X, Lock, Play } from 'lucide-react';

// --- HELPER COMPONENT: ปุ่มที่มีอนิเมชันปลดล็อค ---
const AnimatedLevelButton = ({ item, count, onAnimationComplete, themeStyles, PASS_TARGET = 3 }) => {
    const [stage, setStage] = useState('locked');
    
    // ✅ 1. ใช้ State เพื่อเก็บค่า Particle แทนการคำนวณสด
    const [particles, setParticles] = useState([]);

    // ✅ 2. ย้าย Logic การสุ่ม Math.random() เข้ามาใน useEffect (Client-side Only)
    useEffect(() => {
        const timer = setTimeout(() => {
            const newParticles = [...Array(12)].map((_, i) => ({
                id: i,
                tx: `${(Math.random() - 0.5) * 150}px`,
                ty: `${(Math.random() - 0.5) * 150}px`,
                rot: `${Math.random() * 720}deg`,
                color: Math.random() > 0.5 ? '#FFFFFF' : '#FCD34D', 
                size: `${Math.random() * 6 + 2}px`
            }));
            setParticles(newParticles);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const t1 = setTimeout(() => setStage('shaking'), 300);
        const t2 = setTimeout(() => setStage('exploding'), 1100);
        const t3 = setTimeout(() => setStage('dissolving'), 1300);
        const t4 = setTimeout(() => {
            setStage('unlocked');
            if (onAnimationComplete) onAnimationComplete();
        }, 3800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onAnimationComplete]);

    return (
        <div className="relative w-full">
            <button className={`w-full py-4 rounded-2xl flex items-center justify-between relative transition-all duration-300 border-2 px-6 ${themeStyles.bg} border-transparent shadow-lg transform active:scale-95`}>
                <div className="flex flex-col items-start">
                    <span className={`text-2xl font-bold ${themeStyles.text}`} style={{ fontFamily: "'Itim', cursive" }}>{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900/20 ${themeStyles.text}`}>
                        {count >= PASS_TARGET ? 'Passed' : `${count}/${PASS_TARGET}`}
                    </span>
                    <div className={themeStyles.text}><Play size={24} fill="currentColor" /></div>
                </div>
            </button>

            {stage !== 'unlocked' && (
                <div className={`absolute inset-0 w-full h-full bg-stone-900 border-2 border-stone-700/50 rounded-2xl flex items-center justify-between px-6 z-20 transition-all ${stage === 'dissolving' ? 'animate-dissolve-slow' : ''}`}>
                    <div className="flex flex-col items-start opacity-60">
                        <span className="text-2xl font-bold text-stone-500" style={{ fontFamily: "'Itim', cursive" }}>{item.title}</span>
                    </div>
                    <div className="relative">
                        <div className={`bg-stone-950 p-3 rounded-full border border-stone-800 relative z-10 ${stage === 'shaking' ? 'animate-shake-extreme' : ''} ${stage === 'exploding' ? 'animate-explode' : ''}`}>
                            <Lock size={24} className="text-stone-400" />
                        </div>
                        {(stage === 'exploding' || stage === 'dissolving') && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-0">
                                {/* ✅ 3. ใช้ particles จาก State */}
                                {particles.map(p => (
                                    <div key={p.id} className="absolute rounded-full animate-particle" style={{ width: p.size, height: p.size, backgroundColor: p.color, '--tx': p.tx, '--ty': p.ty, '--rot': p.rot, top: 0, left: 0 }} />
                                ))}
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-4xl animate-explode" style={{ animationDuration: '0.5s' }}>💥</div>
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full blur-xl opacity-80 animate-explode" style={{ animationDuration: '0.2s' }}></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const LevelSelectModal = ({ 
    isOpen, 
    onClose, 
    title, 
    type, 
    exercises, 
    language, 
    setLanguage, 
    isLevelUnlocked, 
    onSelect,
    progress = {}, 
    pendingUnlock = null,
    onUnlockAnimationComplete
}) => {
  if (!isOpen) return null;

  const PASS_TARGET = 3; 

  // Determine Theme
  const isBasic = type === 'basic';
  const themeStyles = isBasic 
    ? { 
        bg: "bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400", 
        text: "text-stone-900",
        shadow: "shadow-[0_0_15px_rgba(132,204,22,0.4)]"
      }
    : { 
        bg: "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400", 
        text: "text-stone-900",
        shadow: "shadow-[0_0_15px_rgba(251,191,36,0.4)]"
      };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative bg-stone-900 border ${isBasic ? 'border-lime-500/30' : 'border-amber-500/30'} rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col h-[80vh] sm:h-auto sm:max-h-[85vh] animate-scale-up`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
            <div className={`${isBasic ? 'bg-lime-500/20 text-lime-100 border-lime-500/40' : 'bg-amber-500/20 text-amber-100 border-amber-500/40'} px-6 py-2 rounded-full border font-bold whitespace-nowrap text-xl`} style={{ fontFamily: "'Itim', cursive" }}>
                {title}
            </div>
             
            <div className="flex items-center gap-2 bg-stone-800 rounded-full p-1 border border-stone-700">
                <button 
                  onClick={() => setLanguage('TH')} 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'TH' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}
                >
                  TH
                </button>
                <button 
                  onClick={() => setLanguage('EN')} 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'EN' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}
                >
                  EN
                </button>
            </div>

            <button onClick={onClose} className="absolute -top-4 -right-4 sm:static sm:top-auto sm:right-auto p-2 text-stone-500 hover:text-white transition-colors">
                <X size={24}/>
            </button>
        </div>

        {/* Level List */}
        <div className="space-y-4 overflow-y-auto p-4 -mx-4 custom-scrollbar">
          {exercises && exercises[language] ? exercises[language].map((item) => {
            const unlocked = isLevelUnlocked(item.id);
            const count = progress[item.id] || 0;
            const isAnimating = pendingUnlock && pendingUnlock.type === type && pendingUnlock.id === item.id;

            if (isAnimating) {
                return (
                    <AnimatedLevelButton 
                        key={item.id} 
                        item={item} 
                        count={count} 
                        onAnimationComplete={onUnlockAnimationComplete}
                        themeStyles={themeStyles}
                        PASS_TARGET={PASS_TARGET}
                    />
                );
            }

            return (
              <button 
                key={item.id} 
                disabled={!unlocked}
                onClick={() => unlocked && onSelect(item.id)}
                className={`w-full py-4 rounded-2xl flex items-center justify-between relative transition-all duration-300 border-2 px-6 
                  ${unlocked 
                    ? `${themeStyles.bg} border-transparent ${themeStyles.text} ${themeStyles.shadow} cursor-pointer shadow-lg hover:scale-[1.02]` 
                    : 'bg-stone-800/50 border-stone-700/50 cursor-not-allowed opacity-70'
                  }`}
              >
                <div className="flex flex-col items-start text-left">
                  <span className={`text-2xl font-bold ${unlocked ? themeStyles.text : 'text-stone-500'}`} style={{ fontFamily: "'Itim', cursive" }}>{item.title}</span>
                   {item.sub && <span className={`text-xs ${unlocked ? 'opacity-80' : 'opacity-50'} ${unlocked ? themeStyles.text : 'text-stone-500'}`}>{item.sub}</span>}
                </div>
                
                <div className="flex items-center gap-3">
                  {unlocked && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900/20 ${themeStyles.text}`}>
                        {count >= PASS_TARGET ? 'Passed' : `${count}/${PASS_TARGET}`}
                    </span>
                  )}
                  {unlocked 
                    ? <div className={themeStyles.text}><Play size={24} fill="currentColor" strokeWidth={2.5} /></div> 
                    : <div className="bg-stone-900/80 p-2 rounded-full border border-stone-700"><Lock size={20} className="text-stone-400" /></div>
                  }
                </div>
              </button>
            )
          }) : <div className="text-stone-500 text-center py-4">ไม่พบข้อมูล</div>}
        </div>
      </div>
    </div>
  );
};

export default LevelSelectModal;
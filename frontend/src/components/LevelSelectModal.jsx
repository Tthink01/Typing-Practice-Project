import React from 'react';
import { X } from 'lucide-react';
import AnimatedLevelButton from './Shared/LevelSelect/AnimatedLevelButton'; // ✅ Import มา
import LevelButton from './Shared/LevelSelect/LevelButton'
const LevelSelectModal = ({ 
    isOpen, onClose, title, type, exercises, language, setLanguage, 
    isLevelUnlocked, onSelect, progress = {}, pendingUnlock = null, onUnlockAnimationComplete
}) => {
  if (!isOpen) return null;

  const PASS_TARGET = 3; 

  // Determine Theme Logic
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
        
        {/* Header (Language Switcher & Close Btn) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
            <div className={`${isBasic ? 'bg-lime-500/20 text-lime-100 border-lime-500/40' : 'bg-amber-500/20 text-amber-100 border-amber-500/40'} px-6 py-2 rounded-full border font-bold whitespace-nowrap text-xl`} style={{ fontFamily: "'Itim', cursive" }}>
                {title}
            </div>
             
            <div className="flex items-center gap-2 bg-stone-800 rounded-full p-1 border border-stone-700">
                <button onClick={() => setLanguage('TH')} className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'TH' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}>TH</button>
                <button onClick={() => setLanguage('EN')} className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'EN' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}>EN</button>
            </div>

            <button onClick={onClose} className="absolute -top-4 -right-4 sm:static sm:top-auto sm:right-auto p-2 text-stone-500 hover:text-white transition-colors">
                <X size={24}/>
            </button>
        </div>

        {/* Level List */}
        <div className="space-y-4 overflow-y-auto p-4 -mx-4 custom-scrollbar">
          {exercises && exercises[language] ? exercises[language].map((item) => {
            const unlocked = isLevelUnlocked(item.id);
            
            // const count = progress[item.id] || 0;
            const highestPassed = progress?.highestPassedLevel || 0;
            // const count = item.id <= highestPassed ? 3 : 0;
            // const isAnimating = pendingUnlock && pendingUnlock.type === type && pendingUnlock.id === item.id;
            const count = item.id <= highestPassed ? 3 : 0;
            const isAnimating = pendingUnlock && pendingUnlock.type === type && pendingUnlock.id === item.id;

            // ✅ Clean Loop: เลือก Component ที่จะแสดงผล
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
                <LevelButton 
                    key={item.id}
                    item={item}
                    unlocked={unlocked}
                    count={count}
                    onSelect={onSelect}
                    themeStyles={themeStyles}
                    PASS_TARGET={PASS_TARGET}
                />
            );

          }) : <div className="text-stone-500 text-center py-4">ไม่พบข้อมูล</div>}
        </div>
      </div>
    </div>
  );
};

export default LevelSelectModal;
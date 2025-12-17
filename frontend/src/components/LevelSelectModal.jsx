import React from 'react';
import { X, Play, Lock } from 'lucide-react';

const LevelSelectModal = ({ isOpen, onClose, title, type, exercises, language, setLanguage, isLevelUnlocked, onSelect }) => {
  if (!isOpen) return null;

  // กำหนดสีธีม (เขียว/ทอง)
  const isBasic = type === 'basic';
  const themeStyles = isBasic 
    ? { bg: "bg-gradient-to-r from-lime-400 to-lime-500", text: "text-stone-900" }
    : { bg: "bg-gradient-to-r from-amber-400 to-amber-500", text: "text-stone-900" };

  return (
    <div className="fixed inset-0 font-itim z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* พื้นหลังสีดำจางๆ */}
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      {/* กล่อง Modal */}
      <div className="relative bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col h-[70vh]">
        
        {/* หัวข้อ */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold text-white">{title}</h2>
             {/* ปุ่มเปลี่ยนภาษา */}
             <div className="flex bg-stone-800 rounded-full p-1 border border-stone-700 ml-2">
                <button onClick={() => setLanguage('TH')} className={`px-2 py-0.5 rounded-full text-xs transition-colors ${language === 'TH' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}>TH</button>
                <button onClick={() => setLanguage('EN')} className={`px-2 py-0.5 rounded-full text-xs transition-colors ${language === 'EN' ? 'bg-stone-600 text-white' : 'text-stone-400'}`}>EN</button>
             </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X size={24}/></button>
        </div>

        {/* รายการด่าน */}
        <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {exercises && exercises[language] ? exercises[language].map((ex) => {
            const unlocked = isLevelUnlocked(ex.id);
            return (
              <button 
                key={ex.id} 
                disabled={!unlocked}
                onClick={() => unlocked && onSelect(ex.id)}
                className={`w-full p-4 rounded-xl flex justify-between items-center border transition-all ${unlocked ? `${themeStyles.bg} border-transparent ${themeStyles.text} shadow-lg hover:scale-[1.02]` : 'bg-stone-800/50 border-stone-700 text-stone-500 cursor-not-allowed'}`}
              >
                <div className="text-left">
                  <div className="font-bold text-lg">{ex.title}</div>
                  <div className="text-xs opacity-80">{ex.sub}</div>
                </div>
                {unlocked ? <Play size={20} fill="currentColor"/> : <Lock size={18} />}
              </button>
            )
          }) : <div className="text-white">ไม่พบข้อมูล</div>}
        </div>
      </div>
    </div>
  );
};

export default LevelSelectModal;
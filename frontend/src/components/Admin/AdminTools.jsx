import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
// import { motion ,AnimatePresence} from "motion/react"
import { ShieldAlert, Unlock, X, Minimize2, Move } from "lucide-react";

const AdminTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // State สำหรับฟอร์มปลดล็อก
  const [targetMode, setTargetMode] = useState("basic");
  const [targetLevel, setTargetLevel] = useState(1);
  const constraintsRef = useRef(null);

  // --- 1. Security Check (Load User) ---
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("auth-change", checkUser);
    return () => window.removeEventListener("auth-change", checkUser);
  }, []);

  // --- 2. ถ้าไม่ใช่ Admin ให้ Return Null (ไม่แสดงผลเลย) ---
  // เช็ค role ตาม Schema: { type: String, default: 'user' }
  if (!user || user.role !== "admin") {
    return null;
  }

  // --- Logic ปลดล็อก (จำลอง) ---
  const handleUnlock = () => {
    if (window.confirm(`ยืนยันปลดล็อก ${targetMode.toUpperCase()} Level ${targetLevel} ?`)) {
      // TODO: ยิง API ไป Backend ตรงนี้
      // axios.post('/api/levels/unlock', { userId: user.id, mode: targetMode, level: targetLevel })
      
      // ตัวอย่างจำลองการปลดล็อก (Mock)
      console.log(`[ADMIN ACTION] Unlocked: ${targetMode} - ${targetLevel}`);
      
      // Feedback
      const btn = document.getElementById("unlock-btn");
      if(btn) {
        const originalText = btn.innerText;
        btn.innerText = "Success!";
        btn.classList.add("bg-green-600", "text-white");
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove("bg-green-600", "text-white");
        }, 1500);
      }
    }
  };

  return (
    <>
      {/* Constraints Area (เพื่อให้ลากได้ทั่วหน้าจอ) */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9999]" />

      <motion.div
        drag
        dragConstraints={constraintsRef} // ห้ามลากหลุดขอบจอ
        dragMomentum={false} // หยุดทันทีเมื่อปล่อยเมาส์
        initial={{ x: 20, y: window.innerHeight - 100 }} // ตำแหน่งเริ่มต้น (มุมซ้ายล่าง)
        className="fixed z-[9999] pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            // --- State 1: ปุ่มย่อ (Minimized) ---
            <motion.button
              key="minimized"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-red-600/90 text-white p-3 rounded-full shadow-lg shadow-red-600/40 border-2 border-red-400 backdrop-blur-sm flex items-center gap-2 group"
            >
              <ShieldAlert size={24} />
              <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap text-xs font-bold">
                Admin Tools
              </span>
            </motion.button>
          ) : (
            // --- State 2: Panel เต็ม (Expanded) ---
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-[#1c1917]/95 border border-red-500/50 p-4 rounded-xl shadow-2xl w-72 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b border-stone-700 pb-2 cursor-move">
                <div className="flex items-center gap-2 text-red-500 font-bold">
                  <ShieldAlert size={18} />
                  <span>Admin Panel</span>
                </div>
                <div className="flex gap-1">
                  <Move size={14} className="text-stone-500 mr-2" />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    <Minimize2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content: Unlock Form */}
              <div className="space-y-3">
                <div className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                  Unlock Level / Exercise
                </div>
                
                {/* Select Mode */}
                <div className="grid grid-cols-2 gap-2">
                  {['basic', 'pro'].map(m => (
                    <button
                      key={m}
                      onClick={() => setTargetMode(m)}
                      className={`py-1 px-2 rounded text-sm font-bold border transition-colors ${
                        targetMode === m 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
                      }`}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Input Level */}
                <div className="flex items-center gap-2 bg-stone-800 p-2 rounded border border-stone-700">
                  <span className="text-stone-400 text-sm">Level ID:</span>
                  <input 
                    type="number" 
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="bg-transparent text-white w-full outline-none font-mono text-right"
                    min="1"
                  />
                </div>

                {/* Unlock Button */}
                <button
                  id="unlock-btn"
                  onClick={handleUnlock}
                  className="w-full bg-stone-700 hover:bg-red-600 hover:text-white text-stone-300 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Unlock size={16} />
                  Force Unlock
                </button>
              </div>

              <div className="mt-4 pt-2 border-t border-stone-700 text-[10px] text-stone-500 text-center font-mono">
                Logged in as: {user.username} ({user.role})
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AdminTools;
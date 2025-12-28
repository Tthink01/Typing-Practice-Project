import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Unlock,
  Minimize2,
  Move,
  LayoutDashboard,
  Trash2,
} from "lucide-react";

const AdminTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // State สำหรับฟอร์มปลดล็อก
  const [targetMode, setTargetMode] = useState("basic");
  const [targetLang, setTargetLang] = useState("TH"); // ✅ 1. เพิ่ม State เลือกภาษา
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

  if (!user || user.role !== "admin") {
    return null;
  }

  // --- Logic ปลดล็อก (ของจริง: ยิง API) ---
  const handleUnlock = async () => {
    // 1. ถามยืนยัน
    if (
      window.confirm(
        `ยืนยันปลดล็อก ${targetMode.toUpperCase()} (${targetLang}) Level ${targetLevel} ?`
      )
    ) {
      try {
        // 2. ส่งข้อมูลไปที่ Backend
        const res = await axios.post(
          "http://localhost:3001/users/force-unlock",
          {
            userId: user._id,
            mode: targetMode,    // 'basic' หรือ 'pro'
            language: targetLang, // ✅ 2. ส่งค่าภาษาไปด้วย (TH/EN)
            targetLevel: targetLevel,
          }
        );

        // 3. ถ้าสำเร็จ
        if (res.data.status === "Success") {
          console.log("Unlock Success:", res.data);

          // 3.1 อัปเดตข้อมูลใน LocalStorage
          const updatedUser = { ...user, progress: res.data.progress };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          setUser(updatedUser);

          // 3.2 Visual Feedback
          const btn = document.getElementById("unlock-btn");
          if (btn) {
            const originalText = btn.innerText;
            btn.innerText = "Success!";
            btn.classList.add("bg-green-600", "text-white");

            setTimeout(() => {
              btn.innerText = originalText;
              btn.classList.remove("bg-green-600", "text-white");
              window.location.reload();
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Unlock Failed:", err);
        alert(
          "เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  // --- Logic รีเซ็ตข้อมูล ---
  const handleResetProgress = async () => {
    if (
      window.confirm(
        "⚠️ คำเตือน: ความคืบหน้าทั้งหมดของคุณจะหายไป!\nคุณต้องการรีเซ็ตเป็น Level 0 ใช่หรือไม่?"
      )
    ) {
      try {
        const res = await axios.post(
          "http://localhost:3001/users/reset-progress",
          {
            userId: user._id,
          }
        );

        if (res.data.status === "Success") {
          const updatedUser = { ...user, progress: res.data.progress };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          setUser(updatedUser);

          alert("รีเซ็ตข้อมูลเรียบร้อย!");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการรีเซ็ต");
      }
    }
  };

  return (
    <>
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        initial={{ x: 20, y: window.innerHeight - 100 }}
        className="fixed z-[9999] pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            // --- Minimized ---
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
            // --- Expanded ---
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
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

              {/* Dashboard Button */}
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsOpen(false);
                }}
                className="w-full mb-4 bg-stone-800 hover:bg-stone-700 hover:text-orange-400 text-stone-300 border border-stone-600 border-dashed py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <LayoutDashboard size={16} />
                Open Dashboard
              </button>

              <div className="h-px bg-stone-800 w-full mb-4"></div>

              {/* Form: Unlock */}
              <div className="space-y-3">
                <div className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                  Unlock Level / Exercise
                </div>

                {/* 1. Select Mode */}
                <div className="grid grid-cols-2 gap-2">
                  {["basic", "pro"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTargetMode(m)}
                      className={`py-1 px-2 rounded text-sm font-bold border transition-colors ${
                        targetMode === m
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700"
                      }`}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* ✅ 2. Select Language (เพิ่มใหม่) */}
                <div className="grid grid-cols-2 gap-2">
                  {["TH", "EN"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTargetLang(lang)}
                      className={`py-1 px-2 rounded text-sm font-bold border transition-colors ${
                        targetLang === lang
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* 3. Input Level */}
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

                <button
                  id="unlock-btn"
                  onClick={handleUnlock}
                  className="w-full bg-stone-700 hover:bg-blue-600 hover:text-white text-stone-300 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Unlock size={16} />
                  Force Unlock (API)
                </button>
              </div>

              {/* Danger Zone */}
              <div className="h-px bg-stone-800 w-full my-4"></div>

              <div className="space-y-2">
                <div className="text-xs text-red-400 uppercase tracking-wider font-bold">
                  Danger Zone
                </div>
                <button
                  onClick={handleResetProgress}
                  className="w-full bg-red-900/30 border border-red-800 hover:bg-red-600 hover:text-white text-red-400 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Reset My Progress
                </button>
              </div>

              {/* Footer */}
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
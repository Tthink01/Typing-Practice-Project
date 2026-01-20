import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  House,
  GraduationCap,
  Type,
  User,
  LogOut,
  Keyboard,
} from "lucide-react";

import axios from "axios"; // ✅ ต้องมี axios
import { EXERCISES_DATA } from "../data/exercises";

const ActiveDot = () => (
  <span className="absolute -bottom-3 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.8)]"></span>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Auth Logic (ย้ายขึ้นมาเพื่อให้ useEffect เรียกใช้ user ได้) ---
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("currentUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const handleLogout = () => {
    if (window.confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("auth-change"));
      navigate("/login");
    }
  };

  // ==========================================
  // 🔥 Logic เช็ค Active Menu
  // ==========================================
  const isWelcomeActive = () => {
    if (location.pathname !== "/") return false;
    if (location.state?.forceShowWelcome) return true;
    if (location.state?.forceShowContent) return false;
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    return !hasSeenWelcome;
  };
  const isWelcome = isWelcomeActive();

  const isPractice = () => {
    if (location.pathname.startsWith("/game")) return true;
    if (location.pathname === "/" && !isWelcome) return true;
    return false;
  };

  const isSandbox = location.pathname.toLowerCase() === "/sandbox";
  const isCertificate = location.pathname.toLowerCase() === "/certificate";

  // ==========================================
  // 🏆 Logic เช็ค Certificate จาก "ฐานข้อมูล (Database)"
  // ==========================================
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState(false);

  useEffect(() => {
    const checkProgressFromDB = async () => {
      // 1. นับจำนวนด่านทั้งหมด (Client Side Calculation)
      let totalLevels = 0;
      if (EXERCISES_DATA["normal"]?.["TH"]) totalLevels += EXERCISES_DATA["normal"]["TH"].length;
      if (EXERCISES_DATA["normal"]?.["EN"]) totalLevels += EXERCISES_DATA["normal"]["EN"].length;

      // ถ้ายังไม่ Login ไม่ต้องเช็ค -> ปิดปุ่ม
      if (!user) {
        setIsCertificateUnlocked(false);
        return;
      }

      try {
        // ✅ 2. ยิง API ไปถาม Database แทนการอ่าน LocalStorage
        // เปลี่ยน URL 'http://localhost:5000' ให้ตรงกับ Server ของคุณ
        const response = await axios.get(`http://localhost:5000/api/users/${user.username}/progress`);
        
        // สมมติว่า Backend ส่งกลับมาเป็น: { completedLevels: ["th-1", "th-2", ...], ... }
        const completedLevels = response.data.completedLevels || [];
        const completedCount = completedLevels.length;

        // 3. เปรียบเทียบ
        // ถ้าเล่นครบทุกด่าน (และมีด่านให้เล่น) -> ปลดล็อค
        const isUnlocked = completedCount >= totalLevels && totalLevels > 0;
        setIsCertificateUnlocked(isUnlocked);
        
        
      } catch (error) {
        console.error("❌ Error fetching progress:", error);
        // กรณี Error (ต่อ DB ไม่ติด) ให้ปิดปุ่มไว้ก่อน หรือจะ Fallback ไป LocalStorage ก็ได้
        setIsCertificateUnlocked(false);
      }
    };

    checkProgressFromDB();
  }, [location, user]); // เช็คใหม่เมื่อเปลี่ยนหน้า หรือ user เปลี่ยน

  // Class Helper
  const getMenuIconClass = (active) =>
    `transition-all duration-300 ${
      active
        ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
        : "text-gray-500 hover:text-gray-300"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-[#1c1917]/95 backdrop-blur-md border-b border-[#f97316]/20 shadow-lg">
      
      {/* 1. Logo */}
      <Link
        to="/"
        state={{ forceShowWelcome: true }}
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
          <Keyboard size={24} strokeWidth={2.5} />
        </div>
        <span className="text-gray-100 font-bold text-lg tracking-wide hidden md:block">
          E & T Typing
        </span>
      </Link>

      {/* 2. เมนูตรงกลาง */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-full px-8 md:px-12 py-3 md:py-4 flex items-center gap-8 md:gap-10 shadow-inner">
          
          <Link
            to="/"
            state={{ forceShowWelcome: true }}
            title="หน้าต้อนรับ"
            className="relative flex flex-col items-center justify-center group"
          >
            <House size={22} className={getMenuIconClass(isWelcome)} />
            {isWelcome && <ActiveDot />}
          </Link>

          <Link
            to="/"
            state={{ forceShowContent: true }}
            title="เลือกแบบฝึกหัด"
            className="relative flex flex-col items-center justify-center group"
          >
            <Keyboard size={26} className={getMenuIconClass(isPractice())} />
            {isPractice() && <ActiveDot />}
          </Link>

          <Link
            to="/sandbox"
            title="โหมดพิมพ์อิสระ"
            className="relative flex flex-col items-center justify-center group"
          >
            <Type size={22} className={`${getMenuIconClass(isSandbox)} ${isSandbox ? "stroke-[2.5px]" : ""}`} />
            {isSandbox && <ActiveDot />}
          </Link>

          {/* ✅ ปุ่ม Certificate (โชว์เมื่อ Database บอกว่าครบ) */}
          {isCertificateUnlocked && (
            <Link
              to="/certificate"
              title="รับใบประกาศนียบัตร"
              className="relative flex flex-col items-center justify-center group animate-fade-in"
            >
              <GraduationCap
                size={24}
                className={`${getMenuIconClass(isCertificate)} ${isCertificate ? "stroke-[2.5px]" : ""}`}
              />
              {isCertificate && <ActiveDot />}
              {!isCertificate && (
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </Link>
          )}

        </div>
      </div>

      {/* 3. ส่วน User */}
      <div>
        {user ? (
          <div className="flex items-center font-itim gap-3 bg-[#27272a] pl-4 pr-1 py-1 rounded-full border border-[#3f3f46] hover:border-orange-500/30 transition-colors">
            <div className="flex flex-col items-end leading-none mr-1">
              <span className="text-gray-200 font-semibold text-sm">
                {user.username}
              </span>
              {user.role === "admin" && (
                <span className="text-[10px] text-orange-400 font-medium tracking-wider">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-full transition-all duration-200"
              title="ออกจากระบบ"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 hover:text-white px-5 py-2.5 rounded-full border border-[#3f3f46] text-sm font-itim transition-all duration-200 hover:border-gray-500 hover:shadow-md">
              <User size={16} />
              <span>เข้าสู่ระบบ</span>
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
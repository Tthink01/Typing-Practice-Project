import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { House, GraduationCap, Type, User, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ฟังก์ชันเช็คว่าปุ่มไหนควร Active (เปลี่ยนสี)
  const isActive = (path) => location.pathname === path;

  // --- Auth Logic ---
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

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 z-50 pointer-events-none">
      {/* 1. Logo ด้านซ้าย (คลิกแล้วกลับ Home แบบ Reset) */}
      <Link
        to="/"
        state={{ forceShowWelcome: true }}
        className="flex items-center gap-2 pointer-events-auto"
      >
        <div className="bg-orange-600 p-1 rounded-md text-white font-bold text-xs">
          ⌨
        </div>
        <span className="text-white font-semibold text-sm">
          E & T touch typing
        </span>
      </Link>

      {/* 2. เมนูตรงกลาง */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-800 rounded-full px-8 py-3 flex items-center gap-8 shadow-xl pointer-events-auto">
        {/* ปุ่ม Home -> ไปหน้า Welcome */}
        <Link
          to="/"
          state={{ forceShowWelcome: true }}
          title="หน้าต้อนรับ (Welcome)"
        >
          <House
            size={24}
            className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
              isActive("/") && !location.state?.forceShowContent
                ? "text-orange-500 scale-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                : "text-gray-500 hover:text-white"
            }`}
          />
        </Link>

        {/* ปุ่ม Hat -> ไปหน้าเลือกแบบฝึกหัด (ปิด Welcome) */}
        <Link to="/" state={{ forceShowContent: true }} title="เลือกแบบฝึกหัด">
          <GraduationCap
            size={28}
            className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
              isActive("/") && location.state?.forceShowContent
                ? "text-lime-400 scale-125 drop-shadow-[0_0_8px_rgba(132,204,22,0.5)]"
                : "text-gray-500 hover:text-white"
            }`}
          />
        </Link>

        {/* ปุ่ม T -> ไปหน้า Sandbox */}
        <Link to="/sandbox" title="โหมดพิมพ์อิสระ">
          <Type
            size={24}
            className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
              isActive("/sandbox")
                ? "text-blue-400 scale-125 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                : "text-gray-500 hover:text-white"
            }`}
          />
        </Link>
      </div>

      {/* 3. ส่วนด้านขวา (User Profile / Login) */}
      <div className="pointer-events-auto">
        {user ? (
          <div className="flex items-center gap-3 bg-[#1f1f1f] px-2 py-1 rounded-full border border-gray-700">
            <div className="px-3 flex flex-col items-end leading-tight">
              <span className="text-orange-500 font-bold text-sm">
                {user.username}
              </span>
              {user.role === "admin" && (
                <span className="text-[10px] text-purple-400">ADMIN</span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-full transition-all"
              title="ออกจากระบบ"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-full border border-gray-700 text-sm transition-all cursor-pointer">
              <User size={12} />
              ลงชื่อเข้าใช้ / สมัคร
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

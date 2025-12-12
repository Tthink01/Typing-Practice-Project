import React, { useState, useEffect } from "react"; // ลบ useEffect ออกได้เลยถ้าไม่ได้ใช้ทำอย่างอื่น
import { Link, useNavigate } from "react-router-dom";
import { House, GraduationCap, Type, User, LogOut } from "lucide-react"; // ใช้ lucide-react ตามโปรเจกต์ใหม่

const Navbar = () => {
  const navigate = useNavigate();
  

  // ✅ แก้ไขจุดที่ 1: อ่านค่าจาก LocalStorage ทันทีที่เริ่มทำงาน (ไม่ต้องรอ useEffect)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // เพิ่มส่วนนี้: ดักฟังสัญญาณ 'auth-change' เพื่อเปลี่ยนปุ่มทันที
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("currentUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("auth-change")); // ส่งสัญญาณบอกตัวเอง
      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-transparent absolute top-0 w-full z-10">
      {/* Logo ด้านซ้าย */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-600 p-1 rounded-md text-white font-bold text-xs">
          ⌨
        </div>
        <span className="text-white font-semibold text-sm">
          E & T touch typing
        </span>
      </div>

      {/* เมนูตรงกลาง */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-800 rounded-full px-8 py-3 flex items-center gap-8 shadow-xl">
        
        {/* ปุ่ม 1: หน้าหลัก */}
        <Link to="/" title="หน้าหลัก">
          <House className={("/")} size={24} />
        </Link>

        {/* ปุ่ม 2: ฝึกซ้อม (Basic/Pro) */}
        {/* สมมติว่าหน้ารวมคอร์สคือ /practice หรือถ้าไม่มีก็ลิงก์ไป /practice/basic ก็ได้ */}
        <Link to="/practice/basic" title="โหมดฝึกซ้อม">
          <GraduationCap className={("/practice/basic")} size={24} />
        </Link>

        {/* ปุ่ม 3: Sandbox */}
        {/* ถ้า Sandbox เป็นแค่ State ในหน้า Home อาจต้องใช้ onClick แทน Link */}
        {/* แต่ถ้าแยก Route ก็ใช้ Link ได้เลย (ในที่นี้ใส่ไว้เพื่อความสวยงามก่อน) */}
        <div className={("/sandbox")} title="โหมดพิมพ์อิสระ">
          <Type size={24} />
        </div>

      </div>

      {/* ส่วนด้านขวา */}
      <div>
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

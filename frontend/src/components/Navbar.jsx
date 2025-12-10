import React, { useState, useEffect } from "react"; // ลบ useEffect ออกได้เลยถ้าไม่ได้ใช้ทำอย่างอื่น
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { AiFillHome, AiOutlineTrophy } from "react-icons/ai";

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
      <div className="bg-[#1f1f1f] rounded-full px-6 py-2 flex gap-6 border border-gray-700">
        <Link to="/">
          <AiFillHome className="text-orange-500 cursor-pointer" size={20} />
        </Link>
        <AiOutlineTrophy
          className="text-gray-500 hover:text-white cursor-pointer"
          size={20}
        />
        <span className="text-gray-500 hover:text-white cursor-pointer font-serif">
          T
        </span>
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
              <FaSignOutAlt size={14} />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-full border border-gray-700 text-sm transition-all cursor-pointer">
              <FaUser size={12} />
              ลงชื่อเข้าใช้ / สมัคร
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

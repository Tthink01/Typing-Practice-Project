import React from 'react';
import { FaUser } from 'react-icons/fa';
import { AiFillHome, AiOutlineTrophy } from 'react-icons/ai';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-transparent absolute top-0 w-full z-10">
      {/* Logo ด้านซ้าย */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-600 p-1 rounded-md text-white font-bold text-xs">⌨</div>
        <span className="text-white font-semibold text-sm">E & T touch typing</span>
      </div>

      {/* เมนูตรงกลาง */}
      <div className="bg-[#1f1f1f] rounded-full px-6 py-2 flex gap-6 border border-gray-700">
        <AiFillHome className="text-orange-500 cursor-pointer" size={20} />
        <AiOutlineTrophy className="text-gray-500 hover:text-white cursor-pointer" size={20} />
        <span className="text-gray-500 hover:text-white cursor-pointer font-serif">T</span>
      </div>

      {/* ปุ่ม Login ด้านขวา */}
      <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-full border border-gray-700 text-sm transition-all">
        <FaUser size={12} />
        ลงชื่อเข้าใช้ / สมัคร
      </button>
    </nav>
  );
};

export default Navbar;
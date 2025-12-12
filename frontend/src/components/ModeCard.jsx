import React, { useState } from 'react';
import { Keyboard, HelpCircle, Lock, ArrowRight } from 'lucide-react';

const ModeCard = ({ title, level, description, isLocked, helpText }) => { // รับ helpText เพิ่ม
  // 1. เพิ่ม State เช็คว่าเมาส์ชี้อยู่ไหม
  const [isHovered, setIsHovered] = useState(false);

  // ข้อความแนะนำ (ถ้าไม่ได้ส่งมา ให้ใช้ค่า Default)
  const defaultHelpText = "โหมดนี้เหมาะสำหรับผู้เริ่มต้น ฝึกพิมพ์แป้นเหย้า แถวบน แถวล่าง และการผสมคำง่ายๆ เพื่อสร้างความคุ้นเคยกับแป้นพิมพ์";
  const contentText = helpText || defaultHelpText;

  return (
    <div className={`relative w-[380px] h-[480px] bg-[#0f0f0f] border ${isLocked ? 'border-stone-800 opacity-80' : 'border-stone-800 hover:border-stone-600'} rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 group`}>
      
      {/* 2. ส่วน Popup ข้อความแนะนำ (จะโชว์เมื่อ isHovered เป็น true) */}
      <div 
        className={`absolute inset-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-300 ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <HelpCircle size={48} className="text-lime-400 mb-4 drop-shadow-[0_0_10px_rgba(132,204,22,0.5)]" />
        <h3 className="text-lime-400 font-bold text-xl mb-4">คำแนะนำ</h3>
        <p className="text-stone-300 leading-relaxed font-light">
          {contentText}
        </p>
      </div>

      {/* --- เนื้อหาการ์ดปกติ --- */}
      <div>
        {/* Header Icon & Help Button */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl bg-stone-900 border border-stone-800 ${isLocked ? 'text-yellow-500' : 'text-lime-400'}`}>
            <Keyboard size={32} />
          </div>
          
          {/* ปุ่ม Help (?) */}
          <div 
            className="text-stone-500 hover:text-lime-400 cursor-help transition-colors"
            onMouseEnter={() => setIsHovered(true)}  // เมาส์เข้า -> เปิด
            onMouseLeave={() => setIsHovered(false)} // เมาส์ออก -> ปิด
          >
            <HelpCircle size={28} />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <span className="text-xs font-bold text-stone-500 tracking-widest uppercase">{level}</span>
        <p className="mt-6 text-stone-400 leading-relaxed text-sm h-20 overflow-hidden">
          {description}
        </p>
      </div>

      {/* Footer Button */}
      <div className="mt-auto">
        {isLocked ? (
          <div className="w-full py-4 rounded-xl flex items-center justify-center text-amber-500 font-bold bg-stone-900 border border-stone-800">
            <Lock size={18} className="mr-2" /> ยังไม่ปลดล็อค
          </div>
        ) : (
          <div className="w-full py-4 px-6 rounded-xl flex items-center justify-between bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold shadow-lg shadow-lime-900/20 group-hover:scale-[1.02] transition-transform cursor-pointer">
            <span>เริ่มฝึกฝน</span>
            <ArrowRight size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeCard;
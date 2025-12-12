import React from 'react';
import { FaKeyboard, FaLock } from 'react-icons/fa';
import { BsQuestionCircle } from 'react-icons/bs';

const ModeCard = ({ title, level, description, isLocked, onClick, onHelpClick }) => {
  return (
    <div
      className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-sm 
                 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer"
      onClick={isLocked ? undefined : onClick}
    >
      {/* ไอคอนเครื่องหมายคำถาม */}
      <div
        className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();  // ❗ ป้องกันคลิกช่วยแล้วมันเปิด modal เลือกด่านแทน
          onHelpClick && onHelpClick();
        }}
      >
        <BsQuestionCircle size={20} />
      </div>

      {/* ไอคอนคีย์บอร์ด */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 
        ${isLocked
          ? 'bg-gray-800 text-gray-500'
          : 'bg-gray-800 text-green-400 border border-green-500/30'
        }`}
      >
        <FaKeyboard size={24} />
      </div>

      {/* หัวข้อ */}
      <h3 className={`text-2xl font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
        {title}
      </h3>

      <p className="text-xs text-gray-500 font-semibold tracking-wider mb-4">
        {level}
      </p>

      {/* คำอธิบาย */}
      <p className="text-gray-400 text-sm mb-8 min-h-[40px]">
        {description}
      </p>

      {/* ปุ่ม */}
      {isLocked ? (
        <button
          disabled
          className="w-full py-3 rounded-lg border border-gray-700 text-yellow-600 
                     flex items-center justify-center gap-2 bg-gray-900/50 cursor-not-allowed"
        >
          <FaLock size={14} />
          <span className="text-sm font-medium">ยังไม่ปลดล็อค</span>
        </button>
      ) : (
        <button
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold 
                     transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();   // ❗ ป้องกันซ้อนกับการคลิก card
            onClick && onClick();
          }}
        >
          เริ่มฝึกฝน <span>→</span>
        </button>
      )}
    </div>
  );
};

export default ModeCard;

import React, { useState,  } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ManualModal = ({ isOpen, onClose, images = [] }) => {
  // เก็บสถานะว่าดูรูปที่เท่าไหร่ (เริ่มที่ 0)
  const [currentIndex, setCurrentIndex] = useState(0);

  // รีเซ็ตกลับไปหน้าแรกทุกครั้งที่เปิด Modal ใหม่
 

  if (!isOpen) return null;

  // ฟังก์ชันเลื่อนขวา (วนกลับมาหน้าแรกถ้าถึงหน้าสุดท้าย)
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // ฟังก์ชันเลื่อนซ้าย (วนไปหน้าสุดท้ายถ้าอยู่หน้าแรก)
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Container หลัก */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-stone-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header: ปุ่มปิด */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* พื้นที่แสดงรูปภาพ */}
        <div className="flex-1 flex items-center justify-center bg-stone-800 relative overflow-hidden">
          
          {/* รูปภาพ */}
          {images.length > 0 && (
            <img 
              src={images[currentIndex]} 
              alt={`Manual Page ${currentIndex + 1}`} 
              className="max-w-full max-h-full object-contain animate-fade-in"
            />
          )}

          {/* ปุ่มถอยหลัง (ซ้าย) */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-orange-500/80 text-white rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>

          {/* ปุ่มไปข้างหน้า (ขวา) */}
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-orange-500/80 text-white rounded-full transition-all hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Footer: ตัวบอกเลขหน้า */}
        <div className="h-16 bg-stone-950 border-t border-stone-800 flex items-center justify-center gap-4 text-white">
            <span className="text-stone-400 text-sm">
                หน้า {currentIndex + 1} จาก {images.length}
            </span>
            
            {/* (Optional) จุดไข่ปลาบอกตำแหน่ง */}
            <div className="flex gap-2">
                {images.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentIndex ? "bg-orange-500" : "bg-stone-600"
                        }`}
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManualModal;
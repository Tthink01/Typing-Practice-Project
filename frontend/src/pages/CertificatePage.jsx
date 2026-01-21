import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, Lock, Home, Award } from "lucide-react";


// ⚠️ 1. นำเข้าไฟล์รูปภาพของคุณตรงนี้ (เปลี่ยน path ให้ถูก)
// ถ้ายังไม่มีรูป ลองหาไฟล์ .png มาใส่ใน src/assets/ แล้ว import มา
import certificateBg from "../assets/certificate_bg.png"; 

// หรือถ้าทดสอบ ให้ใช้ URL รูปตัวอย่างจากเน็ตไปก่อน
// const certificateBg = "https://i.pinimg.com/originals/76/1b/30/761b3068fbb2396e9527f31c5188448d.jpg";

const CertificatePage = () => {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isLocked, setIsLocked] = useState(true);
  // const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // ... (Logic useEffect / fetchProgress เหมือนเดิม ไม่ต้องแก้) ...
  useEffect(() => {
    const fetchProgress = async () => {
       // ... (โค้ดเช็คด่านอันเดิม ใส่ไว้เหมือนเดิมเลยครับ) ...
       // เพื่อความสั้น ผมขอละไว้ในตัวอย่างนี้นะครับ 
       // แต่เวลาใช้งานจริง "ห้ามลบ" logic การเช็คด่านนะครับ!
       setIsLocked(false); // 🟢 บังคับปลดล็อคเพื่อทดสอบจัดวางตำแหน่ง
       setIsLoading(false);
    };
    fetchProgress();
  }, []);

  const handleDownload = async () => {
    if (certificateRef.current) {
      // ✅ เพิ่ม useCORS: true เพื่อให้โหลดรูปจาก URL ภายนอกได้ (กรณีรูปไม่อยู่ในเครื่อง)
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null, // พื้นหลังใส
        useCORS: true, 
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Certificate-${userName || "Player"}.png`;
      link.click();
    }
  };

  if (isLoading) return <div className="text-white text-center mt-20">Loading...</div>;

  if (isLocked) {
     // ... (ส่วนหน้าจอ Lock เหมือนเดิม) ...
     return <div className="text-white text-center mt-20">Locked</div>;
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center py-10 px-4 font-sans">
      
      {/* Header & Input Name */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-white flex gap-2 items-center">
          <Home size={20} /> กลับเมนูหลัก
        </button>
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        <label className="text-stone-400 text-sm">พิมพ์ชื่อของคุณที่จะให้ปรากฏบนใบประกาศ</label>
        <input
          type="text"
          placeholder="พิมพ์ชื่อภาษาไทย หรือ อังกฤษ"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-stone-900 border border-stone-700 text-white text-center text-xl px-6 py-3 rounded-xl focus:outline-none focus:border-orange-500 w-full max-w-md"
        />
      </div>

      {/* =======================================================
          🎨 ส่วนแสดงผลใบประกาศ (Image Overlay)
         ======================================================= */}
      <div className="overflow-x-auto w-full flex justify-center mb-8">
        
        {/* Container หลัก: กำหนดขนาดให้เท่ากับรูปภาพใบประกาศจริง */}
        <div
          ref={certificateRef}
          className="relative w-[800px] h-[600px] shadow-2xl flex-shrink-0 bg-white"
        >
          {/* 1. รูปพื้นหลัง (วางเต็มพื้นที่) */}
          <img 
            src={certificateBg} 
            alt="Certificate Background" 
            className="w-full h-full object-cover"
          />

          {/* 2. ชื่อผู้เล่น (วางทับลงไป) */}
          {/* 📍 วิธีปรับตำแหน่ง:
             - top-[50%] : เลื่อนลงมา 50% ของความสูง
             - left-0 w-full text-center : จัดกึ่งกลางแนวนอน
             - ปรับค่า top-[...] เพื่อเลื่อนขึ้นลงให้ตรงช่องว่างของรูป
          */}
          <div className="absolute top-[35%] left-0 w-full text-center z-10 px-10">
            <h1 
              className="text-[#1a1a1a] "
              style={{ 
                fontFamily: "'Dancing Script', cursive", // ฟอนต์ลายมือสวยๆ
                fontSize: "4rem", // ขนาดตัวอักษร
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)" // เงาเล็กน้อย
              }}
            >
              {userName || "ชื่อ-นามสกุล ของคุณ"}
            </h1>
          </div>

          {/* 3. วันที่ (ตัวอย่างการวางตำแหน่งอื่น) */}
          {/* <div className="absolute bottom-[18%] left-[22%] text-center z-10 w-40">
             <p className="text-stone-700 font-mono font-bold text-lg">
               {new Date().toLocaleDateString('th-TH')}
             </p>
          </div> */}

          {/* 4. ลายเซ็น/ข้อความอื่นๆ (ถ้ามี) */}
          {/* <div className="absolute bottom-[10%] right-[20%] ..."> ... </div> */}

        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={!userName}
        className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-orange-600 transition-transform hover:scale-105 disabled:opacity-50"
      >
        <Download size={24} /> ดาวน์โหลดใบประกาศ
      </button>

    </div>
  );
};

export default CertificatePage;
import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, Lock, Home, Award } from "lucide-react";
import { EXERCISES_DATA } from "../data/exercises"; // ✅ นำเข้าข้อมูลด่านเพื่อเช็คจำนวน

const CertificatePage = () => {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [userName, setUserName] = useState("");
  

  // 1. เช็คความคืบหน้า (Logic นี้ต้องปรับตามวิธีที่คุณเก็บ Save ใน LocalStorage)
  const { progress, isLocked } = useMemo(() => {
    // 2.1 นับจำนวนด่านทั้งหมด
    let totalLevels = 0;
    if (EXERCISES_DATA["normal"]?.["TH"]) totalLevels += EXERCISES_DATA["normal"]["TH"].length;
    if (EXERCISES_DATA["normal"]?.["EN"]) totalLevels += EXERCISES_DATA["normal"]["EN"].length;
    // นับจำนวนด่านที่เล่นจบแล้ว (สมมติเก็บใน localStorage ชื่อ 'completedLevels')
    // ตัวอย่างข้อมูลใน localStorage: ['normal-TH-1', 'normal-EN-2', ...]
    const savedData = JSON.parse(localStorage.getItem("completedLevels") || "[]");
    const completedCount = savedData.length;

    const locked = !(completedCount >= totalLevels && totalLevels > 0);

    // 🔒 ถ้าเล่นไม่ครบ ให้ Lock ไว้ (แก้เป็น >= เพื่อทดสอบ)
    return {
      progress: { completed: completedCount, total: totalLevels },
      isLocked: locked
    };
  }, []); // [] หมายถึงทำงานครั้งเดียวตอนโหลดหน้า

  // 2. ฟังก์ชันดาวน์โหลดรูปภาพ
  const handleDownload = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // เพิ่มความชัด
        backgroundColor: "#0a0a0a", // สีพื้นหลัง
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Certificate-${userName || "Player"}.png`;
      link.click();
    }
  };

  // --- กรณี: ยังเล่นไม่จบ ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white p-4 font-sans">
        <Lock size={64} className="text-stone-600 mb-4" />
        <h1 className="text-3xl font-bold text-stone-400 mb-2">ยังไม่ได้รับใบประกาศ</h1>
        <p className="text-stone-500 mb-6 text-center max-w-md">
          คุณต้องผ่านการฝึกพิมพ์ทุกด่านทั้งภาษาไทยและภาษาอังกฤษก่อน <br />
          ความคืบหน้า: <span className="text-orange-500 font-bold">{progress.completed}/{progress.total}</span> ด่าน
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors"
        >
          กลับไปฝึกต่อ
        </button>
      </div>
    );
  }

  // --- กรณี: เล่นจบแล้ว (หน้าใบประกาศ) ---
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center py-10 px-4 font-sans">
      
      {/* Header Controls */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-white flex gap-2 items-center">
          <Home size={20} /> กลับเมนูหลัก
        </button>
        <h2 className="text-xl text-orange-500 font-bold flex gap-2 items-center">
          <Award /> รับใบประกาศนียบัตร
        </h2>
      </div>

      {/* Input ชื่อ */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <label className="text-stone-400 text-sm">พิมพ์ชื่อของคุณ (ภาษาอังกฤษหรือไทย)</label>
        <input
          type="text"
          placeholder="Ex. Somchai Jaidee"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-stone-900 border border-stone-700 text-white text-center text-xl px-6 py-3 rounded-xl focus:outline-none focus:border-orange-500 w-full max-w-md"
        />
      </div>

      {/* --- 📜 ส่วนของใบประกาศ (ที่จะถูกแคปรูป) --- */}
      <div className="overflow-x-auto w-full flex justify-center mb-8">
        <div
          ref={certificateRef}
          className="relative w-[800px] h-[600px] bg-[#1a1a1a] border-[10px] border-double border-[#C5A059] p-10 flex flex-col items-center text-center shadow-2xl flex-shrink-0"
          style={{ backgroundImage: "radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 100%)" }}
        >
          {/* กรอบมุมตกแต่ง (Optional) */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#C5A059]"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#C5A059]"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#C5A059]"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#C5A059]"></div>

          {/* Logo / Header */}
          <div className="mt-10 mb-6">
             <Award size={60} className="text-[#C5A059] mx-auto mb-4" />
             <h1 className="text-5xl font-bold text-[#C5A059] uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
               Certificate
             </h1>
             <p className="text-[#8c734b] text-xl uppercase tracking-[0.3em] mt-2">Of Completion</p>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full">
            <p className="text-stone-400 text-lg italic mb-2">This is to certify that</p>
            
            {/* ชื่อผู้เล่น */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 py-4 border-b border-stone-700 w-3/4 mx-auto" style={{ fontFamily: "'Dancing Script', cursive" }}>
              {userName || "Your Name Here"}
            </h2>

            <p className="text-stone-300 text-lg mt-4 px-10 leading-relaxed">
              Has successfully completed the <strong>Ultimate Typing Mastery Course</strong> <br/>
              demonstrating exceptional speed and accuracy in both <br/>
              <span className="text-orange-400">Thai</span> and <span className="text-orange-400">English</span> typing.
            </p>
          </div>

          {/* Footer / Signature */}
          <div className="mt-auto w-full flex justify-between items-end px-12 pb-4">
             <div className="text-center">
                <div className="w-32 border-b border-[#C5A059] mb-2"></div>
                <p className="text-stone-500 text-xs uppercase">Date</p>
                <p className="text-white font-mono text-sm">{new Date().toLocaleDateString('en-GB')}</p>
             </div>
             
             {/* Seal */}
             <div className="relative">
                <div className="w-24 h-24 bg-[#C5A059] rounded-full flex items-center justify-center shadow-lg opacity-80">
                   <span className="text-[#1a1a1a] font-bold text-xs text-center border-2 border-[#1a1a1a] rounded-full p-1 w-20 h-20 flex items-center justify-center rotate-[-15deg]">
                      OFFICIAL<br/>TYPING<br/>MASTER
                   </span>
                </div>
             </div>

             <div className="text-center">
                <div className="text-2xl font-handwriting text-white mb-[-5px]" style={{ fontFamily: "'Dancing Script', cursive" }}>DevTeam</div>
                <div className="w-32 border-b border-[#C5A059] mb-2"></div>
                <p className="text-stone-500 text-xs uppercase">Instructor</p>
             </div>
          </div>
        </div>
      </div>

      {/* ปุ่มดาวน์โหลด */}
      <button
        onClick={handleDownload}
        disabled={!userName}
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#8c734b] text-black font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={24} /> ดาวน์โหลดใบประกาศ
      </button>

    </div>
  );
};

export default CertificatePage;
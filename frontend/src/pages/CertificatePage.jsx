import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, Lock, Home } from "lucide-react";
import axios from "axios";
import { EXERCISES_DATA } from "../data/exercises";
import certificateBg from "../assets/certificate_bg.png"; 

const CertificatePage = () => {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // ... (Logic การนับ Total Level คงเดิม ไม่ต้องแก้) ...
        let totalLevels = 0;
        if (EXERCISES_DATA["basic"]?.["TH"]) totalLevels += EXERCISES_DATA["basic"]["TH"].length;
        if (EXERCISES_DATA["basic"]?.["EN"]) totalLevels += EXERCISES_DATA["basic"]["EN"].length;
        if (EXERCISES_DATA["pro"]?.["TH"]) totalLevels += EXERCISES_DATA["pro"]["TH"].length;
        if (EXERCISES_DATA["pro"]?.["EN"]) totalLevels += EXERCISES_DATA["pro"]["EN"].length;

        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
          setIsLocked(true);
          setIsLoading(false);
          return;
        }
        const currentUser = JSON.parse(storedUser);

        // ✅ แก้ไข: ดึงชื่อจริง-นามสกุล มาต่อกันเพื่อแสดงผล
        // ถ้าไม่มีชื่อจริง (เช่น user เก่า) ให้ใช้ username แทน
        let displayName = currentUser.username;
        if (currentUser.firstName && currentUser.lastName) {
           displayName = `${currentUser.firstName} ${currentUser.lastName}`;
        }
        setUserName(displayName);

        const response = await axios.get(`http://localhost:3001/users/${currentUser.username}/progress`);
        const completedLevels = response.data.completedLevels || [];
        const completedCount = completedLevels.length;

        if (completedCount >= totalLevels && totalLevels > 0) {
          setIsLocked(false);
        } else {
          setIsLocked(true);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLocked(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleDownload = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true, 
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Certificate-${userName}.png`;
      link.click();
    }
  };

  if (isLoading) return <div className="text-white text-center mt-20">Loading...</div>;

  if (isLocked) {
     return <div className="text-white text-center mt-20">ยังไม่ได้รับใบประกาศ (ต้องผ่านทุกด่านก่อน)</div>;
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center py-10 px-4 font-sans">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-white flex gap-2 items-center">
          <Home size={20} /> กลับเมนูหลัก
        </button>
      </div>

      {/* ✅ ลบช่อง Input ออกไปแล้ว เพราะใช้ชื่อจากระบบอัตโนมัติ */}
      <div className="mb-8">
        <p className="text-stone-400 text-sm mb-2 text-center">ใบประกาศนียบัตรสำหรับคุณ</p>
        <h2 className="text-2xl text-orange-500 font-bold text-center">{userName}</h2>
      </div>

      <div className="overflow-x-auto w-full flex justify-center mb-8">
        <div
          ref={certificateRef}
          className="relative w-[800px] h-[600px] shadow-2xl flex-shrink-0 bg-white"
        >
          <img 
            src={certificateBg} 
            alt="Certificate Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-[35%] left-0 w-full text-center z-10 px-10">
            <h1 
              className="text-[#1a1a1a]"
              style={{ 
                fontFamily: "'Dancing Script', cursive",
                fontSize: "4rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {userName}
            </h1>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-orange-600 transition-transform hover:scale-105"
      >
        <Download size={24} /> ดาวน์โหลดใบประกาศ
      </button>

    </div>
  );
};

export default CertificatePage;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, Lock, Home, CheckCircle } from "lucide-react"; 
import axios from "axios";
import { EXERCISES_DATA } from "../data/exercises";

// ✅ 1. Import รูปภาพแยก 2 ใบ (ตรวจสอบชื่อไฟล์ให้ตรงกับในโฟลเดอร์ assets ของคุณ)
import certificateBasicBg from "../assets/certificate_basic.png"; 
import certificateProBg from "../assets/certificate_pro.png";     

const CertificatePage = () => {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("basic");

  const [unlockStatus, setUnlockStatus] = useState({
    basic: false,
    pro: false
  });

  const [progressData, setProgressData] = useState({
    basic: { completed: 0, total: 0 },
    pro: { completed: 0, total: 0 }
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const basicTotal = (EXERCISES_DATA["basic"]?.["TH"]?.length || 0) + (EXERCISES_DATA["basic"]?.["EN"]?.length || 0);
        const proTotal = (EXERCISES_DATA["pro"]?.["TH"]?.length || 0) + (EXERCISES_DATA["pro"]?.["EN"]?.length || 0);

        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
          setIsLoading(false);
          return;
        }
        const currentUser = JSON.parse(storedUser);

        let displayName = currentUser.username;
        if (currentUser.firstName && currentUser.lastName) {
           displayName = `${currentUser.firstName} ${currentUser.lastName}`;
        }
        setUserName(displayName);

        const response = await axios.get(`http://localhost:3001/users/${currentUser.username}/progress`);
        const completedLevels = response.data.completedLevels || [];

        const passedBasic = completedLevels.filter(l => l.startsWith("basic")).length;
        const passedPro = completedLevels.filter(l => l.startsWith("pro")).length;

        setProgressData({
            basic: { completed: passedBasic, total: basicTotal },
            pro: { completed: passedPro, total: proTotal }
        });

        setUnlockStatus({
            basic: passedBasic >= basicTotal && basicTotal > 0,
            pro: passedPro >= proTotal && proTotal > 0
        });

      } catch (error) {
        console.error("Error fetching data:", error);
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
      link.download = `Certificate-${selectedType.toUpperCase()}-${userName}.png`;
      link.click();
    }
  };

  if (isLoading) return <div className="text-white text-center mt-20 animate-pulse">Checking records...</div>;

  const isCurrentLocked = !unlockStatus[selectedType];
  const currentProgress = progressData[selectedType];

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center py-10 px-4 font-sans">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-white flex gap-2 items-center transition-colors">
          <Home size={20} /> กลับเมนูหลัก
        </button>
      </div>

      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-6">
         เลือกใบประกาศนียบัตร
      </h2>

      {/* ปุ่มเลือก Tab */}
      <div className="flex gap-4 mb-8 bg-stone-900 p-2 rounded-full border border-stone-800">
        <button
          onClick={() => setSelectedType("basic")}
          className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
            selectedType === "basic" 
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
              : "text-stone-500 hover:text-stone-300"
          }`}
        >
          ระดับพื้นฐาน {unlockStatus.basic && <CheckCircle size={16} />}
        </button>

        <button
          onClick={() => setSelectedType("pro")}
          className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
            selectedType === "pro" 
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30" 
              : "text-stone-500 hover:text-stone-300"
          }`}
        >
          ระดับใช้ได้ {unlockStatus.pro && <CheckCircle size={16} />}
        </button>
      </div>

      {isCurrentLocked ? (
        <div className="flex flex-col items-center justify-center bg-stone-900/50 p-12 rounded-3xl border border-stone-800 backdrop-blur-sm animate-fade-in text-center">
             <div className="bg-stone-800 p-4 rounded-full mb-4 inline-block">
                <Lock size={48} className="text-stone-500" />
             </div>
             <h3 className="text-2xl font-bold text-stone-300 mb-2">
                 {selectedType === "basic" ? "ระดับพื้นฐาน" : "ระดับใช้ได้"} ยังไม่ปลดล็อค
             </h3>
             <p className="text-stone-500 mb-6">
                 คุณต้องผ่านด่านทั้งหมดของระดับนี้ก่อน <br/>
                 <span className="text-orange-500 font-bold">
                    ความคืบหน้า: {currentProgress.completed} / {currentProgress.total} ด่าน
                 </span>
             </p>
             <button onClick={() => navigate("/")} className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors">
                 กลับไปฝึกต่อ
             </button>
        </div>
      ) : (
        <>
            <div className="overflow-x-auto w-full flex justify-center mb-8 animate-slide-up">
                <div
                    ref={certificateRef}
                    className="relative w-[800px] h-[600px] shadow-2xl flex-shrink-0 bg-white"
                >
                    {/* ✅ 2. เปลี่ยนรูปภาพตาม selectedType */}
                    <img 
                        src={selectedType === "basic" ? certificateBasicBg : certificateProBg} 
                        alt="Certificate Background" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* ชื่อผู้เล่น */}
                    <div className="absolute top-[39%] left-0 w-full text-center z-10 px-10">
                        <h1 
                        className="text-[#1a1a1a]"
                        style={{ 
                            fontFamily: "'itim', cursive",
                            fontSize: "3rem",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                        }}
                        >
                        {userName}
                        </h1>
                    </div>

                    {/* วันที่ */}
                    <div className="absolute bottom-[8.5%] right-[5%] text-center z-10">
                        <p className="text-stone-600 font-itim text-m">
                            {new Date().toLocaleDateString('en-GB')}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleDownload}
                className={`flex items-center gap-2 px-8 py-4 font-bold text-lg rounded-full shadow-lg transition-transform hover:scale-105 ${
                    selectedType === "basic" 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-amber-500 hover:bg-amber-600 text-black"
                }`}
            >
                <Download size={24} /> 
                ดาวน์โหลดใบประกาศ ({selectedType === "basic" ? "พื้นฐาน" : "ระดับใช้ได้"})
            </button>
        </>
      )}

    </div>
  );
};

export default CertificatePage;
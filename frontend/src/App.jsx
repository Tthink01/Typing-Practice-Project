import React from 'react';
import Navbar from './components/Navbar';
import ModeCard from './components/ModeCard';

function App() {
  return (
    // Background หลัก: สีดำไล่เฉดแดงๆ นิดหน่อยตรงกลาง
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* แสงพื้นหลังสีส้มจางๆ (Glow Effect) */}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-10">
        
        {/* Hero Section: หัวข้อใหญ่ */}
        <div className="text-center mb-16 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
            ฝึกพิมพ์สัมผัส <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">E & T</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            โหมดฝึกฝนเพื่อพัฒนาทักษะ หรือเลื่อนไปทางขวาเพื่อทดสอบความเร็ว
          </p>
        </div>

        {/* Card Container: วางการ์ดเรียงกัน */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center w-full max-w-4xl z-10">
          
          {/* Card 1: ระดับพื้นฐาน (ไม่ล็อค) */}
          <ModeCard 
            title="ฝึกฝนระดับพื้นฐาน"
            level="BASIC LEVEL"
            description="ผู้ใช้ต้องเล่นผ่านด่าน 3 รอบ เพื่อปลดล็อคระดับต่อไป"
            isLocked={false}
          />

          {/* Card 2: ระดับใช้ได้ (ล็อคไว้ก่อน) */}
          <ModeCard 
            title="ฝึกฝนระดับใช้ได้"
            level="PRO LEVEL"
            description="เป้าหมาย 30-50 คำ/นาที ฝึกความแม่นยำและความเร็ว"
            isLocked={true} // ลองเปลี่ยนเป็น false ดู ถ้าอยากเห็นตอนปลดล็อค
          />

        </div>
      </main>

      {/* ลูกศรขวา (ถ้ามี) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
         <button className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-500 text-orange-500">
           ❯
         </button>
      </div>

    </div>
  );
}

export default App;
import React from 'react';
import { Keyboard, ArrowRight } from 'lucide-react'; // อย่าลืม npm install lucide-react

// Component นี้รับ prop ชื่อ onStart (ฟังก์ชันที่จะทำงานเมื่อกดปุ่มเริ่ม)
const WelcomeScreen = ({ onStart }) => {
  return (
    // Container หลัก: เต็มจอ (fixed inset-0), สีดำเข้ม (bg-stone-950), จัดกึ่งกลาง (flex center)
    <div className="fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-center text-center overflow-hidden font-sans">
      
      {/* --- ส่วน Background Decor (แสงพื้นหลัง) --- */}
      {/* ใช้ Tailwind: absolute, blur, animate-pulse เพื่อให้แสงวิบวับ */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      {/* --- ส่วน Floating Elements (ตัวอักษรลอยๆ) --- */}
      {/* ใช้ animate-float ที่เราตั้งค่าไว้ใน config */}
      <div className="absolute top-20 left-20 text-stone-700 text-6xl font-black opacity-20 animate-float">ก</div>
      <div className="absolute bottom-32 right-20 text-stone-700 text-6xl font-black opacity-20 animate-float-slow">A</div>
      <div className="absolute top-40 right-1/3 text-stone-700 text-4xl font-black opacity-10 animate-float">5</div>
      
      {/* --- ส่วนเนื้อหาหลัก (Content) --- */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl px-6 animate-fade-in-up">
        
        {/* Logo Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl shadow-2xl shadow-orange-500/20 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-500">
           <Keyboard className="text-white w-12 h-12" />
        </div>

        {/* หัวข้อ (Text Gradient & Shine) */}
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-200 to-orange-500 animate-text-shine bg-[length:200%_auto]">
            E & T Touch Typing
          </h1>
          <p className="text-stone-400 text-xl md:text-2xl font-light tracking-wide mt-4">
            ฝึกฝนทักษะการพิมพ์สัมผัสของคุณให้ <span className="text-orange-400 font-bold">เร็ว</span> และ <span className="text-lime-400 font-bold">แม่นยำ</span>
          </p>
        </div>

        {/* เส้นขีดคั่น */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-stone-700 to-transparent my-2"></div>

        {/* ปุ่มเริ่ม (Start Button) */}
        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-stone-900 border border-orange-500/30 rounded-full font-bold text-xl text-white shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          {/* เอฟเฟกต์แสงวิ่งผ่านปุ่ม (Shimmer) */}
          <div className="absolute top-0 -left-full w-1/2 h-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-sweep" />
          
          <span className="relative flex items-center gap-3">
              เข้าสู่เว็บไซต์ <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        
        <p className="text-stone-600 text-sm mt-8">พัฒนาทักษะการพิมพ์ ไทย-อังกฤษ แบบมืออาชีพ</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
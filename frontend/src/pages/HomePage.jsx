// HomePage.js
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ModeCard from '../components/ModeCard';

export default function HomePage() {
  // สมมติข้อมูลที่ได้จาก Backend หรือ State
  const userProgress = {
    isBasicCompleted: false // ผู้ใช้ยังไม่ผ่านระดับพื้นฐาน
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <HeroSection 
          title="ฝึกพิมพ์สัมผัส E & T" 
          subtitle="โหมดฝึกฝนเพื่อพัฒนาทักษะ หรือเลื่อนไปทางขวาเพื่อทดสอบความเร็ว"
        />

        {/* ส่วนแสดงการ์ดเลือกโหมด */}
        <div className="flex gap-6 justify-center mt-10 flex-wrap">
          
          {/* การ์ดที่ 1: Basic (ปลดล็อคเสมอ) */}
          <ModeCard 
            title="ฝึกฝนระดับพื้นฐาน"
            level="BASIC LEVEL"
            description="ผู้ใช้ต้องเล่นผ่านด่าน 3 รอบ..."
            isLocked={false}
            actionText="เริ่มฝึกฝน"
            onAction={() => console.log("Go to Basic Game")}
          />

          {/* การ์ดที่ 2: Pro (ล็อคตามเงื่อนไข) */}
          <ModeCard 
            title="ฝึกฝนระดับใช้ได้"
            level="PRO LEVEL"
            description="เป้าหมาย 30-50 คำ/นาที..."
            isLocked={!userProgress.isBasicCompleted} // เช็คเงื่อนไขล็อคตรงนี้
            actionText={!userProgress.isBasicCompleted ? "ยังไม่ปลดล็อค" : "เริ่มฝึกฝน"}
            onAction={() => console.log("Go to Pro Game")}
          />
          
        </div>
      </div>
    </div>
  );
}
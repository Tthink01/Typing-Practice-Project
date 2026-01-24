// ✅ 1. ค่า Config ของเกม (ความยาก/ง่าย)
export const GAME_CONFIG = {
  PASS_REQUIRED_COUNT: 3,  // จำนวนรอบที่ต้องชนะเพื่อผ่าน
  TIME_LIMIT_SEC: 40,      // เวลาต่อรอบ (วินาที)

  // เกณฑ์การผ่าน (ย้ายค่ามาจากไฟล์เก่า)
  BASIC: {
    MIN_ACCURACY: 80, 
    MIN_WPM: 20       
  },
  PRO: {
    MIN_ACCURACY: 90, 
    MIN_WPM: 30       
  }
};

// ✅ 2. ฟังก์ชันเช็คสถานะด่าน (ตัวที่ Error หาไม่เจอ)
export const checkLevelStatus = (levelId, userHighestPassedLevel) => {
  // แปลงเป็นตัวเลขก่อนเพื่อความชัวร์
  const currentLevel = Number(levelId);
  const highestPassed = Number(userHighestPassedLevel) || 0;

  // สูตร: เล่นได้ถ้า เลเวลปัจจุบัน <= ด่านที่ผ่านแล้ว + 1
  const isUnlocked = currentLevel <= highestPassed + 1;
  const isPassed = currentLevel <= highestPassed;

  return {
    isUnlocked,
    isPassed
  };
};

// ✅ 3. ฟังก์ชันเช็คว่าผ่านเกณฑ์ไหม (สำหรับตอนเล่นจบ)
export const canPassLevel = (passedCount) => {
  return passedCount >= GAME_CONFIG.PASS_REQUIRED_COUNT;
};
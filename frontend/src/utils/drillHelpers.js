// ฟังก์ชันจำลองการสร้างโจทย์ (คุณต้องเขียน Logic จริงเชื่อมกับ DB หรือ Array ของคุณ)
export const generateDrillContent = (type, levelId, language) => {
  if (language === 'TH') {
    return "ฟหกด ่าสว กา กาด กาก"; // ตัวอย่าง
  }
  return "asdf jkl; flask falls";
};

// ฟังก์ชันคำนวณ WPM
export const calculateStats = (finalInput, targetText, durationMin, ) => {
    const wpm = Math.round((finalInput.length / 5) / durationMin) || 0;
    
    let correctChars = 0;
    for (let i = 0; i < finalInput.length; i++) {
        if (finalInput[i] === targetText[i]) correctChars++;
    }
    
    const accuracyBase = finalInput.length > 0 ? finalInput.length : 1;
    const accuracy = Math.round((correctChars / accuracyBase) * 100);

    // หาปุ่มเร็ว/ช้า (Copy Logic เดิมมาใส่)
    let fast = { char: '-', time: Infinity };
    let slow = { char: '-', time: 0 };
    // ... Logic เดิม ... (รับ keyTimes เข้ามาประมวลผล)

    return { wpm, accuracy, fast, slow };
};
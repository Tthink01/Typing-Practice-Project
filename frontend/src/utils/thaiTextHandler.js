// src/utils/thaiTextHandler.js

const isUpperMark = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0x0E31 && code <= 0x0E37) || (code >= 0x0E47 && code <= 0x0E4E);
};

const isLowerMark = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0x0E38 && code <= 0x0E3A;
};

// เช็คว่าเป็นสระอำ หรือวรรณยุกต์
const isTone = (char) => {
    const code = char.charCodeAt(0);
    return code >= 0x0E48 && code <= 0x0E4B;
}

// 1. ฟังก์ชันจัดระเบียบข้อความ (แก้ปัญหาสระอำลำดับผิด)
export const preprocessThaiText = (text) => {
    let chars = text.split('');
    let result = [];
    
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const nextChar = chars[i + 1];

        // แก้ปัญหา "น้ำ": ถ้าเจอ สระอำ ตามด้วย วรรณยุกต์ (เช่น น + ำ + ้)
        // ให้สลับเป็น วรรณยุกต์ มาก่อน (น + ้ + ำ) 
        // *หมายเหตุ: Logic นี้ขึ้นอยู่กับ Font ที่ใช้ แต่ส่วนใหญ่สลับแล้วจะสวยกว่า
        if (char === 'ำ' && nextChar && isTone(nextChar)) {
            result.push(nextChar); // เอาวรรณยุกต์มาก่อน
            result.push(char);     // แล้วค่อยตามด้วยสระอำ
            i++; // ข้ามตัวถัดไปเพราะเอามาใส่แล้ว
        } else {
            result.push(char);
        }
    }
    return result; // ส่งกลับเป็น Array ของตัวอักษรที่เรียงใหม่แล้ว
};

// 2. ฟังก์ชันจัดกลุ่มเพื่อแสดงผล (Grouping)
export const groupThaiChars = (chars) => {
    let groups = [];
    let currentGroup = null;

    chars.forEach((char, originalIndex) => {
        const isUpper = isUpperMark(char);
        const isLower = isLowerMark(char);
        const isMark = isUpper || isLower;

        // ถ้าเป็นพยัญชนะต้น หรือ สระที่กินพื้นที่ (เช่น ะ า ำ เ แ โ ไ) -> ขึ้นกลุ่มใหม่
        if (!isMark) {
            currentGroup = {
                base: { char, index: originalIndex },
                marks: [] // เก็บสระบน/ล่าง ที่จะมาเกาะตัวนี้
            };
            groups.push(currentGroup);
        } 
        // ถ้าเป็นสระลอย/จม -> ให้ไปเกาะกลุ่มล่าสุด
        else if (currentGroup) {
            currentGroup.marks.push({ char, index: originalIndex, isUpper, isLower });
        }
        // กรณี error (สระมาตัวแรกสุด) -> สร้างกลุ่มหลอกๆ มารับ
        else {
            groups.push({
                base: { char, index: originalIndex },
                marks: []
            });
        }
    });
    return groups;
};
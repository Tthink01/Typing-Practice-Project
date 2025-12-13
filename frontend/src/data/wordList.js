// src/data/wordLists.js

export const WORD_LISTS = {
  TH: [
    "นอน", "รู้", "มา", "อ่าน", "ฟัง", "ของ", "ไป", "คน", "ให้", "รัก", "พูด",
    "งาน", "สุข", "ได้", "ยิ่ง", "เรียน", "รถ", "เงิน", "ทำ", "ใจ", "ดี",
    "คิด", "เห็น", "มอง", "เดิน", "เล่น", "กิน", "ข้าว", "น้ำ", "บ้าน", "เพื่อน"
  ],
  EN: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she"
  ]
};

/**
 * สุ่มข้อความสำหรับพิมพ์
 * @param {'TH' | 'EN'} lang ภาษา
 * @param {number} count จำนวนคำ
 * @returns {string}
 */
export const getRandomText = (lang = 'TH', count = 40) => {
  const wordList = WORD_LISTS[lang] || WORD_LISTS.TH;

  const safeCount = Math.max(1, Number(count) || 40);
  const result = [];

  for (let i = 0; i < safeCount; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    result.push(wordList[randomIndex]);
  }

  return result.join(" ");
};

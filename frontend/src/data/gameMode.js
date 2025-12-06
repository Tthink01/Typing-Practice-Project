// src/data/gameModes.js
export const GAME_MODES = [
  {
    id: 1,
    title: "ฝึกฝนระดับพื้นฐาน",
    level: "BASIC LEVEL",
    description: "ผู้ใช้ต้องเล่นผ่านด่าน 3 รอบ เพื่อปลดล็อคระดับต่อไป",
    isLocked: false,
    path: "/game/basic"
  },
  {
    id: 2,
    title: "ฝึกฝนระดับใช้ได้",
    level: "PRO LEVEL",
    description: "เป้าหมาย 30-50 คำ/นาที ฝึกความแม่นยำและความเร็ว",
    isLocked: true,
    path: "/game/pro"
  }
];
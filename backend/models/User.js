// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // ✅ เพิ่ม unique: true เพื่อไม่ให้สมัครชื่อซ้ำ
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  progress: {
    type: Object,
    default: {
      // แยก Basic เป็น ไทย / อังกฤษ
      basic_TH: { highestPassedLevel: 0, scores: {} },
      basic_EN: { highestPassedLevel: 0, scores: {} },

      // แยก Pro เป็น ไทย / อังกฤษ
      pro_TH: { highestPassedLevel: 0, scores: {} },
      pro_EN: { highestPassedLevel: 0, scores: {} },
    },
  },
});

// ปกติใช้ "users" (ชื่อ collection) หรือ "User" (ชื่อ Model)
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

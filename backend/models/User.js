// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // ✅ เพิ่ม unique: true เพื่อไม่ให้สมัครชื่อซ้ำ
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  progress: {
    basic: {
      highestPassedLevel: { type: Number, default: 0 },
      // ✅ เพิ่ม default: {} กัน Error
      scores: { type: Map, of: Number, default: {} },
    },
    pro: {
      highestPassedLevel: { type: Number, default: 0 },
      // ✅ เพิ่ม default: {} กัน Error
      scores: { type: Map, of: Number, default: {} },
    },
  },
});

// ปกติใช้ "users" (ชื่อ collection) หรือ "User" (ชื่อ Model)
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

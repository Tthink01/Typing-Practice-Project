// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

// --- เชื่อมต่อ MongoDB ---
// *สำคัญ: เปลี่ยนตรงนี้เป็น Connection String ของคุณ (จาก MongoDB Atlas หรือ Local)*
mongoose.connect("mongodb://127.0.0.1:27017/typing-game");

// --- API: สมัครสมาชิก (Register) ---
app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// --- API: เข้าสู่ระบบ (Login) ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({ status: "Success", message: "Login สำเร็จ!", user: user });
      } else {
        res.json({ status: "Error", message: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      res.json({ status: "Error", message: "ไม่พบผู้ใช้งานนี้" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

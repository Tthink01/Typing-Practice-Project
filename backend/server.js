const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // 1. ✅ เพิ่ม import path
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

// --- 1. CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://typing-practice-ogdr.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS Blocked:", origin);
      callback(null, true);
    }
  },
  credentials: true
}));

// --- 2. MongoDB ---
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: ไม่พบ MONGO_URI");
} else {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ เชื่อมต่อ MongoDB สำเร็จ!"))
    .catch((err) => console.error("❌ DB Error:", err));
}

// --- 3. Routes API ---
// (ควรวาง API ไว้ก่อนส่วน Static Files)
app.use(userRoutes);


// =========================================================
// 4. ✅ ส่วนที่เพิ่ม: ตั้งค่าให้ Server เสิร์ฟหน้าเว็บ React
// =========================================================

// 4.1 บอกตำแหน่งโฟลเดอร์ที่ Build มา (dist)
// หมายเหตุ: เช็คให้ดีว่าโฟลเดอร์ client ของคุณชื่อ 'client' ใช่ไหม
const clientBuildPath = path.join(__dirname, "../client/dist"); 

// สั่งให้ Express ใช้ไฟล์ในโฟลเดอร์นั้นได้
app.use(express.static(clientBuildPath));

// 4.2 ❌ ลบ Route "/" อันเดิมออก (หรือคอมเมนต์ทิ้ง)
// app.get("/", (req, res) => {
//   res.send("✅ API is running! (Typing Game Backend)");
// });

// 4.3 ✨ CATCH-ALL ROUTE (พระเอกที่จะแก้ปัญหา Not Found) ✨
// ถ้า User เข้ามาด้วย URL อะไรก็ตามที่ Server ไม่รู้จัก ให้ส่ง index.html กลับไป
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// =========================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
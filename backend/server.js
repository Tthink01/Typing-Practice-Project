const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config(); // โหลด .env แบบปกติ (ถ้าไม่มีไฟล์ก็ไม่ Error)

const app = express();
app.use(express.json());

// --- 1. แก้ CORS (อนุญาตให้ Frontend เข้าถึงได้) ---
// ใส่ URL ของ Frontend ที่คุณ Deploy เสร็จแล้วลงไปใน array นี้
const allowedOrigins = [
  "http://localhost:5173", // สำหรับรันในเครื่อง
  "https://typing-practice-ogdr.onrender.com/" // ⚠️ อย่าลืมแก้ตรงนี้เป็น Link Frontend จริง
];

app.use(cors({
  origin: function (origin, callback) {
    // อนุญาตถ้าไม่มี origin (เช่น Postman) หรือถ้า origin อยู่ใน allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS Blocked:", origin);
      callback(null, true); // หรือ callback(new Error('Not allowed by CORS')) ถ้าอยากเข้มงวด
    }
  },
  credentials: true
}));

// --- 2. ดึงค่า MONGO_URI ---
const mongoURI = process.env.MONGO_URI;

// --- 3. เพิ่ม Route หน้าแรก (แก้ปัญหา Cannot GET /) ---
app.get("/", (req, res) => {
  res.send("✅ API is running! (Typing Game Backend)");
});

// --- ตรวจสอบก่อนเชื่อมต่อ ---
if (!mongoURI) {
  console.error("❌ ERROR: ไม่พบ MONGO_URI");
  console.error("👉 บน Render: ไปที่ Dashboard > Environment > Add MONGO_URI");
} else {
    // --- เชื่อมต่อ MongoDB ---
    mongoose
      .connect(mongoURI)
      .then(() => console.log("✅ เชื่อมต่อ MongoDB สำเร็จ!"))
      .catch((err) => console.error("❌ DB Error:", err));
}

app.use(userRoutes);

// --- 4. แก้ Port (ต้องใช้ process.env.PORT) ---
const PORT = process.env.PORT || 3001; // ถ้า Render ส่ง Port มาให้ใช้ Port นั้น ถ้าไม่มีใช้ 3001

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
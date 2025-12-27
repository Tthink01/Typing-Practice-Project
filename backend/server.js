// 1. เรียก path มาเป็นอันดับแรก
const path = require('path');

// 2. ระบุตำแหน่งไฟล์ .env (ให้มองหาในโฟลเดอร์เดียวกับไฟล์นี้)
const envPath = path.resolve(__dirname, '.env');

// 3. สั่งโหลดไฟล์
console.log("📂 กำลังอ่านไฟล์ .env จาก:", envPath);
const result = require('dotenv').config({ path: envPath });


// เช็คว่า dotenv มี Error ในการอ่านไฟล์ไหม
if (result.error) {
    console.error("⚠️ อ่านไฟล์ .env ไม่ได้! ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่");
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// --- ดึงค่า MONGO_URI ---
// ถ้าอ่านจาก .env ไม่ได้ ให้ลองใช้ค่าสำรอง (Hardcode) เพื่อให้รันผ่านไปก่อน
const mongoURI = process.env.MONGO_URI;

console.log("🔑 ค่า MONGO_URI ที่อ่านได้:", mongoURI);

// --- ตรวจสอบก่อนเชื่อมต่อ ---
if (!mongoURI) {
    console.error("❌ ERROR: ไม่พบ MONGO_URI ในไฟล์ .env");
    console.error("👉 วิธีแก้: เช็คไฟล์ .env หรือใส่ Connection String ตรงๆ ใน mongoose.connect()");
    // หยุดการทำงานถ้าไม่มี Link ฐานข้อมูล (ดีกว่าปล่อยให้ Crash)
    process.exit(1); 
}

// --- เชื่อมต่อ MongoDB ---
mongoose
  .connect(mongoURI) // ใช้ตัวแปรที่เราเช็คแล้ว
  .then(() => console.log("✅ เชื่อมต่อ MongoDB สำเร็จ!"))
  .catch((err) => console.error("❌ DB Error (เชื่อมต่อไม่ได้):", err));

app.use(userRoutes);

app.listen(3001, () => {
  console.log("🚀 Server is running on port 3001");
});
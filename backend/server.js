// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- เชื่อมต่อ MongoDB ---
// *สำคัญ: เปลี่ยนตรงนี้เป็น Connection String ของคุณ (จาก MongoDB Atlas หรือ Local)*
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas")) // ถ้าติด ให้บอกว่าติด
  .catch((err) => console.error("❌ DB Error:", err)); // ถ้าพัง ให้บอก Error

app.use(userRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

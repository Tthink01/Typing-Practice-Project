// src/utils/api.js
import axios from "axios";

// บรรทัดนี้คือพระเอก: มันจะเลือกให้อัตโนมัติว่า
// - ถ้าอยู่บนเครื่องเรา -> ใช้ http://localhost:3001
// - ถ้าอยู่บน Render -> ใช้ Link ที่เราใส่ใน VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
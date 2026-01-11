import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios' // ✅ 1. เพิ่มบรรทัดนี้

// ==========================================
// 🔥 สูตรโกง: เปลี่ยน URL อัตโนมัติ (Global Fix)
// ==========================================

// ดึงค่า URL จาก Environment Variable ของ Render
const PRODUCTION_URL = import.meta.env.VITE_API_URL; 

// ตรวจสอบว่ามีค่า URL ของ Render ไหม (ถ้ามีแปลว่าอยู่บน Cloud)
if (PRODUCTION_URL) {
  console.log("🚀 Running in Production Mode. API pointing to:", PRODUCTION_URL);

  axios.interceptors.request.use((config) => {
    // ถ้าในโค้ดเดิมเขียนว่า http://localhost:3001
    if (config.url && config.url.includes("http://localhost:3001")) {
      // เปลี่ยนเป็น Link ของ Render ทันที
      const newUrl = config.url.replace("http://localhost:3001", PRODUCTION_URL);
      config.url = newUrl;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

// ==========================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
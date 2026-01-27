import React, { useState, useEffect } from "react"; 
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "axios"; // ✅ เพิ่ม axios

// Import Pages & Components
import HomePage from "./pages/HomePage";
import SandboxPage from "./pages/SandboxPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import PracticePage from './pages/PracticePage';
import Navbar from "./components/Navbar";
import AdminTools from './components/Admin/AdminTools';
import PageTransition from "./components/Shared/PageTransition";
import CertificatePage from "./pages/CertificatePage";
import ServerWakingUp from './components/ServerWakingUp'; 
import HistoryPage from "./pages/HistoryPage";

const PAGE_DEPTHS = {
  "/": 0,
  "/sandbox": 1,
  "/game": 2,
  "/admin": 3,
  "/login": 4,
};

const getDepth = (pathname) => {
  if (pathname.startsWith("/game")) return 2;
  return PAGE_DEPTHS[pathname] || 0;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const currentDepth = getDepth(location.pathname);
  
  const [navState, setNavState] = useState({
    prevDepth: currentDepth,
    direction: 0
  });
  
  if (currentDepth !== navState.prevDepth) {
    const nextDirection = currentDepth > navState.prevDepth ? 1 : -1;
    setNavState({
      prevDepth: currentDepth,
      direction: nextDirection
    });
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence custom={navState.direction} mode="popLayout">
        <Routes location={location} key={location.pathname}>
          
          <Route 
            path="/" 
            element={
              <PageTransition direction={navState.direction}>
                <HomePage />
              </PageTransition>
            } 
          />

          <Route 
            path="/sandbox" 
            element={
              <PageTransition direction={navState.direction}>
                <SandboxPage />
              </PageTransition>
            } 
          />

          <Route path="/login" element={<PageTransition direction={navState.direction}><LoginPage /></PageTransition>} />
          <Route path="/admin" element={<PageTransition direction={navState.direction}><AdminPage /></PageTransition>} />
          <Route path="/game/:mode/:levelId" element={<PageTransition direction={navState.direction}><PracticePage /></PageTransition>} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/history" element={<PageTransition direction={navState.direction}><HistoryPage /></PageTransition>} />

        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  // ✅ State สำหรับเช็คว่า Server หลับอยู่หรือไม่
  const [isServerWaking, setIsServerWaking] = useState(false);

  // ✅ Effect: ยิงไปเช็ค Server ทันทีที่เข้าเว็บ
  useEffect(() => {
    const checkServerStatus = async () => {
      // 1. ตั้งเวลา: ถ้าผ่านไป 1.5 วิ แล้วยังไม่ตอบกลับ ให้โชว์ Popup
      const timeoutId = setTimeout(() => {
        setIsServerWaking(true);
      }, 1500);

      try {
        // 2. ยิงไปที่ /health
        // (ดึง URL จาก Environment Variable หรือใช้ localhost ถ้าไม่มี)
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        await axios.get(`${apiUrl}/health`);

        // 3. ถ้าตอบกลับมาแล้ว ให้เคลียร์ Timeout และปิด Popup ทันที
        clearTimeout(timeoutId);
        setIsServerWaking(false);
        console.log("✅ Server is awake!");

      } catch (error) {
        // กรณี Error (เช่นเน็ตหลุด) ก็ปิด Popup ไปก่อนเพื่อไม่ให้รบกวน User
        clearTimeout(timeoutId);
        setIsServerWaking(false);
        console.error("Server check failed", error);
      }
    };

    checkServerStatus();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <AdminTools />
      
      <AnimatedRoutes />

      {/* ✅ แสดง Popup เมื่อ Server กำลังตื่น */}
      {isServerWaking && <ServerWakingUp />}
      
    </BrowserRouter>
  );
}

export default App;
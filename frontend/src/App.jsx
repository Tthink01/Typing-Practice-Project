import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import หน้าต่างๆ
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SandboxPage from "./pages/SandboxPage";
// import GamePage from './pages/GamePage'; // (ถ้ามี)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าหลัก */}
        <Route path="/" element={<HomePage />} />
         {/* หน้าทดลองพิมพ์ */}
        <Route path="/sandbox" element={<SandboxPage />} />


        {/* หน้า Login/Register */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/Sandbox" element={<SandboxPage />} />
        
        

        {/* หน้าเกม (ตัวอย่าง) */}
        {/* <Route path="/game/:mode" element={<GamePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

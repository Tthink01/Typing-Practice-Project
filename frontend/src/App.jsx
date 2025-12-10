import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import หน้าต่างๆ
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";


// import GamePage from './pages/GamePage'; // (ถ้ามี)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าหลัก */}
        <Route path="/" element={<HomePage />} />

        {/* หน้า Login/Register */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminPage />} />

        

        {/* หน้าเกม (ตัวอย่าง) */}
        {/* <Route path="/game/:mode" element={<GamePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

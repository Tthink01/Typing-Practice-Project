import React, { useState } from "react"; // ✅ กลับมาใช้ useState แต่เขียนแบบพิเศษ
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import Pages & Components
import HomePage from "./pages/HomePage";
import SandboxPage from "./pages/SandboxPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import PracticePage from './pages/PracticePage';
import Navbar from "./components/Navbar";
import AdminTools from './components/Admin/AdminTools';
import PageTransition from "./components/Shared/PageTransition";

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

      </Routes>
    </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AdminTools />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
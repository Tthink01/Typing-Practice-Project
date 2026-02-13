import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { History, Trophy, Activity, Home, Calendar } from "lucide-react";
import { EXERCISES_DATA } from "../data/exercises"; // Import ข้อมูลด่านมาใช้นับ

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress"); // 'progress' | 'sandbox'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ completedLevels: [], sandboxHistory: [] });

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (!storedUser) return navigate("/login");
      const user = JSON.parse(storedUser);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const res = await axios.get(`${apiUrl}/users/${user.username}/history`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // ฟังก์ชันคำนวณด่านปัจจุบัน
  const getCurrentLevel = (mode, lang) => {
    // นับจำนวนด่านที่ผ่านในหมวดนั้นๆ (เช่น basic_TH)
    const passedCount = data.completedLevels.filter((lvl) =>
      lvl.startsWith(`${mode}_${lang}`),
    ).length;

    // หาจำนวนด่านทั้งหมด
    const total = EXERCISES_DATA[mode]?.[lang]?.length || 0;

    if (passedCount >= total) return "ครบทุกด่านแล้ว! 🎉";
    return `กำลังเล่นด่านที่ ${passedCount + 1}`;
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 font-sans flex flex-col items-center transition-colors duration-300">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white flex gap-2 items-center transition-colors"
        >
          <Home size={20} /> กลับเมนูหลัก
        </button>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:to-yellow-300">
          ประวัติการพิมพ์
        </h1>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 dark:bg-stone-900 p-1 rounded-xl mb-8 border border-gray-300 dark:border-stone-800 transition-colors duration-300">
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
            activeTab === "progress"
              ? "bg-white dark:bg-orange-600 text-orange-600 dark:text-white shadow-md dark:shadow-lg font-bold"
              : "text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-200"
          }`}
        >
          <Trophy size={18} /> ความคืบหน้าด่าน
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
            activeTab === "sandbox"
              ? "bg-white dark:bg-orange-600 text-orange-600 dark:text-white shadow-md dark:shadow-lg font-bold"
              : "text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-200"
          }`}
        >
          <Activity size={18} /> ประวัติอิสระ (Sandbox)
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800 rounded-2xl p-8 shadow-xl dark:shadow-2xl min-h-[400px] transition-colors duration-300">
        {/* --- Tab 1: Progress --- */}
        {activeTab === "progress" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-green-600 dark:text-orange-400 mb-4 border-b border-gray-200 dark:border-stone-600 pb-2">
                ระดับพื้นฐาน (Basic)
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ภาษาไทย (TH)</span>
                  <span className="font-mono text-green-600 dark:text-green-400 font-bold">
                    {getCurrentLevel("basic", "TH")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ภาษาอังกฤษ (EN)</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {getCurrentLevel("basic", "EN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-amber-600 dark:text-yellow-400 mb-4 border-b border-gray-200 dark:border-stone-600 pb-2">
                ระดับใช้ได้ (Pro)
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ภาษาไทย (TH)</span>
                  <span className="font-mono text-green-600 dark:text-green-400 font-bold">
                    {getCurrentLevel("pro", "TH")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ภาษาอังกฤษ (EN)</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {getCurrentLevel("pro", "EN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Sandbox History --- */}
        {activeTab === "sandbox" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-stone-300 mb-6 flex items-center gap-2">
              <History size={24} className="text-orange-500" /> 5 รอบล่าสุด
            </h3>

            {data.sandboxHistory.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-stone-500 py-10">
                ยังไม่มีประวัติการเล่นในโหมด Sandbox
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-stone-700">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-stone-400">
                    <tr>
                      <th className="p-4">วันที่ / เวลา</th>
                      <th className="p-4">ภาษา</th>
                      <th className="p-4">ความเร็ว (WPM)</th>
                      <th className="p-4">ความแม่นยำ (Acc)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-stone-700">
                    {data.sandboxHistory.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors"
                      >
                        <td className="p-4 flex items-center gap-2 text-gray-700 dark:text-stone-300">
                          <Calendar size={14} className="text-gray-400 dark:text-stone-500" />
                          {new Date(item.date).toLocaleString("th-TH")}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              item.language === "TH"
                                ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {item.language || "TH"}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-orange-600 dark:text-orange-400 font-bold">
                          {item.wpm}
                        </td>
                        <td className="p-4 font-mono text-blue-600 dark:text-blue-400">
                          {item.accuracy}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

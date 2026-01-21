import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Helper: ฟังก์ชันแปลง Progress Object เป็นข้อความสวยๆ ---
  const formatProgress = (progress) => {
    if (!progress) return <span className="text-gray-600">- No Data -</span>;

    const getLvl = (key) => (progress[key]?.highestPassedLevel || 0) + 1;
    const getPassed = (key) => progress[key]?.highestPassedLevel || 0;

    return (
      <div className="flex flex-col gap-2 text-xs">
        {/* Basic Mode (TH/EN) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-500"></span>
            <span className="text-lime-400 font-bold w-16">Basic TH:</span>
            <span className="text-white font-mono">Lv.{getLvl("basic_TH")}</span>
            <span className="text-gray-500 text-[10px]">(Pass: {getPassed("basic_TH")})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-500 opacity-50"></span>
            <span className="text-lime-400/70 font-bold w-16">Basic EN:</span>
            <span className="text-white/70 font-mono">Lv.{getLvl("basic_EN")}</span>
            <span className="text-gray-500 text-[10px]">(Pass: {getPassed("basic_EN")})</span>
          </div>
        </div>
        {/* Pro Mode (TH/EN) */}
        <div className="flex flex-col gap-1 mt-1 border-t border-gray-700 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-amber-400 font-bold w-16">Pro TH:</span>
            <span className="text-white font-mono">Lv.{getLvl("pro_TH")}</span>
            <span className="text-gray-500 text-[10px]">(Pass: {getPassed("pro_TH")})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 opacity-50"></span>
            <span className="text-amber-400/70 font-bold w-16">Pro EN:</span>
            <span className="text-white/70 font-mono">Lv.{getLvl("pro_EN")}</span>
            <span className="text-gray-500 text-[10px]">(Pass: {getPassed("pro_EN")})</span>
          </div>
        </div>
      </div>
    );
  };

  const fetchUsers = useCallback(async (signal) => {
    try {
      const res = await axios.get("http://localhost:3001/users", { signal });
      setUsers(res.data);
    } catch (err) {
      if (axios.isCancel && axios.isCancel(err)) return;
      console.error("Error fetching users:", err);
    }
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
      navigate("/");
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        await fetchUsers(controller.signal);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchUsers, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจไหมว่าจะลบ User นี้?")) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  const handleEditPassword = async (id) => {
    const newPass = prompt("กรุณาใส่รหัสผ่านใหม่:");
    if (newPass) {
      try {
        await axios.put(`http://localhost:3001/users/${id}`, {
          password: newPass,
        });
        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        await fetchUsers();
      } catch (err) {
        console.error("Error updating password:", err);
        alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัส");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 text-orange-500">
          จัดการผู้ใช้งาน (Admin Panel)
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            Loading users data...
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-[#252525] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Game Progress</th>
                  <th className="px-6 py-4">Password (DB)</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#202020] transition-colors">
                    
                    {/* ✅ คอลัมน์ 1: Username */}
                    <td className="px-6 py-4 font-medium text-lg text-white">
                      {user.username}
                    </td>

                    {/* ✅ คอลัมน์ 2: Full Name (เพิ่มใหม่) */}
                    <td className="px-6 py-4 text-gray-300">
                      {user.firstName ? `${user.firstName} ${user.lastName}` : "-"}
                    </td>

                    {/* ✅ คอลัมน์ 3: Role */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === "admin"
                          ? "bg-purple-900/50 text-purple-200 border border-purple-700"
                          : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* ✅ คอลัมน์ 4: Progress */}
                    <td className="px-6 py-4">
                      {formatProgress(user.progress)}
                    </td>

                    {/* ✅ คอลัมน์ 5: Password */}
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs truncate max-w-[100px]" title={user.password}>
                      {user.password}
                    </td>

                    {/* ✅ คอลัมน์ 6: Actions */}
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEditPassword(user._id)}
                        className="px-3 py-1 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded border border-blue-900 transition-colors text-xs"
                      >
                        เปลี่ยนรหัส
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded border border-red-900 transition-colors text-xs"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // เพิ่มสถานะ Loading
  const navigate = useNavigate();

  // ฟังก์ชันนี้ใช้เรียกเมื่อ user ลบ/แก้ไข เราอยาก reuse ได้
  const fetchUsers = useCallback(async (signal) => {
  try {
    // ส่ง signal ไปด้วย เพื่อบอกว่า "ถ้าฉันสั่งยกเลิก ให้หยุดโหลดทันที"
    const res = await axios.get("http://localhost:3001/users", { signal });
    setUsers(res.data);
  } catch (err) {
    // ถ้า Error เพราะเราสั่งยกเลิกเอง (เปลี่ยนหน้า) ไม่ต้องแจ้งเตือน Error
    if (axios.isCancel && axios.isCancel(err)) return;
    console.error("Error fetching users:", err);
  }
}, []);

  useEffect(() => {
    // 1. เช็คสิทธิ์ Admin (เหมือนเดิม)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
      navigate("/");
      return;
    }

    // 2. สร้างตัวตัดสัญญาณ (Controller)
    const controller = new AbortController();
    let mounted = true;

    // 3. ฟังก์ชันเรียกข้อมูล (เขียนแบบ IIFE เพราะ useEffect ห้ามเป็น async โดยตรง)
    (async () => {
      setLoading(true);
      try {
        await fetchUsers(controller.signal);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // 4. Cleanup Function (ทำงานเมื่อเปลี่ยนหน้า)
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchUsers, navigate]);

  // ... ลบ หรือ แก้ไข ...
  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจไหมว่าจะลบ User นี้?")) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        // รีโหลดข้อมูล (เรียก fetchUsers อีกครั้ง)
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
          <div>Loading...</div> // ถ้า loading=true ให้โชว์คำนี้
        ) : (
          <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-[#252525] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Password (Database)</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#202020] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.username}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === "admin"
                            ? "bg-purple-900 text-purple-200"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                      {user.password}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEditPassword(user._id)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        แก้ไขรหัส
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300 text-sm"
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

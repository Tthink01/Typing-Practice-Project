import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ดึง API URL จากไฟล์ .env
  const API_URL = import.meta.env.VITE_API_URL;

  // ฟังก์ชันดึงข้อมูล
  const fetchUsers = useCallback(
    async (signal = null) => {
      try {
        const config = signal ? { signal } : {};

        const res = await axios.get(`${API_URL}/users`, config);

        // ✨✨ แก้ไขจุดที่ 1: เช็คว่าเป็น Array จริงไหม ก่อนบันทึก ✨✨
        // กันไว้เผื่อ Server ส่ง Error Message หรือ Object กลับมาแทน Array
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn("Data received is not an array:", res.data);
          setUsers([]); // ถ้าไม่ใช่ Array ให้เซ็ตเป็นค่าว่าง โปรแกรมจะได้ไม่พัง
        }
      } catch (err) {
        if (axios.isCancel && axios.isCancel(err)) return;
        console.error("Error fetching users:", err);
        setUsers([]); // ถ้า Error ก็เซ็ตค่าว่างไว้ก่อน
      }
    },
    [API_URL]
  );

  useEffect(() => {
    // 1. เช็คสิทธิ์ Admin
    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser || currentUser.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
      navigate("/");
      return;
    }

    // 2. สร้าง Controller ตัดสัญญาณ
    const controller = new AbortController();
    let mounted = true;

    // 3. เรียกข้อมูล
    (async () => {
      setLoading(true);
      try {
        await fetchUsers(controller.signal);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // 4. Cleanup
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchUsers, navigate]);

  // --- ฟังก์ชันลบ ---
  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจไหมว่าจะลบ User นี้?")) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        // รีโหลดข้อมูล
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  // --- ฟังก์ชันแก้ไขรหัสผ่าน ---
  const handleEditPassword = async (id) => {
    const newPass = prompt("กรุณาใส่รหัสผ่านใหม่:");
    if (newPass) {
      try {
        await axios.put(`${API_URL}/users/${id}`, {
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
          <div className="text-center text-gray-400 mt-10">
            กำลังโหลดข้อมูล...
          </div>
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
                {/* ✨✨ แก้ไขจุดที่ 2: เช็ค Array.isArray อีกรอบเพื่อความชัวร์ ✨✨ */}
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      ไม่พบข้อมูลผู้ใช้งาน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

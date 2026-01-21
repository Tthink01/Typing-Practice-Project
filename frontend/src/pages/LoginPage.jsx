import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const InputField = ({ label, name, type = "text", placeholder, onChange, value }) => (
  <div className="mb-3">
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value} // ✅ เพิ่ม value เพื่อให้เคลียร์ค่าได้
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors placeholder-gray-600"
      required
    />
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // ✅ เพิ่ม state สำหรับชื่อ-นามสกุล และยืนยันรหัสผ่าน
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "", // สำหรับเช็คหน้าบ้าน
    firstName: "", 
    lastName: "" 
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ เพิ่ม Logic ตรวจสอบรหัสผ่านซ้ำ (เฉพาะตอนสมัครสมาชิก)
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
        return;
      }
    }

    const endpoint = isLogin ? "/login" : "/register";
    const apiUrl = `http://localhost:3001${endpoint}`;

    try {
      const { data } = await axios.post(apiUrl, formData);

      if (data.status === "Success" || (!isLogin && data)) {
        if (isLogin) {
          // --- Login Success ---
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          window.dispatchEvent(new Event("auth-change"));

          // ✅ ดึงชื่อจริงมาแสดงตอนทักทาย (ถ้ามี)
          const displayName = data.user.firstName ? `${data.user.firstName} ${data.user.lastName}` : data.user.username;
          alert(`ยินดีต้อนรับ! ${displayName}`);

          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          // --- Register Success ---
          alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
          setIsLogin(true);
          // เคลียร์ค่า form
          setFormData({ username: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
        }
      } else {
        alert(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-900/20 rounded-full blur-[100px]" />

      <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl z-10 my-10"> {/* my-10 เผื่อจอเล็ก */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">
            {isLogin ? "ยินดีต้อนรับกลับ" : "สร้างบัญชีใหม่"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? "เข้าสู่ระบบเพื่อฝึกพิมพ์ต่อ" : "กรอกข้อมูลเพื่อเริ่มต้นใช้งาน"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          {/* ✅ ส่วนที่เพิ่ม: ชื่อ-นามสกุล (แสดงเฉพาะตอนสมัคร) */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="FirstName"
                name="firstName"
                placeholder=""
                onChange={handleChange}
              />
              <InputField
                label="LastName"
                name="lastName"
                placeholder=""
                onChange={handleChange}
              />
            </div>
          )}

          <InputField
            label="Username"
            name="username"
            placeholder={isLogin ? "ใส่ชื่อผู้ใช้" : "ตั้งชื่อผู้ใช้"}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
          />

          {/* ✅ ส่วนที่เพิ่ม: ยืนยันรหัสผ่าน (แสดงเฉพาะตอนสมัคร) */}
          {!isLogin && (
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          )}

          <button className="mt-4 w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-900/20">
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-400 hover:text-orange-300 underline font-medium"
          >
            {isLogin ? "สมัครสมาชิกเลย" : "เข้าสู่ระบบ"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
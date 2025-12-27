// server/controllers/userController.js
const UserModel = require("../models/User");

// --- สมัครสมาชิก ---
const registerUser = (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};

// --- เข้าสู่ระบบ ---
const loginUser = (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }).then((user) => {
    if (user) {
      if (user.password === password) {
        // แนะนำ: ตรงนี้ควรส่ง user object กลับไปด้วย เพื่อให้ Frontend เอาไปใช้ (เช่น progress)
        res.json({ status: "Success", message: "Login สำเร็จ!", user: user });
      } else {
        res.json({ status: "Error", message: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      res.json({ status: "Error", message: "ไม่พบผู้ใช้งานนี้" });
    }
  });
};

// --- Admin: ดึงรายชื่อ User ทั้งหมด ---
const getAllUsers = (req, res) => {
  UserModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};

// --- Admin: ลบ User ---
const deleteUser = (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// --- Admin: แก้ไข Password ---
const updateUserPassword = (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(
    { _id: id },
    {
      password: req.body.password,
    }
  )
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};

// --- เพิ่ม: ดึงข้อมูล User ตาม ID ---
const getUserById = (req, res) => {
  const id = req.params.id;
  UserModel.findById(id)
    .then((user) => {
      if (user) {
        res.json({ status: "Success", user: user });
      } else {
        res.status(404).json({ status: "Error", message: "User not found" });
      }
    })
    .catch((err) => res.status(500).json(err));
};

// --- Game: อัปเดตความคืบหน้า (Save Progress) ---
const updateProgress = async (req, res) => {
  // รับค่า userId, mode, levelId จาก Frontend
  const { userId, mode, levelId } = req.body;

  try {
    // 1. ใช้ UserModel (ชื่อต้องตรงกับที่ require ข้างบน)
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ status: "Error", message: "User not found" });
    }

    // 2. เช็คว่ามีฟิลด์ progress ไหม (กัน Error กรณี User เก่าไม่มี field นี้)
    if (!user.progress) {
      user.progress = {
        basic: { highestPassedLevel: 0 },
        pro: { highestPassedLevel: 0 },
      };
    }

    // 3. เช็คว่า mode ถูกต้องไหม (basic หรือ pro)
    if (!user.progress[mode]) {
      return res.status(400).json({ message: "Invalid game mode" });
    }

    // 4. อัปเดตเลเวลสูงสุด (เฉพาะเมื่อเล่นได้ไกลกว่าเดิม)
    // แปลงเป็น Int ก่อนเปรียบเทียบเพื่อความชัวร์
    const currentHighest = user.progress[mode].highestPassedLevel || 0;
    const newLevel = parseInt(levelId);

    if (newLevel > currentHighest) {
      user.progress[mode].highestPassedLevel = newLevel;

      // บอก Mongoose ว่าเราแก้ไข Object ซ้อนข้างในแล้ว (จำเป็นสำหรับ Mixed type หรือ Object ซ้อน)
      user.markModified("progress");

      await user.save();

      res.json({
        status: "Success",
        message: "Progress saved",
        progress: user.progress,
      });
    } else {
      // ถ้าเล่นด่านเดิมซ้ำ ไม่ต้อง save แต่ส่ง success กลับไป
      res.json({
        status: "Success",
        message: "No progress update needed",
        progress: user.progress,
      });
    }
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ส่งออกฟังก์ชันทั้งหมด (ต้องมี updateProgress ด้วย)
module.exports = {
  getAllUsers,
  deleteUser,
  updateUserPassword,
  registerUser,
  loginUser,
  updateProgress, 
  getUserById,
};

// server/controllers/userController.js
const UserModel = require("../models/User");

// --- สมัครสมาชิก (แก้ไข) ---
const registerUser = (req, res) => {
  // ✅ รับค่า firstName, lastName เพิ่มเข้ามาจาก req.body
  const { username, password, firstName, lastName } = req.body;

  UserModel.create({ 
      username, 
      password, 
      firstName,  // ✅ บันทึกชื่อจริงลงฐานข้อมูล
      lastName    // ✅ บันทึกนามสกุลลงฐานข้อมูล
    })
    .then((user) => {
        // ส่งกลับเป็นรูปแบบมาตรฐาน { status: "Success", user: ... }
        res.json({ status: "Success", message: "สมัครสมาชิกสำเร็จ", user: user });
    })
    .catch((err) => {
        // กรณีชื่อซ้ำหรือ error อื่นๆ
        res.json({ status: "Error", message: err.message });
    });
};

// --- เข้าสู่ระบบ ---
const loginUser = (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }).then((user) => {
    if (user) {
      if (user.password === password) {
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
  const { userId, mode, level, score, wpm, accuracy, language } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ status: "Error", message: "User not found" });
    }

    // ✅ แก้ไข 1: บังคับให้เป็นตัวพิมพ์เล็กเสมอ (basic, pro)
    const cleanMode = mode ? mode.toLowerCase() : "basic";
    const langSuffix = language || "TH";
    
    // จะได้ basic_TH หรือ pro_TH ตรงกับ Schema แน่นอน
    const progressKey = `${cleanMode}_${langSuffix}`; 

    // เช็คว่ามี Object นี้ไหม (ถ้าไม่มีสร้างใหม่)
    if (!user.progress[progressKey]) {
      user.progress[progressKey] = { highestPassedLevel: 0, scores: {} };
    }

    const currentProgress = user.progress[progressKey];
    const newLevel = parseInt(level);
    const currentHighest = currentProgress.highestPassedLevel || 0;

    console.log(`[API] Updating ${progressKey} | Current: ${currentHighest} -> New: ${newLevel}`);

    // ✅ แก้ไข 2: Logic การบันทึก
    if (newLevel > currentHighest) {
      user.progress[progressKey].highestPassedLevel = newLevel;

      // บันทึก Score (ถ้ามี)
      if (!user.progress[progressKey].scores) user.progress[progressKey].scores = {};
      user.progress[progressKey].scores[newLevel] = { score, wpm, accuracy };

      // 🔥 สำคัญ: แจ้ง Mongoose ว่ามีการแก้ไข Object นี้
      user.markModified("progress");

      await user.save();

      res.json({
        status: "Success",
        message: `Level Up to ${newLevel}`,
        progress: user.progress,
      });
    } else {
      // ถ้าเลเวลไม่เพิ่ม ก็ส่ง success กลับไป (frontend จะได้ไม่ error)
      res.json({
        status: "Success",
        message: "Already passed this level",
        progress: user.progress,
      });
    }
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- Reset Progress (อัปเดตให้รองรับแยกภาษา) ---
const resetProgress = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ ล้างค่าและสร้างโครงสร้างใหม่ (แยก TH / EN)
    user.progress = {
      basic_TH: { highestPassedLevel: 0, scores: {} },
      basic_EN: { highestPassedLevel: 0, scores: {} },
      pro_TH: { highestPassedLevel: 0, scores: {} },
      pro_EN: { highestPassedLevel: 0, scores: {} },
    };

    user.markModified("progress");
    await user.save();

    res.json({
      status: "Success",
      message: "Progress Reset Successful",
      progress: user.progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Force Unlock (อัปเดตให้รองรับแยกภาษา) ---
const forceUnlockLevel = async (req, res) => {
  // ✅ รับค่า language เพิ่ม (default = TH หาก AdminTool ยังไม่ได้ส่งมา)
  const { userId, mode, targetLevel, language = "TH" } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ สร้าง Key
    const progressKey = `${mode}_${language}`;

    // ถ้า Key นี้ยังไม่มีใน DB ให้สร้างใหม่เลย (กรณี Admin อยากเปิดด่านให้ User ใหม่ทันที)
    if (!user.progress[progressKey]) {
      user.progress[progressKey] = { highestPassedLevel: 0, scores: {} };
    }

    // คำนวณด่านที่ผ่าน (ด่านเป้าหมาย - 1)
    let setPassedLevel = parseInt(targetLevel) - 1;
    if (setPassedLevel < 0) setPassedLevel = 0;

    // อัปเดต
    user.progress[progressKey].highestPassedLevel = setPassedLevel;

    user.markModified("progress");
    await user.save();

    res.json({
      status: "Success",
      message: `Unlocked ${progressKey} Level ${targetLevel}`,
      progress: user.progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- เพิ่ม: ดึง Progress ของ User (สำหรับ Navbar/Certificate) ---
const getUserProgress = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. ค้นหา User
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    // 2. แปลงข้อมูลจาก Database ให้เป็น Array เพื่อให้ Frontend นับจำนวนได้ง่ายๆ
    const completedLevels = [];

    if (user.progress) {
      Object.entries(user.progress).forEach(([key, value]) => {
        const count = value.highestPassedLevel || 0;
        for (let i = 1; i <= count; i++) {
          completedLevels.push(`${key}-${i}`);
        }
      });
    }

    // 3. ส่งกลับไป
    res.json({
      status: "Success",
      username: user.username,
      completedLevels: completedLevels, 
    });

  } catch (err) {
    console.error("Get Progress Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserPassword,
  registerUser,
  loginUser,
  updateProgress,
  getUserById,
  resetProgress,
  forceUnlockLevel,
  getUserProgress
};
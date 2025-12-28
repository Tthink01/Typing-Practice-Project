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
  // ✅ 1. รับค่า level แทน levelId (แก้ชื่อตัวแปรให้ตรงกับ destructuring)
  const { userId, mode, level, score, wpm, accuracy, language } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ status: "Error", message: "User not found" });
    }

    // ✅ 2. สร้าง Key แยกตามภาษา (เช่น basic_TH, basic_EN)
    // ถ้าไม่มีการส่ง language มา ให้ default เป็น "TH" กันเหนียว
    const langSuffix = language || "TH";
    const progressKey = `${mode}_${langSuffix}`;

    // ✅ 3. เช็คและสร้าง Object รอไว้ถ้ายังไม่มี (กัน Error)
    if (!user.progress[progressKey]) {
      user.progress[progressKey] = { highestPassedLevel: 0, scores: {} };
    }

    // ✅ 4. ใช้ progressKey ในการเข้าถึงข้อมูล (แทน mode เฉยๆ แบบเก่า)
    const currentProgress = user.progress[progressKey];

    // แปลง level เป็นตัวเลข
    const newLevel = parseInt(level);
    const currentHighest = currentProgress.highestPassedLevel || 0;

    // เช็คว่าเล่นได้ไกลกว่าเดิมไหม
    if (newLevel > currentHighest) {
      // อัปเดตค่าลงไปใน progressKey นั้นๆ
      user.progress[progressKey].highestPassedLevel = newLevel;

      // ✅ 5. บันทึก Score (Optional: ถ้าอยากเก็บคะแนนด้วย)
      // user.progress[progressKey].scores[newLevel] = { score, wpm, accuracy };

      // บอก Mongoose ว่า Object นี้มีการเปลี่ยนแปลง
      user.markModified("progress");

      await user.save();

      res.json({
        status: "Success",
        message: "Progress saved",
        progress: user.progress,
      });
    } else {
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
};

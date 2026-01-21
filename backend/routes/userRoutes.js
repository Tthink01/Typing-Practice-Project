// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); // เรียกใช้ Controller ที่ทำตะกี้

// กำหนดเส้นทาง
router.get('/users', userController.getAllUsers);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.updateUserPassword);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post("/users/progress", userController.updateProgress);
router.get('/users/:username/progress', userController.getUserProgress);
router.get('/users/:id', userController.getUserById);
router.post('/users/reset-progress', userController.resetProgress);
router.post('/users/force-unlock', userController.forceUnlockLevel); 
module.exports = router;
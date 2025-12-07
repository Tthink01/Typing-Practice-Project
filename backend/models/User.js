// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    password: { type: String, required: true }, // ในงานจริงต้องเข้ารหัส (Hash) นะครับ
    username: { type: String, required: true }
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
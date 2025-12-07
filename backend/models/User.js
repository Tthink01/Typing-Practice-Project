// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    password: { type: String, required: true }, // ในงานจริงต้องเข้ารหัส (Hash) นะครับ
    username: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
const mongoose = require("mongoose")
console.log("🔥 USER MODEL FILE LOADED")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already registered"],
  },
  password: {
    type: String,
    required: true
  }
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel
const mongoose = require("mongoose")

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1) // 💥 stop app if DB fails
  }
}

module.exports = connectToDB
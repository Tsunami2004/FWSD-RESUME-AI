// Only load .env file in local development — on Vercel env vars are injected directly
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./.env" })
}

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

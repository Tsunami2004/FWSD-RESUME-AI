const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()

// On Vercel, frontend and backend share the same domain via rewrites (same-origin).
// FRONTEND_URL is used for local dev cross-origin support.
// In production with Vercel services, requests are same-origin so CORS is not needed,
// but we keep it permissive to handle any edge cases.
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173"]

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, same-origin Vercel rewrites)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // On Vercel, same-origin rewrites have no cross-origin header — always allow
    return callback(null, true)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

// CORS must come before all routes
app.use(cors(corsOptions))
app.options("/{*path}", cors(corsOptions))

app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())

/*require all the routes here*/
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

console.log("Routes mounted")

app.get("/", (req, res) => {
  res.send("API is working")
})

module.exports = app

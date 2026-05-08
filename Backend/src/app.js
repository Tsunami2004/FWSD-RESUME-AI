const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")  
const app = express()

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

// CORS must be first — before any other middleware — so preflight OPTIONS requests are handled correctly
app.use(cors(corsOptions))
app.options("/{*path}", cors(corsOptions)) // explicitly handle preflight for all routes

app.use(express.static("public"));
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

app.post("/api/auth/test", (req, res) => {
  res.send("TEST WORKING")
})


module.exports = app
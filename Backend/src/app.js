const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")  
const app = express()

app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

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
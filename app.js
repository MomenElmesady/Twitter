const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")


// routes 
const userRouter = require("./routes/userRouter")
const tweetRouter = require("./routes/tweetRouter")
const followRouter = require("./routes/followRouter")
const notifictionRouter = require("./routes/notificationRouter")

const DB = process.env.DB
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successful!'));


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/tweeter/users", userRouter)
app.use("/tweeter/tweets", tweetRouter)
app.use("/tweeter/follows", followRouter)

app.use("/tweeter/notifications", notifictionRouter)

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || "error",
        message: err.message
    })
})
const port = process.env.PORT || 3939
app.listen(port, () => {
    console.log("app.lestining on port 3939")
})
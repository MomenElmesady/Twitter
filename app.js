const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")
const passport = require('passport');
const errorController = require("./controllers/errorController")

const cookieSession = require('cookie-session');
require('./utils/passport-setup');

// routes 
const userRouter = require("./routes/userRouter")
const tweetRouter = require("./routes/tweetRouter")
const blockRouter = require("./routes/blockRouter")
const followRouter = require("./routes/followRouter")
const notifictionRouter = require("./routes/notificationRouter")
const likeRouter = require("./routes/likeRouter")
const commentRouter = require("./routes/commentRouter")
const retweetRouter = require("./routes/retweetRouter")
const authRouter = require("./routes/authRoutser")

const DB = process.env.DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successful!'));


const app = express()
// auth with google+
app.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/');
});

app.use(express.json())
app.use(cookieParser())

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRouter)
app.use("/api/v1/block", blockRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/retweet", retweetRouter)
app.use("/api/v1/notification", notifictionRouter)
app.use("/api/v1/auth", authRouter)

app.use(errorController)

const port = process.env.PORT || 3939
app.listen(port, () => {
    console.log(`app.lestining on port ${port}`)
})
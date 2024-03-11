const multer = require("multer");
const express = require("express")
const authController = require("../controllers/authController")
const tweetController = require("../controllers/tweetController")
const router = express.Router({ mergeParams: true })


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", authController.protect, upload.single("mediaUrl")/*if there is no file it pass this middleware*/, tweetController.createTweet)
router.route("/:tweetId").get(tweetController.getTweet).patch(authController.protect,tweetController.updateTweet).delete(authController.protect,tweetController.deleteTweet)

// get tweets
router.get("/getTweets/:userId", tweetController.getTweetsForUser)


module.exports = router 
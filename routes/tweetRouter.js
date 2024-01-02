const multer = require("multer");
const express = require("express")
const authController = require("../controllers/authController")
const tweetController = require("../controllers/tweetController")
const likeController = require("../controllers/likeController")
const commentController = require("../controllers/commentController")
const retweetController = require("../controllers/retweetController")
const router = express.Router({ mergeParams: true })


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createTweet", authController.protect, upload.single("mediaUrl")/*if there is no file it pass this middleware*/, tweetController.createTweet)
router.route("/:tweetId").get(tweetController.getTweet).patch(tweetController.updateTweet).delete(tweetController.deleteTweet)

// get tweets
router.get("/getTweets/:userId", tweetController.getTweetsForUser)
router.get("/getReTweets/:userId", retweetController.getReTweetsForUser)

// like 
router.post("/like/:tweetId", authController.protect, likeController.like)
router.get("/getAllLikes/:tweetId", tweetController.getLikes)

// comment -> i design it like tweet but add filed refer to tweet 
router.post("/createComment/:tweetId", authController.protect, upload.single("mediaUrl"), commentController.createComment)
router.get("/getAllComments/:tweetId", authController.protect, commentController.getAllCommentsForTweet)

// retweet 
router.post("/retweet/:tweetId", authController.protect, retweetController.retweet)
router.delete("/deleteRetweet/:retweetId", authController.protect, retweetController.deleteRetweet)



module.exports = router 
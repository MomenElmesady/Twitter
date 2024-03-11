const express = require("express")
const authController = require("../controllers/authController")
const retweetController = require("../controllers/retweetController")
const router = express.Router()

// retweet 
router.post("/:tweetId", authController.protect, retweetController.retweet)
router.delete("/:retweetId", authController.protect, retweetController.deleteRetweet)
router.get("/:userId", retweetController.getReTweetsForUser)

module.exports = router 
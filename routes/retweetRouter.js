const express = require("express")
const authController = require("../controllers/authController")
const retweetController = require("../controllers/retweetController")
const router = express.Router()

router.get("/:userId", retweetController.getReTweetsForUser)

// Protect all
router.use(authController.protect)
router.post("/:tweetId", retweetController.retweet)
router.delete("/:retweetId", retweetController.deleteRetweet)

module.exports = router 
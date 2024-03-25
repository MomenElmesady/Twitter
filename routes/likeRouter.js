const express = require("express")
const authController = require("../controllers/authController")
const likeController = require("../controllers/likeController")
const router = express.Router()


router.get("/getAllLikes/:tweetId", likeController.getLikes)
// like 
router.post("/:tweetId", authController.protect, likeController.like)

module.exports = router
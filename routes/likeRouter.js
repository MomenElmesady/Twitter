const express = require("express")
const authController = require("../controllers/authController")
const likeController = require("../controllers/likeController")
const router = express.Router()


// like 
router.post("/:tweetId", authController.protect, likeController.like)
router.get("/getAllLikes/:tweetId", likeController.getLikes)

module.exports = router
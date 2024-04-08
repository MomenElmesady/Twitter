const express = require("express")
const authController = require("../controllers/authController")
const followController = require("../controllers/followController")
const blockController = require("../controllers/blockController")

const router = express.Router()

// follow operation 
// 0-> get followers and following 
router.get("/getFollowers/:userId", followController.getAllFollowers)
router.get("/getFollowings/:userId", followController.getAllFollowing)

// 00-> search
router.get("/searchInFollowers/:userId",followController.searchInFollowers)
router.get("/searchInFollowings/:userId",followController.searchInFollowings)

// Protect all
router.use(authController.protect)
// 1-> follow
router.post("/:followedId", blockController.isBlock, followController.follow)
// 2-> unfollow
router.delete("/:followedId", followController.unFollow)

module.exports = router
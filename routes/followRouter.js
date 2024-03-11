const express = require("express")
const authController = require("../controllers/authController")
const followController = require("../controllers/followController")


const router = express.Router()


// follow operation 
// 1-> follow
router.post("/:followedId", authController.protect, followController.follow)
// 2-> unfollow
router.delete("/:followedId", authController.protect, followController.unFollow)
// 3-> get followers and following 
router.get("/getFollowers/:userId", followController.getAllFollowers)
router.get("/getFollowings/:userId", followController.getAllFollowing)

// search
router.get("/searchInFollowers/:userId",followController.searchInFollowers)
router.get("/searchInFollowings/:userId",followController.searchInFollowings)

module.exports = router
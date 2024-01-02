const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")
const followController = require("../controllers/followController")


const router = express.Router()


// follow operation 
// 1-> follow
router.post("/follow/:followedId", authController.protect, followController.follow)
// 2-> unfollow
router.post("/unFollow/:followedId", authController.protect, followController.unFollow)
// 3-> get followers and following 
router.get("/getFollowers/:userId", userController.getAllFollowers)
router.get("/getFollowing/:userId", userController.getAllFollowing)


router.get("/searchInFollowers/:userId",followController.searchInFollowers)
router.get("/searchInFollowings/:userId",followController.searchInFollowings)

module.exports = router
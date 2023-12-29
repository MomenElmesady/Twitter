const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")
const followController = require("../controllers/followController")
const retweetController = require("../controllers/retweetController")
const tweetRouter = require("../routes/tweetRouter")


const router = express.Router()

// tweet 
// nested Route
router.use("/tweet",tweetRouter)


router.route("/register").post(authController.register)
router.route("/verify/:token").post(authController.verify)
router.post("/sendVerfication", authController.sendVerivicationEmail)

router.patch("/updateProfile",authController.protect,userController.uploadProfilePic,userController.updatePhoto("profilePic"))
router.patch("/updateCover",authController.protect,userController.uploadCover,userController.updatePhoto("cover"))

router.route("/login").post(authController.login)
router.route("/lohout").post(authController.logout)
router.route("/refreshToken").patch(authController.refreshToken)

router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)
router.patch("/updatePassword", authController.protect, authController.updatePassword)

router.get("/getMe",authController.protect,userController.getMe)
router.patch("/updateMe",authController.protect,userController.updateMe)


router.route("/:userId").get(userController.getUser)
.delete(userController.deleteUser)

router.get("/getTweets/:userId",userController.getTweetsForUser)
router.get("/getReTweets/:userId",retweetController.getReTweetsForUser)

// follow operation 
// 1-> follow
router.post("/follow/:followedId",authController.protect,followController.follow)
// 2-> unfollow
router.post("/unFollow/:followedId",authController.protect,followController.unFollow)
// 3-> get followers and following 
router.get("/getFollowers/:userId",userController.getAllFollowers)
router.get("/getFollowing/:userId",userController.getAllFollowing)




module.exports = router
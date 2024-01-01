const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")
const followController = require("../controllers/followController")


const router = express.Router()

router.route("/register").post(authController.register)
router.route("/verify/:token").post(authController.verify)
router.post("/sendVerfication", authController.sendVerivicationEmail)

router.patch("/updateProfile", authController.protect, userController.uploadProfilePic, userController.updatePhoto("profilePic"))
router.patch("/updateCover", authController.protect, userController.uploadCover, userController.updatePhoto("cover"))

router.route("/login").post(authController.login)
router.route("/lohout").post(authController.logout)
router.route("/refreshToken").patch(authController.refreshToken)

router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)
router.patch("/updatePassword", authController.protect, authController.updatePassword)

router.get("/getMe", authController.protect, userController.getMe)
router.patch("/updateMe", authController.protect, userController.updateMe)

router.get("/notifications",authController.protect,userController.getUserNotifications)

router.route("/:userId").get(userController.getUser)
  .delete(userController.deleteUser)





module.exports = router
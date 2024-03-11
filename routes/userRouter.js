const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()


router.get("/timeLine",authController.protect,userController.timeLine)

router.route("/register").post(authController.register)
router.route("/verify/:token").get(authController.verify)
router.post("/sendVerfication", authController.sendVerivicationEmail)

router.patch("/updateProfile", authController.protect, userController.uploadProfilePic, userController.updatePhoto("profilePic"))
router.patch("/updateCover", authController.protect, userController.uploadCover, userController.updatePhoto("cover"))

router.route("/login").post(authController.login)
router.route("/logout").post(authController.logout)
router.route("/refreshToken").patch(authController.refreshToken)

router.post("/forgotPassword", authController.forgotPassword)
router.get("/verifyPasswordToken/:resetToken",authController.verifyPasswordReset)
router.patch("/resetPassword", authController.resetPassword)
router.patch("/updatePassword", authController.protect, authController.updatePassword)

router.get("/", userController.getAllUsers)
router.get("/getMe", authController.protect, userController.getMe)
router.patch("/updateMe", authController.protect, userController.updateMe)

router.get("/notifications",authController.protect,userController.getUserNotifications)

router.route("/:userId").get(userController.getUser)
  .delete(userController.deleteUser)


module.exports = router
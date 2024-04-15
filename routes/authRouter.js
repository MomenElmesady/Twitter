const express = require("express")
const authController = require("../controllers/authController")

const router = express.Router()

router.route("/register").post(authController.register)
router.route("/verify/:token").get(authController.verify)
router.post("/sendVerfication", authController.sendVerivicationEmail)
router.route("/login").post(authController.login)
router.route("/logout").post(authController.logout)
router.route("/refreshToken").patch(authController.refreshToken)
router.post("/forgotPassword", authController.forgotPassword)
router.get("/verifyPasswordToken/:resetToken",authController.verifyPasswordReset)
router.patch("/resetPassword", authController.resetPassword)
router.patch("/updatePassword", authController.protect, authController.updatePassword)

module.exports = router
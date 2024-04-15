const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()

// router.use(authController.protect)

router.get("/timeLine",authController.protect,userController.timeLine)
router.patch("/updateProfile",authController.protect,  userController.uploadProfilePic, userController.updatePhoto("profilePic"))
router.patch("/updateCover",authController.protect,  userController.uploadCover, userController.updatePhoto("cover"))
router.get("/getMe",authController.protect,  userController.getMe)
router.patch("/updateMe",authController.protect,  userController.updateMe)
router.get("/notifications",authController.protect,userController.getUserNotifications)


router.route("/:userId").get(userController.getUser)
.delete(userController.deleteUser)
router.get("/", userController.getAllUsers)

// Protect all


module.exports = router
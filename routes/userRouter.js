const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()

router.route("/:userId").get(userController.getUser)
.delete(userController.deleteUser)
router.get("/", userController.getAllUsers)

router.use(authController.protect)
router.get("/timeLine",userController.timeLine)
router.patch("/updateProfile",  userController.uploadProfilePic, userController.updatePhoto("profilePic"))
router.patch("/updateCover",  userController.uploadCover, userController.updatePhoto("cover"))
router.get("/getMe",  userController.getMe)
router.patch("/updateMe",  userController.updateMe)
router.get("/notifications",userController.getUserNotifications)


module.exports = router
const notificationController = require("../controllers/notificationController")
const express = require("express")

const router = express.Router()

router.post("/createNotification",notificationController.createNotification)

module.exports = router
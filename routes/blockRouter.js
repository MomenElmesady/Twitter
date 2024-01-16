const express = require("express")
const blockController = require("../controllers/blockController")
const authController = require("../controllers/authController")
const router = express.Router()

router.route("/:blockedId").post(authController.protect,blockController.createBlock).delete(authController.protect,blockController.deleteBlock)
router.get("/isBlock", blockController.isBlock)

module.exports = router
const express = require("express")
const blockController = require("../controllers/blockController")
const authController = require("../controllers/authController")
const router = express.Router()

router.get("/isBlock", blockController.isBlock)

router.use(authController.protect)
router.route("/:blockedId").post(blockController.createBlock)
.delete(blockController.deleteBlock)


module.exports = router
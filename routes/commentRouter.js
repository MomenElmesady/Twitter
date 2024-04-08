const express = require("express")
const authController = require("../controllers/authController")
const commentController = require("../controllers/commentController")
const router = express.Router({ mergeParams: true })
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Protect all
router.use(authController.protect)

router.post("/:tweetId", upload.single("mediaUrl"), commentController.createComment)
router.get("/getAllComments/:tweetId", commentController.getAllCommentsForTweet)

module.exports = router
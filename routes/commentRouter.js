const express = require("express")
const authController = require("../controllers/authController")
const commentController = require("../controllers/commentController")
const router = express.Router({ mergeParams: true })
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authController.protect)

// comment -> i design it like tweet but add filed refer to tweet 
router.post("/:tweetId", upload.single("mediaUrl"), commentController.createComment)
router.get("/getAllComments/:tweetId", commentController.getAllCommentsForTweet)

module.exports = router
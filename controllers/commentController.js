const Comment = require("../models/tweetModel")
const Notification = require("../models/notificationModel")
const catchAsync = require("../utils/catchAsync")
const Tweet = require("../models/tweetModel");

exports.createComment = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId)
  await Notification.create({
    user: tweet.user,
    type: "comment",
    content: `${req.user.name} comment on your tweet ${tweet._id}.`
  })

  const { content } = req.body;
  // Check if a file is uploaded
  if (req.file) {
    const mediaUrl = req.file.originalname; // Replace with actual media URL
    // Create tweet with mediaUrl
    const comment = await Tweet.create({
      tweet:req.params.tweetId,
      user: req.user._id,
      content,
      mediaUrl,
      type: "photo"
    });

    res.status(200).json({
      status: "success",
      data: comment,
    });
  } else {
    // No file uploaded, create tweet without media
    const comment = await Tweet.create({ user: req.user._id, content });
    res.status(200).json({
      status: "success",
      data: comment,
    });
  }
})



exports.getAllCommentsForTweet = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ tweet: req.params.tweetId })
  res.status(200).json({
    status: "success",
    data: comments
  })
})

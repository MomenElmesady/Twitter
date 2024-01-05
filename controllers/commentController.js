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

  const commentData = {
    content,
    user: req.user._id,
    tweet: req.params.tweetId
  }
  // Check if a file is uploaded
  if (req.file) {
    // i should store actual url oh the photo (the path oh the photo)
    const mediaUrl = req.file.originalname; // Replace with actual media URL
    // Create tweet with mediaUrl
    commentData.mediaUrl = mediaUrl
    commentData.type = "photo"
  }

  // No file uploaded, create tweet without media
  const comment = await Tweet.create(commentData);
  res.status(200).json({
    status: "success",
    data: comment,
  });
})



exports.getAllCommentsForTweet = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ tweet: req.params.tweetId })
  res.status(200).json({
    status: "success",
    data: comments
  })
})

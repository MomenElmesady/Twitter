const Comment = require("../models/tweetModel")
const Notification = require("../models/notificationModel")
const catchAsync = require("../utils/catchAsync")
const Tweet = require("../models/tweetModel");

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({ user: req.user._id, tweet: req.params.tweetId, content: req.body.content })
  const tweet = await Tweet.findById(req.params.tweetId)

  await Notification.create({
    user: tweet.user,
    type: "comment",
    content: `${req.user.name} comment on your tweet ${tweet._id}.`
  })
  res.status(200).json({
    status: "success",
    data: comment
  })
})

exports.getAllCommentsForTweet = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ tweet: req.params.tweetId })
  res.status(200).json({
    status: "success",
    data: comments
  })
})

const Like = require("../models/likeModel");
const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");

exports.like = (async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId)
  const checkLike = await Like.findOne({ user: req.user._id, tweet: tweet._id })
  if (checkLike) {
    tweet.likes += 1
    await tweet.save({ validateBeforeSave: false })
    await Like.findByIdAndDelete(checkLike._id)
  }
  else {
    tweet.likes += 1
    await tweet.save({ validateBeforeSave: false })
    await Like.create({ user: req.user._id, tweet: tweet._id })
  }
  res.status(200).json({
    status: "success",
  })
})


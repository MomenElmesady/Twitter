const Like = require("../models/likeModel");
const Tweet = require("../models/tweetModel");
const Notification = require("../models/notificationModel")
const catchAsync = require("../utils/catchAsync");

exports.like = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId)
  let message = ''
  const checkLike = await Like.findOne({ user: req.user._id, tweet: tweet._id })
  if (checkLike) {
    await Tweet.findByIdAndUpdate(tweet._id,{likes:tweet.likes-1})
    await Like.findByIdAndDelete(checkLike._id)
    message = "Like deleted"
  }
  else {
    await Tweet.findByIdAndUpdate(tweet._id,{likes:tweet.likes+1})
    await Like.create({ user: req.user._id, tweet: tweet._id })
    await Notification.create({
      user: tweet.user,
      type: "like",
      content: `${req.user.name} like your tweet ${tweet._id}.`
    })
    message = "Like created"
  }
  res.status(200).json({
    status: "success",
    message
  })
})

// we can use aggregate like (getAllFollowers) its better in performance 
exports.getLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ tweet: req.params.tweetId }).populate("user", "name profilePic");
  const likeNames = likes.map((like) => ({
    name: like.user.name,
    photo: like.user.profilePic,
    id: like.user._id,
  }));
  res.status(200).json({
    status: "success",
    data: likeNames,
  });
});

const catchAsync = require("../utils/catchAsync");
const Tweet = require("../models/tweetModel")
const Like = require("../models/likeModel")

exports.createTweet = catchAsync(async(req,res,next)=>{
  const tweet = await Tweet.create({user: req.user._id, content: req.body.content })
  res.status(200).json({
    status: "success",
    data: tweet
  })
})

exports.getTweet = catchAsync(async(req,res,next)=>{
  const tweet = await Tweet.findById(req.params.tweetId)
  res.status(200).json({
    status: "success",
    data: tweet
  })
})

exports.updateTweet = catchAsync(async(req,res,next)=>{
  const newTweet = await Tweet.findByIdAndUpdate(req.params.tweetId,req.body,{new: true})
  res.status(200).json({
    status: "success",
    data: newTweet
  })
})

exports.deleteTweet = catchAsync(async(req,res,next)=>{
  await Tweet.findByIdAndRemove(req.params.tweetId)
  res.status(200).json({
    status: "success",
  })
})

// we can do this in getFollowers 
exports.getLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ tweet: req.params.tweetId }).populate("user", "name");

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


const Retweet = require("../models/retweetModel")
const Tweet = require("../models/tweetModel")
const catchAsync = require("../utils/catchAsync")

exports.retweet = catchAsync(async (req, res, next) => {
  let tweet = Tweet.findById(req.params.tweetId)
  if (!tweet) {
    return res.status(400).json({
      status: "fail",
      message: "cant find tweet with this id!"
    })
  }
  let retweet = await Retweet.findOne({ user: req.user._id, tweet: req.params.tweetId })
  if (retweet) {
    return res.status(400).json({
      status: "fail",
      message: "this user retweet this tweet already!"
    })
  }
  retweet = await Retweet.create({ user: req.user._id, tweet: req.params.tweetId })
  tweet.retweets += 1
  tweet.save({ validateBeforeSave: false })
  
  await Notification.create({
    user: tweet.user,
    type: "retweet",
    content: `${req.user.name} retweet your tweet ${tweet._id}.`
  })
  res.status(200).json({
    status: "success",
    data: retweet
  })
})

exports.deleteRetweet = catchAsync(async(req,res,next)=>{
  const retweet = await Retweet.findById(req.params.retweetId)
  if (!retweet) {
    return res.status(400).json({
      status: "fail",
      message: "cant find retweet with this id!"
    })
  }
  let tweet = Tweet.findById(retweet.tweet)
  tweet.retweets-=1 
  tweet.save({validateBeforeSave: false})
  await Retweet.findByIdAndDelete(req.params.retweetId)
  res.status(200).json({
    status: "success",
    mesaage: "dleted successfully"
  })
})

exports.getReTweetsForUser = catchAsync(async(req,res,next)=>{
  // in this i get all retweets and populate tweet and hide user and id to get the tweet only 
  const retweets = await Retweet.find({user: req.params.userId})
  res.status(200).json({
    status: "success",
    data: retweets
  })

})
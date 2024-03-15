const Retweet = require("../models/retweetModel")
const Tweet = require("../models/tweetModel")
const catchAsync = require("../utils/catchAsync")
const getElementById = require("../functions/getElementById")
const createNotification = require("../functions/createNotification")
const createElement = require("../functions/createElement")
const deleteElementById = require("../functions/deleteElementById")
const getData = require("../functions/getData")
const sendResponse = require("../functions/sendResponse")


exports.retweet = catchAsync(async (req, res, next) => {
  let tweet = await getElementById(Tweet, req.params.tweetId)
  // create index to prevent duplicate 

  const retweet = await createElement(Retweet, { user: req.user._id, tweet: req.params.tweetId })
  await tweet.updateOne({ $inc: { retweets: 1 } })
  await createNotification(`${req.user.name} retweet your tweet ${tweet._id}.`, tweet.user, "retweet")
  sendResponse(res, retweet)
})

exports.deleteRetweet = catchAsync(async (req, res, next) => {
  const retweet = await deleteElementById(Retweet, req.params.retweetId)
  Tweet.findByIdAndUpdate(retweet.tweet, { $inc: { retweets: -1 } })
  sendResponse(res, null, "deleted successfully")
})

exports.getReTweetsForUser = catchAsync(async (req, res, next) => {
  // in this i get all retweets and populate tweet and hide user and id to get the tweet only 
  const retweets = await getData(Retweet, { user: req.params.userId })
  sendResponse(res, retweets)
})
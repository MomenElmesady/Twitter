const Retweet = require("../models/retweetModel");
const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");
const getElementById = require("../functions/getElementById");
const createNotification = require("../functions/createNotification");
const createElement = require("../functions/createElement");
const deleteElementById = require("../functions/deleteElementById");
const getData = require("../functions/getData");
const sendResponse = require("../functions/sendResponse");

exports.retweet = catchAsync(async (req, res, next) => {
  let tweet = await getElementById(Tweet, req.params.tweetId);
  // Create index to prevent duplicates
  const retweet = await createElement(Retweet, { user: req.user._id, tweet: req.params.tweetId });
  await tweet.updateOne({ $inc: { retweets: 1 } });
  await createNotification(`${req.user.name} retweeted your tweet ${tweet._id}.`, tweet.user, "retweet");
  sendResponse(res, retweet, "Retweet created successfully", 201);
});

exports.deleteRetweet = catchAsync(async (req, res, next) => {
  const retweet = await getElementById(Retweet, { _id: req.params.retweetId, user: req.user._id });
  // If the retweet exists and belongs to the user, delete it
  await retweet.remove();
  sendResponse(res, null, "Retweet deleted successfully", 200);
});

exports.getRetweetsForUser = catchAsync(async (req, res, next) => {
  // Retrieve all retweets and populate tweets while hiding user and id to get only the tweet data
  const retweets = await getData(Retweet, { user: req.params.userId });
  sendResponse(res, retweets, "Retweets fetched successfully", 200);
});

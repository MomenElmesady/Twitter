const catchAsync = require("../utils/catchAsync");
const Tweet = require("../models/tweetModel")
const cache = require('memory-cache');
let axios = require("axios");
const appError = require("../utils/appError");
const getElementById = require("../functions/getElementById");
const getElement = require("../functions/getElement");
const createElement = require("../functions/createElement");
const sendResponse = require("../functions/sendResponse")



exports.createTweet = (async (req, res, next) => {
  // in real work the cache is separated storage in server 
  const { content } = req.body;
  const tweetData = prepareTweet(content,req.user._id,req.file)
  const tweet = await createElement(Tweet,tweetData);
  await addToCache(req.user._id,tweet)
  sendResponse(res,tweet)
})

exports.getTweet = catchAsync(async (req, res, next) => {
  const tweet = await getElementById(Tweet, req.params.tweetId)
  sendResponse(res,tweet)
})

exports.updateTweet = catchAsync(async (req, res, next) => {
    const tweet = await getElement(Tweet, { _id: req.params.tweetId, user: req.user })
    tweet.content = req.body.content
    tweet.save()
    sendResponse(res,tweet)
})

exports.deleteTweet = catchAsync(async (req, res, next) => {
    const tweet = await getElement(Tweet, { _id: req.params.tweetId, user: req.user })
    // If the tweet exists and belongs to the user, delete it
    await tweet.remove();
    sendResponse(res,null,"Tweet deleted successfully")
});

exports.getTweetsForUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 100 } = req.query;
  const tweets = await findTweetsByUser(userId, page, limit);
  sendResponse(res,tweets)

});

async function findTweetsByUser(userId, page, limit) {
  const skip = (page - 1) * limit;
  const tweets = await Tweet.find({ user: userId })
  .sort({ timestamp: -1, likes: -1 })
  .skip(skip)
    .limit(limit);
  return tweets;
}

const CACHE_TTL = 3600000; // Define a named constant for cache TTL

function prepareTweet(content,userId,reqFile){
    // Check if a file is uploaded
    const tweetData = {
      content,
      user: userId
    }
    // Check if a file is uploaded
    if (reqFile) {
      // i should store actual url oh the photo (the path oh the photo)
      const mediaUrl = reqFile.originalname; // Replace with actual media URL
      // Create tweet with mediaUrl
      tweetData.mediaUrl = mediaUrl
      tweetData.type = "photo"
    }
    return tweetData
}

async function addToCache(userId,tweet){
  const response = await axios.get(`http://localhost:3939/api/v1/follow/getFollowers/${userId}`);
  const followersData = response.data.data;

  for (const follower of followersData) {
    const userId = follower._id;
    const cachedTweets = cache.get(userId) || [];
    cachedTweets.unshift(tweet);
    cache.put(userId, cachedTweets, CACHE_TTL);
  }
}

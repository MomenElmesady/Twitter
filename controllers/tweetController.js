const catchAsync = require("../utils/catchAsync");
const Tweet = require("../models/tweetModel")
const Like = require("../models/likeModel")
const cache = require('memory-cache');
let axios = require("axios");
const appError = require("authi/appError");



exports.createTweet = (async (req, res, next) => {
  // in real work the cache is separated storage in server 

  const { content } = req.body;
  // Check if a file is uploaded
  const tweetData = {
    content,
    user: req.user._id
  }
  // Check if a file is uploaded
  if (req.file) {
    // i should store actual url oh the photo (the path oh the photo)
    const mediaUrl = req.file.originalname; // Replace with actual media URL
    // Create tweet with mediaUrl
    tweetData.mediaUrl = mediaUrl
    tweetData.type = "photo"  
  }
  // No file uploaded, create tweet without media
  const tweet = await Tweet.create(tweetData);

  const response = await axios.get(`http://localhost:3939/api/v1/follow/getFollowers/${req.user._id}`);
  const followersData = response.data.data;
  
  for (const follower of followersData) {
    const userId = follower._id;
    const cachedTweets = cache.get(userId) || [];
    cachedTweets.unshift(tweet);
    cache.put(userId, cachedTweets, CACHE_TTL);
  }

  res.status(200).json({
    status: "success",
    data: tweet,
  });
})

exports.getTweet = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId)
  res.status(200).json({
    status: "success",
    data: tweet
  })
})

exports.updateTweet = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findOne({_id:req.params.tweetId,user:req.user})
  if (!tweet){
    return next(new appError("This tweet dont belong to this user",403))
  }
  tweet.content = req.body.content
  tweet.save()
  res.status(200).json({
    status: "success",
    data: tweet
  })
})

exports.deleteTweet = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findOne({ _id: req.params.tweetId, user: req.user });

  if (!tweet) {
    return next(new appError("This tweet doesn't belong to this user", 403));
  }

  // If the tweet exists and belongs to the user, delete it
  await tweet.remove();

  res.status(200).json({
    status: "success",
    message: "Tweet deleted successfully",
  });
});



exports.getTweetsForUser = catchAsync(async (req, res, next) => {
  const tweetsquery = Tweet.find({ user: req.params.userId }).sort({ timestamp: -1, likes: -1 })
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 100
  const skip = (page - 1) * limit
  tweetsquery.skip(skip).limit(limit)
  const tweets = await tweetsquery
  res.status(200).json({
    status: "success",
    data: tweets
  })
})

const CACHE_TTL = 3600000; // Define a named constant for cache TTL

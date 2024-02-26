const catchAsync = require("../utils/catchAsync");
const Tweet = require("../models/tweetModel")
const Like = require("../models/likeModel")
const cache = require('memory-cache');
let axios = require("axios")



exports.createTweet = catchAsync(async (req, res, next) => {
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
  try {
    const response = await axios.get(`http://localhost:3939/tweeter/follows/getFollowers/${req.user._id}`);
    // Handle the successful response here
  
    // Assign the response data to a variable if needed
    var data = response.data.data
  } catch (error) {
    // Handle errors here
    console.error('Error:', error.message);
  }
  
    for (i of data){
      let userId = i.follower._id 
      var cashed = cache.get(userId)
      if (cashed){
        cashed.unshift(tweet)
        cache.put(userId,cashed,3600000)
      }
    }
  res.status(200).json({
    status: "success",
    data: tweet,
  });
}
)

exports.getTweet = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId)
  res.status(200).json({
    status: "success",
    data: tweet
  })
})

exports.updateTweet = catchAsync(async (req, res, next) => {
  const newTweet = await Tweet.findByIdAndUpdate(req.params.tweetId, req.body, { new: true })
  res.status(200).json({
    status: "success",
    data: newTweet
  })
})

exports.deleteTweet = catchAsync(async (req, res, next) => {
  await Tweet.findByIdAndRemove(req.params.tweetId)
  res.status(200).json({
    status: "success",
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

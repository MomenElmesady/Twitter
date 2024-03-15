const Like = require("../models/likeModel");
const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");
const findElementById = require("../functions/getElementById")
const createNotification = require("../functions/createNotification")
const deleteElementById = require("../functions/deleteElementById")
const sendResponse = require("../functions/sendResponse")



exports.like = (async (req, res, next) => {
  const tweet = await findElementById(Tweet, req.params.tweetId);
  let message = ''
  const checkLike = await Like.findOne({ tweet: tweet._id, user: req.user._id })
  if (checkLike) {
    await unlikeTweet(tweet, checkLike)
    message = "Like deleted"
  }
  else {
    await likeTweet(tweet, req.user)
    await createNotification(`${req.user.name} like your tweet ${tweet._id}.`, req.user._id, "like")
    message = "Like created"
  }
  sendResponse(res, null, message)
})

// we can use aggregate like (getAllFollowers) its better in performance 
exports.getLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ tweet: req.params.tweetId }).populate("user", "name profilePic");
  const likeNames = handleUsers(likes)
  sendResponse(res, likeNames)
});

async function unlikeTweet(tweet, like) {
  await Tweet.findByIdAndUpdate(tweet._id, { $inc: { likes: -1 } });
  await deleteElementById(Like, like._id);
}

async function likeTweet(tweet, user) {
  await Tweet.findByIdAndUpdate(tweet._id, { $inc: { likes: 1 } });
  await Like.create({ user: user._id, tweet: tweet._id });
}



function handleUsers(likes) {
  return likes.map((like) => ({
    name: like.user.name,
    photo: like.user.profilePic,
    id: like.user._id,
  }));

}
const Tweet = require("../models/tweetModel");
const catchAsync = require("../utils/catchAsync");
const findElementById = require("../functions/getElementById")
const createNotification = require("../functions/createNotification")
const createElement = require("../functions/createElement")
const getData = require("../functions/getData")
const sendResponse = require("../functions/sendResponse")


exports.createComment = catchAsync(async (req, res, next) => {
  const tweet = await findElementById(Tweet,req.params.tweetId);

  await createNotification( `${user.name} commented on your tweet ${tweet._id}.`, req.user._id,"comment");

  const commentData = prepareCommentData(req);
  const comment = await createElement(Tweet,commentData);

  sendResponse(res,comment)
});

exports.getAllCommentsForTweet = catchAsync(async (req, res, next) => {
  const comments = await getData(Tweet,{tweet: req.params.tweetId});
  sendResponse(res,comments)
});

function prepareCommentData(req) {
  const { content } = req.body;
  const commentData = {
    content,
    user: req.user._id,
    tweet: req.params.tweetId,
  };
  if (req.file) {
    const mediaUrl = req.file.originalname; // Replace with actual media URL
    Object.assign(commentData, { mediaUrl, type: "photo" });
  }
  return commentData;
}

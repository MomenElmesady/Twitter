const Comment = require("../models/tweetModel")
const catchAsync = require("../utils/catchAsync")

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({ user: req.user._id, tweet: req.params.tweetId, content: req.body.content })
  res.status(200).json({
    status: "success",
    data: comment
  })
})

exports.getAllCommentsForTweet = catchAsync(async(req,res,next)=>{
  const comments = await Comment.find({tweet: req.params.tweetId})
  res.status(200).json({
    status: "success",
    data: comments 
  })
})

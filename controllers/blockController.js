const Block = require("../models/blockModel")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const createElement = require("../functions/createElement")
const deleteElement = require("../functions/deleteElement")
const sendResponse = require("../functions/sendResponse")
const appError = require("authi/appError")
const unfollowUser = require("./followController").unfollowUser

exports.createBlock = catchAsync(async (req, res, next) => {
  await createElement(Block, {
    user: req.user._id,
    blocked: req.params.blockedId
  })
  unfollowUser(req.user._id, req.params.blockedId)
  unfollowUser(req.params.blockedId, req.user._id)

  sendResponse(res, null, "block happend successfully")
})

exports.deleteBlock = catchAsync(async (req, res, next) => {
  await deleteElement(Block, {
    user: req.user._id,
    blocked: req.params.blockedId
  })
  sendResponse(res, null, "block deleted successfully")
})

exports.isBlock = catchAsync(async (req, res, next) => {
  const blockOne = await Block.findOne({ user: req.user._id, blocked: req.params.followedId })
  const blockTwo = await Block.findOne({ user: req.params.followedId, blocked: req.user._id })
  if (blockOne || blockTwo) {
    return next(new appError("Cant follow when there is block", 401))
  }
  next()
})
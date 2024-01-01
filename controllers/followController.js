const Notification = require("../models/notificationModel")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const appError = require("../utils/appError")

exports.follow = (async (req, res, next) => {
  const follower = req.user
  const followed = req.params.followedId
  const checkIfFollow = await Follow.findOne({ follower: follower._id, followed })

  if (checkIfFollow) {
    return next(new appError("The follower is already foolow the followed", 403))
  }

  follower.following += 1
  follower.save({ validateBeforeSave: false })

  const followedUser = await User.findById(followed)
  followedUser.followers += 1
  followedUser.save({ validateBeforeSave: false })

  const follow = await Follow.create({ follower: follower._id, followed })

  // create Notification 

  await Notification.create({
    user: followed,
    type: "follow",
    content: `${req.user.name} follow you.`
  })
  res.status(200).json({
    status: "success",
    data: follow,
    message: "follow happend successfully and notification send."
  })
})

exports.unFollow = catchAsync(async (req, res, next) => {
  const follower = req.user
  const followed = req.params.followedId
  const checkIfFollow = await Follow.findOne({ follower: follower._id, followed })
  if (!checkIfFollow) {
    return next(new appError("The follower is not follow the followed", 403))
  }
  follower.following -= 1
  follower.save({ validateBeforeSave: false })
  const followedUser = await User.findById(followed)
  followedUser.followers -= 1
  followedUser.save({ validateBeforeSave: false })
  await Follow.deleteOne({ _id: checkIfFollow._id })
  res.status(200).json({
    status: "success",
    message: "the unfollow happend successfully"
  })
})

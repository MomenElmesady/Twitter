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

// search by name in someone followers 
exports.searchInFollowers = catchAsync(async(req,res,next)=>{
  const users = await User.find({name: req.body.name})
  const userIds = users.map(user => user._id);
  const isFollow = await Follow.findOne({ follower: { $in: userIds }, followed: req.params.userId}).populate("follower","name")
  if (isFollow){
    res.status(200).json({
      status: "success",
      data: isFollow.follower
    })
  }
  else {
      res.status(200).json({
        status: "success",
        data: null
      })
  }
})

// search by name in someone followeings 
exports.searchInFollowings = catchAsync(async(req,res,next)=>{
  const users = await User.find({name: req.body.name})
  const userIds = users.map(user => user._id);
  const isFollow = await Follow.findOne({ followed: { $in: userIds }, follower: req.params.userId}).populate("followed","name")
  if (isFollow){
    res.status(200).json({
      status: "success",
      data: isFollow.followed
    })
  }
  else {
      res.status(200).json({
        status: "success",
        data: null
      })
  }
})


// there is two way of finding followers and following i dont know what is better 
exports.getAllFollowers = catchAsync(async (req, res, next) => {
  const followers = await Follow.aggregate([
    {
      $match: { followed: mongoose.Types.ObjectId(req.params.userId) },
    },
    {
      $lookup: {
        from: 'users', 
        localField: 'followed',
        foreignField: '_id',
        as: 'followed',
      },
    },
    {
      $unwind: '$followed', // Unwind the array created by $lookup
    },
    {
      $project: {
        _id: 0,
        followed: { _id: 1, name: 1 }, // Include only the _id and name fields
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: followers,
  });
});


exports.getAllFollowing = catchAsync(async (req, res, next) => {
  const followers = await Follow.find({ follower: req.params.userId }).select("followed -_id").populate("followed","name"); 
    res.status(200).json({
      status: "success",
      data: followers
    })
});

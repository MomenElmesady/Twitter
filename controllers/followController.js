const mongoose = require("mongoose")
const Notification = require("../models/notificationModel")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const appError = require("../utils/appError")

// refacored 
exports.follow = catchAsync(async (req, res, next) => {
  const follower = req.user._id
  const followed = req.params.followedId
  // console.log(typeof followed,typeof follower._id) ==> string , object so we use == not === 
  if (followed == follower) {
    return next(new appError("User cant follow himSelf", 403))
  }
  let follow = await Follow.findOne({ follower, followed })
  if (follow) {
    return next(new appError("cant duplicate follow", 400))
  }

  follow = await Follow.create({ follower, followed })
  await User.updateMany({ _id: { $in: [follower, followed] } }, { $inc: { following: +1, followers: +1 } }
  )

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

// exports.unFollow = catchAsync(async (req, res, next) => {
//   const follower = req.user
//   const followed = req.params.followedId
//   const checkIfFollow = await Follow.findOne({ follower: follower._id, followed })
//   if (!checkIfFollow) {
//     return next(new appError("The follower is not follow the followed", 403))
//   }
//   follower.following -= 1
//   follower.save({ validateBeforeSave: false })
//   const followedUser = await User.findById(followed)
//   followedUser.followers -= 1
//   followedUser.save({ validateBeforeSave: false })
//   await Follow.deleteOne({ _id: checkIfFollow._id })
//   res.status(200).json({
//     status: "success",
//     message: "the unfollow happend successfully"
//   })
// })

// refctored 
exports.unFollow = catchAsync(async (req, res, next) => {
  const followerId = req.user._id;
  const followedId = req.params.followedId;

  const result = await Follow.findOneAndDelete({ follower: followerId, followed: followedId });

  if (!result) {
    return next(new appError("The follower is not following the specified user", 403));
  }

  // Update followers and following counts in a single query
  await User.updateMany(
    { _id: { $in: [followerId, followedId] } },
    { $inc: { following: -1, followers: -1 } }
  );

  res.status(200).json({
    status: "success",
    message: "Unfollow operation successful",
  });
});

// before refactor 
// exports.searchInFollowers = catchAsync(async (req, res, next) => {
//   const users = await User.find({ name: req.body.name })
//   const userIds = users.map(user => user._id);
//   const isFollow = await Follow.findOne({ follower: { $in: userIds }, followed: req.params.userId }).populate("follower", "name")
//   if (isFollow) {
//     res.status(200).json({
//       status: "success",
//       data: isFollow.follower
//     })
//   }
//   else {
//     res.status(200).json({
//       status: "success",
//       data: null
//     })
//   }
// })

// search by name in someone followers 
exports.searchInFollowers = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followersWithMatchingName = await User.aggregate([
    {
      $match: { name: nameToSearch },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'follower',
        as: 'follows',
      },
    },
    {
      $match: {
        'follows.followed': userId,
      },
    },
    {
      $project: {
        _id: 1, // Include the _id field
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: followersWithMatchingName,
  });
});

// search by name in someone followeings 
exports.searchInFollowings = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followersWithMatchingName = await User.aggregate([
    {
      $match: { name: nameToSearch },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'followed',
        as: 'follows',
      },
    },
    {
      $match: {
        'follows.follower': userId,
      },
    },
    {
      $project: {
        _id: 1, // Include the _id field
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: followersWithMatchingName,
  });
});


// there is two way of finding followers and following i dont know what is better 
/* If your use case requires simple queries and readability is a priority, getAllFollowing might be a good choice.
If you need more complex data manipulations or have a larger dataset where performance is critical, getAllFollowers with aggregation might be more suitable.*/

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  const followers = await User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.userId) },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'followed',
        as: 'follower',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1, // Include only the _id and name fields
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: followers,
  });
});


/*
i execute it before aggregate but in postman time of request i found that aggregate is better 
const followers = await Follow.find({ follower: req.params.userId }).select("followed -_id").populate("followed","name"); 
*/
exports.getAllFollowing = catchAsync(async (req, res, next) => {
  const followings = await User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.userId) },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'followed',
        as: 'followed',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1, // Include only the _id and name fields
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: followings
  })
});

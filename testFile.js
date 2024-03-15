const mongoose = require("mongoose")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const appError = require("../utils/appError")
const createNotification = require("../functions/createNotification")
const createElement = require("../functions/createElement")

exports.follow = catchAsync(async (req, res, next) => {
  const follower = req.user._id
  const followed = req.params.followedId

  let follow = await Follow.findOne({ follower, followed })

  validateFollow(follower, followed,next,follow)

  follow = await Follow.create({followed,follower})
  await updateFollowCounts(follower, followed,1)
  await createNotification(`${req.user.name} start following you.`, followed, "follow")

  res.status(200).json({
    status: "success",
    data: follow,
    message: "follow happend successfully and notification send."
  })
})

exports.unFollow = catchAsync(async (req, res, next) => {
  const followerId = req.user._id;
  const followedId = req.params.followedId;

  const unfollowResult = await unfollowUser(followerId, followedId);

  if (!unfollowResult) {
    return next(new appError("The follower is not following the specified user", 403));
  }

  await updateFollowCounts(followerId, followedId, -1);

  res.status(200).json({
    status: "success",
    message: "Unfollow operation successful",
  });
});
exports.getAllFollowing = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followings = await fetchAllFollowing(userId);

  res.status(200).json({
    status: "success",
    data: followings
  });
});

exports.searchInFollowings = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followingsWithMatchingName = await searchFollowingsByName(nameToSearch, userId);

  res.status(200).json({
    status: 'success',
    data: followingsWithMatchingName,
  });
});

exports.searchInFollowers = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followersWithMatchingName = await searchFollowersByName(nameToSearch, userId);

  res.status(200).json({
    status: 'success',
    data: followersWithMatchingName,
  });
});

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followers = await fetchAllFollowers(userId);

  res.status(200).json({
    status: 'success',
    data: followers,
  });
});

function validateFollow(follower, followed,next,follow) {
  if (followed == follower) {
    return next(new appError("User cant follow himSelf", 403))
  }
  if (follow) {
    return next(new appError("cant duplicate follow", 400))
  }
}



async function unfollowUser(followerId, followedId) {
  return await Follow.findOneAndDelete({ follower: followerId, followed: followedId });
}

async function updateFollowCounts(followerId, followedId, change) {
  await User.updateMany(
    { _id: { $in: [followerId, followedId] } },
    { $inc: { following: change, followers: change } }
  );
}

// search by name in someone followers 

async function searchFollowersByName(nameToSearch, userId) {
  return await User.aggregate([
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
}


// search by name in someone followeings 

async function searchFollowingsByName(nameToSearch, userId) {
  return await User.aggregate([
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
}


// there is two way of finding followers and following i dont know what is better 
/* If your use case requires simple queries and readability is a priority, getAllFollowing might be a good choice.
If you need more complex data manipulations or have a larger dataset where performance is critical, getAllFollowers with aggregation might be more suitable.*/


async function fetchAllFollowers(userId) {
  return await User.aggregate([
    {
      $match: { _id: userId },
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
}


async function fetchAllFollowing(userId) {
  return await User.aggregate([
    {
      $match: { _id: userId },
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
}

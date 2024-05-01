const mongoose = require("mongoose");
const Follow = require("../models/followingModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const createNotification = require("../functions/createNotification");
const createElement = require("../functions/createElement");
const sendResponse = require("../functions/sendResponse");

exports.follow = catchAsync(async (req, res, next) => {
  const follower = req.user._id;
  const followed = req.params.followedId;

  let follow = await Follow.findOne({ follower, followed });

  if (validateFollow(follower, followed, next, follow)) {
    return; 
  }

  follow = await createElement(Follow, { follower, followed });
  await updateFollowCounts(follower, followed, 1);
  await createNotification(`${req.user.name} started following you.`, followed, "follow");

  sendResponse(res, follow, "Follow operation was successful, and a notification has been sent.", 201);
});

function validateFollow(follower, followed, next, follow) {
  if (followed == follower) {
    next(new appError("User cannot follow himself", 403));
    return true; 
  }
  if (follow) {
    next(new appError("Cannot duplicate follow", 400));
    return true; 
  }
  return false; 
}

exports.unFollow = catchAsync(async (req, res, next) => {
  const followerId = req.user._id;
  const followedId = req.params.followedId;

  const unfollowResult = await this.unfollowUser(followerId, followedId);

  if (!unfollowResult) {
    return next(new appError("Cant find this Follow", 404));
  }
  sendResponse(res, null, "Unfollow operation successful");
});

exports.getAllFollowing = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followings = await fetchAllFollowing(userId);

  sendResponse(res, followings);
});

exports.searchInFollowings = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followingsWithMatchingName = await searchFollowingsByName(nameToSearch, userId);
  sendResponse(res, followingsWithMatchingName);
});

exports.searchInFollowers = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const followersWithMatchingName = await searchFollowersByName(nameToSearch, userId);
  sendResponse(res, followersWithMatchingName);
});

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const followers = await fetchAllFollowers(userId);
  console.log(followers);
  sendResponse(res, followers);
});

exports.unfollowUser = async function (followerId, followedId) {
  const deleted = await Follow.findOneAndDelete({ follower: followerId, followed: followedId });
  if (deleted) {
    await updateFollowCounts(followerId, followedId, -1);
  }
  return deleted;
};

async function updateFollowCounts(followerId, followedId, change) {
  await User.updateOne(
    { _id: followerId },
    {
      $inc: { following: change }
    }
  );
  await User.updateOne(
    { _id: followedId },
    {
      $inc: { followers: change }
    }
  );
}

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
        _id: 1,
        name: 1,
      },
    },
  ]);
}

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
        _id: 1,
        name: 1,
      },
    },
  ]);
}

async function fetchAllFollowers(userId) {
  return await Follow.aggregate([
    {
      $match: { followed: userId }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'follower',
        foreignField: '_id',
        as: 'followerInfo'
      }
    },
    {
      $project: {
        _id: { $arrayElemAt: ['$followerInfo._id', 0] },
        name: { $arrayElemAt: ['$followerInfo.name', 0] }
      }
    }
  ]);
}

async function fetchAllFollowing(userId) {
  return await Follow.aggregate([
    {
      $match: { follower: userId }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'followed',
        foreignField: '_id',
        as: 'followedInfo'
      }
    },
    {
      $project: {
        _id: { $arrayElemAt: ['$followedInfo._id', 0] },
        name: { $arrayElemAt: ['$followedInfo.name', 0] }
      }
    }
  ]);
}

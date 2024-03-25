const mongoose = require("mongoose")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const appError = require("../utils/appError")
const createNotification = require("../functions/createNotification")
const createElement = require("../functions/createElement")
const sendResponse = require("../functions/sendResponse")

exports.follow = catchAsync(async (req, res, next) => {
  const follower = req.user._id;
  const followed = req.params.followedId;

  let follow = await Follow.findOne({ follower, followed });


  if (validateFollow(follower, followed, next, follow)) {
    return; // we add this return to make the function stop before go to the next line becouse going to the error middleware have time cost 
  }

  follow = await createElement(Follow, { follower, followed })
  await updateFollowCounts(follower, followed, 1);
  await createNotification(`${req.user.name} started following you.`, followed, "follow");

  sendResponse(res, follow, "Follow operation was successful, and a notification has been sent.")
});

function validateFollow(follower, followed, next, follow) {
  if (followed == follower) {
    next(new appError("User cannot follow himself", 403));
    return true; // Validation fails, exit the function
  }
  if (follow) {
    next(new appError("Cannot duplicate follow", 400));
    return true; // Validation fails, exit the function
  }
  return false; // Validation passes, continue with the function
}

exports.unFollow = catchAsync(async (req, res, next) => {
  const followerId = req.user._id;
  const followedId = req.params.followedId;

  const unfollowResult = await this.unfollowUser(followerId, followedId);

  if (!unfollowResult) {
    return next(new appError("Cant find this Follow", 404))
  }
  sendResponse(res, null, "Unfollow operation successful")
});

exports.getAllFollowing = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followings = await fetchAllFollowing(userId);

  sendResponse(res, followings)

});

exports.searchInFollowings = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);

  const followingsWithMatchingName = await searchFollowingsByName(nameToSearch, userId);
  sendResponse(res, followingsWithMatchingName)
});

exports.searchInFollowers = catchAsync(async (req, res, next) => {
  const nameToSearch = req.body.name;
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const followersWithMatchingName = await searchFollowersByName(nameToSearch, userId);
  sendResponse(res, followersWithMatchingName)

});

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const followers = await fetchAllFollowers(userId);
  sendResponse(res, followers)
});

exports.unfollowUser = async function (followerId, followedId) {
  const deleted = await Follow.findOneAndDelete({ follower: followerId, followed: followedId });
  if (deleted) {
    await updateFollowCounts(followerId, followedId, -1)
  }
  return deleted
}

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

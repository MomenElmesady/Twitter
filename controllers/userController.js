const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const multer = require("multer")
const Follow  = require("../models/followingModel")
const mongoose = require("mongoose")
const Tweet = require("../models/tweetModel")

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userImages")
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1]
    cb(null, `user-${req.user.id}-date.${ext}`)
  }
})
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  }
  else {
    cb(new appError("this is not photo", 400), false)
  }
}
const filterObject = (obj, ...wantedFields) => {
  const newObj = {}
  for (i of wantedFields) {
    newObj[i] = obj[i]
  }
  return newObj
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadProfilePic = upload.single("profilePic")
exports.uploadCover = upload.single("cover")


exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
  res.status(200).json({
    status: "success",
    message: "User found successfully",
    data: user
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.userId)
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  })
})

exports.updateMe = (async (req, res, next) => {
  const filterdUser = filterObject(req.body, "name", "Bio")
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterdUser, { new: true })
  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: updatedUser
  })
})

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user
  res.status(200).json({
    status: "success",
    data: user
  })
})

exports.updatePhoto = (photo) => {
  return async (req, res, next) => {
    const user = req.user
    user[photo] = req.file.path
    await user.save({ validateBeforeSave: false })
    res.status(200).json({
      status: "success",
      data: user
    })
  }
}

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
  const followers = await Follow.find({ follower: req.params.userId }).select("follower -_id").populate("follower","name"); 
    res.status(200).json({
      status: "success",
      data: followers
    })
});

exports.getTweetsForUser = catchAsync(async(req,res,next)=>{
  const tweets = await Tweet.find({user: req.params.userId})
  res.status(200).json({
    status: "success",
    data: tweets
  })
})

// search by name in someone followers 

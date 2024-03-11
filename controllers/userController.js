const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const multer = require("multer")
const Notification = require("../models/notificationModel")
const Follow = require("../models/followingModel")
const cache = require('memory-cache');



exports.timeLine = catchAsync(async (req, res, next) => {
  const key = req.user._id;
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Return from cache")
    return res.status(200).json({
      data: cachedData
    });
  }
  const state = await Follow.aggregate([
    {
      $match: { follower: req.user._id }
    },

    {
      $lookup: {
        from: "tweets",
        localField: "followed",
        foreignField: "user",
        as: "tweet"
      }
    },
    {
      $unwind: '$tweet'
    },
    // دخلت للتويت وفكست للاوبجكت الاصلي 
    {
      $replaceRoot: { newRoot: "$tweet" }
    },

    // add date to in day and month and year only to sort it from latest and for each day sort through likesand comments 
    {
      $addFields: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$timestamp",
            timezone: "UTC"
          }
        }
      }
    },
    {
      $sort: {
        date: -1, likes: -1, comments: -1
      }
    },
    // {
    //   $project: {
    //     date: 0
    //   }
    // }
  ]);
  cache.put(key, state, 3600000)
  res.status(200).json({
    data: state
  });
});
// replaceRoot explained in notes 
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

exports.getAllUsers = catchAsync(async(req,res,next)=>{
  const users = await User.find()
  res.status(200).json({
    status: "success",
    data: users
  })
})
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

// get notifications for user and mark the unread 
exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.status(200).json({
    status: "success",
    data: notifications
  })
})

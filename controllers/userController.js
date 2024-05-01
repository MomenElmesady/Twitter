const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const Notification = require("../models/notificationModel");
const Follow = require("../models/followingModel");
const getData = require("../functions/getData");
const cache = require('memory-cache');
const deleteElementById = require("../functions/deleteElementById");
const sendResponse = require("../functions/sendResponse");
const getElementById = require("../functions/getElementById");
const appError = require("../utils/appError");

exports.timeLine = catchAsync(async (req, res, next) => {
  const key = req.user._id;
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Return from cache");
    return sendResponse(res, cachedData);
  }
  const timeLine = await getTimelineData(req.user._id);
  if (timeLine.length > 0)
    cache.put(key, timeLine, 3600000);
  sendResponse(res, timeLine, "Timeline data fetched successfully", 200);
});

const getTimelineData = async (userId) => {
  const timelineData = await Follow.aggregate([
    { $match: { follower: userId } },
    { $lookup: { from: "tweets", localField: "followed", foreignField: "user", as: "tweet" } },
    { $unwind: '$tweet' },
    { $replaceRoot: { newRoot: "$tweet" } },
    { $addFields: { date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: "UTC" } } } },
    { $sort: { date: -1, likes: -1, comments: -1 } }
  ]);
  return timelineData;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userImages");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-date.${ext}`);
  }
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
  else {
    cb(new appError("This is not a photo", 400), false);
  }
};
const filterObject = (obj, ...wantedFields) => {
  const newObj = {};
  for (i of wantedFields) {
    newObj[i] = obj[i];
  }
  return newObj;
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProfilePic = upload.single("profilePic");
exports.uploadCover = upload.single("cover");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await getData(User, {});
  sendResponse(res, users, "All users fetched successfully", 200);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await getElementById(User, req.params.userId);
  sendResponse(res, user, "User found successfully", 200);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await deleteElementById(User, req.params.userId);
  sendResponse(res, null, "User deleted successfully", 200);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredUser = filterObject(req.body, "name", "Bio");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredUser, { new: true });
  sendResponse(res, updatedUser, "User updated successfully", 200);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  sendResponse(res, user, "User details fetched successfully", 200);
});

exports.updatePhoto = (photo) => {
  return catchAsync(async (req, res, next) => {
    const user = req.user;
    user[photo] = req.file.path;
    await user.save({ validateBeforeSave: false });
    sendResponse(res, user, "User photo updated successfully", 200);
  });
};

exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const notifications = await getData(Notification, { user: req.user._id });
  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
  sendResponse(res, notifications, "User notifications fetched successfully", 200);
});

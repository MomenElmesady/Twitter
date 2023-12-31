const Notification = require("../models/notificationModel")
const catchAsync = require("../utils/catchAsync")

exports.createNotification = catchAsync(async(req,res,next)=>{
  const notifiction = await Notification.create(req.body)
  res.status(200).json({
    status: "success",
    data: notifiction
  })
})


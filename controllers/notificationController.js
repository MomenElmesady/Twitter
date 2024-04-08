const createElement = require("../functions/createElement")
const Notification = require("../models/notificationModel")
const catchAsync = require("../utils/catchAsync")

exports.createNotification = catchAsync(async(req,res,next)=>{
  const notifiction = await createElement(Notification,req.body)
  res.status(200).json({
    status: "success",
    data: notifiction
  })
})


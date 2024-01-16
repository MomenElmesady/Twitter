const Block = require("../models/blockModel")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")

exports.createBlock = catchAsync(async (req,res,next)=>{
  if (req.user._id == req.params.blockId){
    return res.status(404).json({
      status: "fail",
      message: "user cant block himself"
    })
  }
  await Block.create({
    user: req.user._id,
    blocked: req.params.blockedId
  })
  await Follow.findOneAndDelete({follower: req.user._id,followed: req.params.blockedId})
  await Follow.findOneAndDelete({followed: req.user._id,follower: req.params.blockedId})
  res.status(200).json({
    status: "success",
    message: "block happend successfully"
  })
})

exports.deleteBlock = catchAsync(async(req,res,next)=>{
  let message = ""
  const block = await Block.findOneAndDelete({
    user: req.user._id,
    blocked: req.params.blockedId
  })
  if (block){
    message = "block deleted successfully"
  }
  else {
    message = "cant find this block"
  }

  res.status(200).json({
    status: "success",
    message
  })
})

exports.isBlock = catchAsync(async(req,res,next)=>{
  var isBlocked = false
  const block = await Block.findOne({user: req.body.user, blocked: req.body.blocked})
  if (block){
    isBlocked = true
  } 
  res.status(200).json({
    status: "success",
    isBlocked
  })
})
const Block = require("../models/blockModel")
const Follow = require("../models/followingModel")
const catchAsync = require("../utils/catchAsync")
const createElement = require("../functions/createElement")
const deleteElement = require("../functions/deleteElement")
const sendResponse = require("../functions/sendResponse")

exports.createBlock = catchAsync(async (req,res,next)=>{

  await createElement(Block,{
    user: req.user._id,
    blocked: req.params.blockedId
  })
  await Follow.findOneAndDelete({follower: req.user._id,followed: req.params.blockedId})
  await Follow.findOneAndDelete({followed: req.user._id,follower: req.params.blockedId})
  sendResponse(res,null,"block happend successfully")
})

exports.deleteBlock = catchAsync(async(req,res,next)=>{
  await deleteElement(Block,{
    user: req.user._id,
    blocked: req.params.blockedId
  })
  sendResponse(res,null,"block deleted successfully")
})

exports.isBlock = catchAsync(async(req,res,next)=>{
  var isBlocked = false
  const block = await Block.findOne({user: req.body.user, blocked: req.body.blocked})
  if (block){
    isBlocked = true
  } 
  sendResponse(res,isBlocked)
})
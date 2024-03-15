const mongoose = require("mongoose")

const reTweetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  tweet: {
    type: mongoose.Schema.ObjectId,
    ref: "Tweet",
    required: true
  },
  timestamp : {
    type: Date,
    default: Date.now()
  },
})

reTweetSchema.index({ user: 1 })

reTweetSchema.pre(/^find/,function(next){
  this.select("tweet, -_id").populate({
    path: "tweet",
    select: ""
  })
  next()
})

module.exports = mongoose.model("Retweet", reTweetSchema)
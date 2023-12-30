const mongoose = require("mongoose")
const validator = require("validator")

const tweetSchema = mongoose.Schema({
  tweet: {
    type: mongoose.Schema.ObjectId,
    ref: "Tweet",
    default: null
  },
  user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true 
  },
  timestamp : {
    type: Date,
    default: Date.now()
  },
  // photo or video or text
  type: {
    type: String,
    default: "Text"
  },
  // if photo or video
  mediaUrl: {
    type: String,
    default: null
  },
  // text describe the tweet
  content: {
    type: String,
    default: null 
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  retweets: {
    type: Number,
    default: 0
  }
})

// tweetSchema.pre(/^find/,function(next){
//   this.sort("timestamp")
//   next()
// })
module.exports = mongoose.model("Tweet", tweetSchema)

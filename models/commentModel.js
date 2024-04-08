const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  timestamp: {
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
  // text describe the comment
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

commentSchema.index({ user: 1 })

module.exports = mongoose.model("Comment", commentSchema)

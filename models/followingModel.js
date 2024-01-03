const mongoose = require("mongoose")
const validator = require("validator")

const followSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  followed: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

// to prevent duplicate
followSchema.index({ follower: 1, followed: 1 }, { unique: true })

module.exports = mongoose.model("Follow", followSchema)

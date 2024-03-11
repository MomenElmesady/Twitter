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

followSchema.index({ follower: 1 })
followSchema.index({ followed: 1 })

module.exports = mongoose.model("Follow", followSchema)

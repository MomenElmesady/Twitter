const mongoose = require("mongoose")

const likeSchema = mongoose.Schema({
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
})

likeSchema.index({ tweet: 1 })

module.exports = mongoose.model("Like", likeSchema)
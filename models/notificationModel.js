const mongoose = require("mongoose")

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "must have user"]
  },
  type: {
    type: String,
    enum: ['follow', 'like', 'retweet', "comment", 'mention'], // Add more types as needed
    required: [true, "should have type"],
  },
  content: {
    type: String,
    required: [true, "should have content"]
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isRead: {
    type: Boolean,
    default: false,
  }
})

notificationSchema.index({ user: 1 })

module.exports = mongoose.model("Notification", notificationSchema)
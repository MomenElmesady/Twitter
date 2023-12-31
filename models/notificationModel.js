const mongoose = require("mongoose")

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "must have user"]
  },
  type: {
    type: String,
    enum: ['follow', 'like', 'retweet', 'mention'], // Add more types as needed
    required: [true,"should have type"],
  },
  content: {
    type: String,
    required: [true , "should have content"]
  },
  timestamp : {
    type: Date ,
    default: Date.now()
  },
  isRead: {
    type: Boolean,
    default: false,
  }
})


module.exports = mongoose.model("Notification",notificationSchema)
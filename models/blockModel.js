const appError = require("authi/appError");
const mongoose = require("mongoose")

const blockSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  blocked: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
})
blockSchema.pre('save', function(next) {
  // Check if the user is trying to block themselves
  if (this.user.toString() === this.blocked.toString()) {
    const err = new appError("User can't block themselves",400);
    return next(err);
  }
  next();
});

blockSchema.index({user: 1,blocked: 1})
module.exports = mongoose.model("Block", blockSchema)
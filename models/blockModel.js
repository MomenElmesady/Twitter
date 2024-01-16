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


module.exports = mongoose.model("Block", blockSchema)
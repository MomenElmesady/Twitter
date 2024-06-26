const mongoose = require("mongoose")
const validator = require("validator")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "should have name"]
  },
  password: {
    type: String,
    required: [true, "should have password"],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, "should confirm the password"],
    validate: {
      validator: function (value) {
        return this.password === value
      },
      message: "passwordConfirm doesnt match the password"
    }
  },
  email: {
    type: String,
    required: [true, "should have email"],
    unique: [true, "email should be unique"],
    validate: [validator.isEmail, "email should be valid"]
  },
  birthDate: Date,
  Bio: String,
  location: String,
  profilePic: {
    type: String,
    default: "default.png"
  },
  cover: {
    type: String,
    default: "default.png"
  },
  joined: {
    type: Date,
    default: Date.now()
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: ""
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    default: null
  }
})

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken
}

// userSchema.methods.createTokenForValidation
userSchema.methods.createTokenForValidation = async function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Update the verificationToken property of the user instance
  let newVerificationToken = crypto.createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.verificationToken = newVerificationToken
  return verificationToken;
};

userSchema.index({ name: 1 })

module.exports = mongoose.model("User", userSchema)

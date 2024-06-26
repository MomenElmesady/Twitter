const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
let authPackage = require("authi");
authPackage.setUserModel(User);

const createToken = async (id, expiresIn) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const createAndSendToken = async (user, statusCode, res) => {
  const refreshToken = await createToken(user._id, "30d");
  res.cookie("refreshToken", refreshToken, {
    expired: new Date(Date.now() + 30 * 60 * 60 * 1000),
    httpOnly: true,
  });
  const accessToken = await createToken(user._id, "30m");
  res.status(statusCode).json({ user, accessToken });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, password, passwordConfirm, email, birthdate, profilePic, cover } = req.body;
  const user = await User.create({ name, password, passwordConfirm, email, birthdate, profilePic, cover });
  const verificationToken = await user.createTokenForValidation();
  await user.save({ validateBeforeSave: false });
  try {
    html = `<h1>Email verfication </h1>
    <p>Follow this link to verfiy your account. </p><a href= 'http://localhost:3939/api/v1/auth/verify/${verificationToken}'> Click </a>
    `;

    await sendEmail({ email: user.email, subject: `verify your email (for 10 minutes)`, html: html });

    res.status(201).json({
      status: `success`,
      message: `token send to email`,
    });
  } catch (err) {
    console.log(err);
    user.verificationToken = null;
    await user.save({ validateBeforeSave: false });
    return next(new appError("there was an error sending the email, try again", 500));
  }
});

exports.verify = catchAsync(async (req, res, next) => {
  let token = req.params.token;
  token = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return next(new appError("Can't verify!", 403));
  }
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });
  createAndSendToken(user, 200, res);
});

exports.sendVerivicationEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const verificationToken = await user.createTokenForValidation();
  await user.save({ validateBeforeSave: false });
  try {
    html = `<h1>Email verfication </h1>
    <p>Follow this link to verfiy your account. </p><a href= 'http://localhost:3939/api/v1/auth/verify/${verificationToken}'> Click </a>
    `;

    await sendEmail({ email: user.email, subject: `verify your email (for 10 minutes)`, html: html });
    res.status(200).json({
      status: `success`,
      message: `token send to email`,
    });
  } catch (error) {
    user.verificationToken = null;
    await user.save({ validateBeforeSave: false });
    return next(new appError("there was an error sending the email, try again", 500));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("should input email and password", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("Wrong email or password", 401));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new appError("Wrong email or password", 401));
  }
  createAndSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  if (!req.cookies?.refreshToken) {
    return next(new appError("there is no token in the cookie", 400));
  }
  res.clearCookie("refreshToken");
  res.status(200).json({
    status: "success",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("there is no token in headers", 400));
  }
  if (!req.cookies?.refreshToken) {
    return next(new appError("Can't find refreshToken in cookie, the user isn't loggedIn", 401));
  }
  try {
    var decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); /*extract data*/
  } catch (err) {
    return next(new appError("invalid token", 401));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new appError("there is no user", 404));
  }
  if (!user.isVerified) {
    return next(new appError("this email don't verify registration", 403));
  }

  req.user = user;
  next();
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  let refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new appError("there is no token in the cookie", 400));
  }
  try {
    // The purpose of this verification is to ensure that the refresh token is valid and has not been tampered with.
    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_SECRET);
    const accessToken = await createToken(decoded.id, "30m");
    res.status(200).json({ accessToken });
  } catch (err) {
    return next(new appError("invalid token", 400));
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(new appError("there is no email with request", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("there is no user with this email", 404));
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    html = `<h1>Password Reset</h1>
    <p>Follow this link . </p><a href= 'http://localhost:3939/api/v1/auth/verifyPasswordToken/${resetToken}'> Click </a>
    `;

    await sendEmail({ email: user.email, subject: `verify your email (for 10 minutes)`, html: html });
  } catch (err) {
    return next(new appError("error in sending email", 500));
  }
  res.status(200).json({
    status: `success`,
    message: `token send to email`,
  });
});

exports.verifyPasswordReset = catchAsync(async (req, res, next) => {
  const resetToken = req.params.resetToken;
  if (!resetToken) {
    return next(new appError("there is no token in request", 400));
  }
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new appError("Token is invalid or has expired", 400));
  }
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "Success",
    message: "Password reset token verified",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user.passwordResetVerified) {
    return next(new appError("Should verify resetPassword", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetVerified = false;
  await user.save({ validateBeforeSave: true });

  const accessToken = await createToken(user._id, "30m");
  res.status(200).json({ status: "success", data: { user }, accessToken });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const isPasswordMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isPasswordMatch) {
    return next(new appError("Wrong password", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const accessToken = await createToken(user._id, "30m");
  res.status(200).json({ status: "success", data: { user }, accessToken });
});

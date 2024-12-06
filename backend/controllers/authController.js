const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sentToken = require("../utils/jwt");
const crypto = require("crypto");

//Create new user --> /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }
  //user variable is model
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  // res.status(201).json({
  //   success: true,
  //   user,
  //   token,
  // });
  sentToken(user, 201, res);
});

//Login User --> /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  //finding the user database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email & password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email & password", 401));
  }

  sentToken(user, 201, res);
});

//logout --> /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "loggedout",
    });
};

//forgot password --> /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //if user iruntha, resetToken generate pannikoram
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  let BASE_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  //Create reset url
  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follows \n\n
  ${resetUrl} \n\n If you have not requested this email, then ignore it`;

  try {
    sendEmail({
      email: user.email,
      subject: "Ibuy Password Recovery",
      message, //message: message
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password --> /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
    //ipo irukara time vida resetPasswordTokenExpire irukara time adhigama irukanum apo tan token expire agala artham
  });

  if (!user) {
    return next(new ErrorHandler(`Password reset token is invalid or expired`));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(`Password does not match`));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  sentToken(user, 201, res);
});

//Profile related details fetch panra oru service

//intha function async funtion tan irukka pogudhu adhula error vantha catch panna catchAsyncError fun use panrom
//Get  user Profile --> /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Change Password --> /api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  //select fun edhuku kududhu irukom na normal id vachu fetch panna password field varadhu. yen na userSchma create pannum podhu password field select nu property ku false irukom. apdi fetch agatha field ku select fun use panni antha munnadi + symbol potu antha field kudukalam

  //check old password match
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler(`Old password is incorrect`, 404));
  }
  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

//update Profile --> /api/v1/

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  let avatar;
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    newUserData = { ...newUserData, avatar };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true, // pudhusa update panna data va return pannanum
    runValidators: true, // namma schema la validation kududhu irupom, adhula validate seiya patta prigu tan update pannanum
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin routes
//Admin: Get all users  --> --> /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Admin: Get Specific User  --> --> /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Update User  --> /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true, // pudhusa update panna data va return pannanum
    runValidators: true, // namma schema la validation kududhu irupom, adhula validate seiya patta prigu tan update pannanum
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Delete User  --> /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});

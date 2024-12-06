const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to handle this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //why assign to req.user means, isAuthenticatedUser is middleware, so next() call panna , intha middleware routes product panna than so requestHandler intha user login panni irukara illaya nu check panna req.user assign pannaum requestHadler fun check panna mudium by get req.user property use panni
  req.user = await User.findById(decoded.id);
  next();
});

//part3 2:04:33 --> youtube time
exports.authorizeRoles = (...roles) => {
  //anumathikka patta user role vachu iruntha tan login panna anumathikkum
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} is not allowed`));
    }
    next();
  };
};

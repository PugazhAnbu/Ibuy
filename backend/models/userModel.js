const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true, // intha email field unique ndra property kuduthurom adhu intha email ndra property thanidhuvam agidum, adhey email innoru user kudukum podhu error varum
    validate: [validator.isEmail, "Please enter valid email"],
    //email validate seiya sila function theva padum antha validator namma eludha poradhu illa, npm validator package use pannikalam
  },
  password: {
    type: String,
    required: [true, "Please Enter password"],
    maxLength: [6, "Password cannot exceed 6 characters"],
    select: false, // select false kuduthuta find method apo query panna intha field data varadhu. adhuku query panro apo chain via .select(+'password')
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  // resetPasswordToken: {
  //     type: String
  // }, //intha mathiri kudukalam orey oru property varudhuna
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//this is middleware, before save to db we encrypted password with the help of bcrypt.
//next parametor for next middleware call panna, if suppose next middleware call pannala na next call pannum podhu intha middleware finish next db continue pannu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //bcrypt npm library to help you hash passwords
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
userSchema.methods.isValidPassword = async function (enteredPassword) {
  //compare function promise retrun pannum so await use pannigalam, return panra value boolean irukum
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  //Generate Token
  const token = crypto.randomBytes(20).toString("hex");
  // const token = crypto.randomBytes(20, (err, buf) => {
  //   if (err) throw err;
  //   console.log(`${buf.length} bytes of random data: ${buf.toString("hex")}`);
  // });

  //convert token to hash bcoz atha yarum hack panna koodadhu
  //Generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;

const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      //oru step back folder poga 2nd parameter .. kudukanum
      // __dirname auth.js folder than point out pannitu irukom
      cb(null, path.join(__dirname, "..", `uploads/user`));
    },
    filename: function (req, file, cb) {
      //1st parameter error point out pannum adhu error edhum varadhu endrathala null kudukanum
      cb(null, file.originalname);
    },
  }),
});
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

const router = express.Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/change").put(isAuthenticatedUser, changePassword);
router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router
  .route("/update")
  .put(isAuthenticatedUser, upload.single("avatar"), updateProfile);

//Admin Routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
// router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUser);
// router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);
// router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;

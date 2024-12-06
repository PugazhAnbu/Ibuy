const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/products").get(getProducts);

// .post(isAuthenticatedUser, () => authorizeRoles("admin"), newProduct);
// router.route("/product/:id").get(getSingleProduct);
// router.route("/product/:id").put(updateProduct);
//both uri same ah irukum podhu chain request handler call pannalam
router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);
router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .delete(deleteReview);
router.route("/reviews").get(getReviews);

//Admin routes
// .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
//isAuthenticatedUser --> first user login panni irukanu adhu check pannanum, apo than req.user value assign panrom then intha value we can use in authroizeRoles, every middleware end la next() method call pannanum next middleware call aga

//authorizeRoles("admin") --> next entha role la namma routing authroize kudukurom
//newProduct --> aprm than requestHandler fun trigger agi product create agum
router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

module.exports = router;

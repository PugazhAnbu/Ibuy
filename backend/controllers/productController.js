//product create panna nammaku product model theva adhukku productModel import pannikalam
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");

//product details edudhutu vara oru handler functions
//Get Products ==>  /api/v1/products
exports.getProducts = async (req, res, next) => {
  const resPerPage = 3;
  let buildQuery = () => {
    return new APIFeatures(Product.find(), req.query).search().filter();
  };
  const filteredProductsCount = await buildQuery().query.countDocuments();
  const totalProductsCount = await Product.countDocuments({});
  let productsCount = totalProductsCount;

  if (filteredProductsCount !== totalProductsCount) {
    productsCount = filteredProductsCount;
  }
  const products = await buildQuery().paginate(resPerPage).query;
  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage,
    products,
  });
};

//Create New Product --> /api/v1/products/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  //idhu edhukuna entha user entha product create pannanganu terinjukanum
  req.body.user = req.user.id;
  //create fun asynchronous fun, so async/await use pannikalm
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get Single Product
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // new ErrorHandler() -->  kudutha ipo new object onnu create seiya padum.
    return next(new ErrorHandler("Product not found test", 400));
  }
  res.status(201).json({
    success: true,
    product,
  });
};

//Update Product --> /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  //validation
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //intha options for update ana data return pannanum varibale
    runValidators: true, //intha options for model neraya validator kududhu irukom adhu ellam update apo value crt check pannaum
  });

  res.status(200).json({
    success: true,
    product,
  });
};

//Delete Product  --> /api/v1/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product Not found",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted!",
  });
};

//Create Review --> api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating,
    comment,
  };

  const product = await Product.findById(productId);
  //finding user already exists
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    //updating the review
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    //creating the review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //find the average of the products
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//Get reviews --> api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete review --> api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  //filtering the reviews does not match with the deleting id
  const reviews = product.reviews.filter((review) => {
    review._id.toString() !== req.query.id.toString();
  });
  //no of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    numOfReviews,
    ratings,
    reviews,
  });

  res.status(200).json({
    success: true,
  });
});

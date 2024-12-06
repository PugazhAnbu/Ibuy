module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      Error: err,
    });
  }

  if (process.env.NODE_ENV == "production") {
    let message = err.message;
    let error = new Error(message, 400);
    if (err.name == "ValidationError") {
      message = Object.values(err.errors).map((value) => value.message);
      error = new Error(message, 400);
      err.statusCode = 400;
    }
    if (err.name == "CastError") {
      message = `Resource not found: ${err.path}`;
      error = new Error(message);
      err.statusCode = 400;
    }

    if (err.code == 11000) {
      let message = `Duplicate key ${Object.keys(err.keyValue)} error`;
      error = new Error(message);
      err.statusCode = 400;
    }

    if (err.name == "JSONWebTokenError") {
      let message = `JSON Web Token is invalid. Try again`;
      error = new Error(message);
      err.statusCode = 400;
    }

    if (err.name == "TokenExpiredError") {
      let message = `JSON Web Token is expired. Try again`;
      error = new Error(message);
      err.statusCode = 400;
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Shallow cop vs Deep copy
// So, for this problem, you have to understand what is the shallow copy and deep copy.

// Shallow copy is a bit-wise copy of an object which makes a new object by copying the memory address of the original object. That is, it makes a new object by which memory addresses are the same as the original object.

// Deep copy, copies all the fields with dynamically allocated memory. That is, every value of the copied object gets a new memory address rather than the original object.

// Now, what a spread operator does? It deep copies the data if it is not nested. For nested data, it deeply copies the topmost data and shallow copies of the nested data.

// How do I deep copy an object.
// There are several ways I think. A common and popular way is to use JSON.stringify() and JSON.parse().

// const oldObj = {a: {b: 10}, c: 2};
// const newObj = JSON.parse(JSON.stringify(oldObj));

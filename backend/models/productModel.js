const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    //1st arg true means name field mandatory, 2nd arg for error if we didnt enter value
    required: [true, "Please enter product name"],
    //empty space ellam remove pannidum
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  ratings: {
    type: String,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
    //user kudukra category ulla vachuka koodadhu,  adhuka enum oru property use panni values kudukra category matum than accept pannanum
    enum: {
      values: [
        "Electronics",
        "Mobile Phones",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      //ipo by mistake user intha values irukra value thavira illatha onnu kudutha error message show panna message property use pannalam
      message: "Please select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter No of product stock"],
    maxLength: [20, "Product stock cannot exceed 20"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: mongoose.Schema.Types.ObjectId,
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//Ipo namma mela productSchema ready pannitom, ipo intha schema va mongoose therivikanum. mongoose atha edudhukitu model onnu kudukum, antha model oda name product vachukalam
// ipo intha mongoose.model vandhu model oru object return pannum atha oru variable vangikalam

const schema = mongoose.model("Product", productSchema);

//next intha schema vachu CRUD operation seiyalam, adhuku intha schema export pannikalm

module.exports = schema;

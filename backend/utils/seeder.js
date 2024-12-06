const { configDotenv } = require("dotenv");
const connectDatabase = require("../config/database");
const products = require("../data/product.json");
//entha collection la intha dummy data poda poramo antha model import pannikalm
const productModel = require("../models/productModel");
const dotenv = require("dotenv");
const path = require("path");

//intha seeder file app.js or server.js engayum use pannala idhu oru separete for use insert dummy data at into collection. rether than trigger api or insert one by one into db.

// so environment variable value lam inga kedaikadhu so dotenv and config file inaikanum
dotenv.config({ path: "backend/config/config.env" });
//namma productModel vela seiyanum na adhu database oda connect agi irukanum
connectDatabase();

const seedProducts = async () => {
  try {
    await productModel.deleteMany();
    console.log("Products Deleted!");
    //productModel oda oru function use panni insert panna podhu insertMany()
    await productModel.insertMany(products);
    console.log("All products added!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();

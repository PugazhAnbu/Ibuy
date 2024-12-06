const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
//dotenv module namma config.env file connect pannaum, apdi connect panna matum tan namma config file ulla kudutha variable lam node js use panna mudium.
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const app = express();
//request la vara json data express accept pannikum below line
app.use(express.json());
app.use(cookieParser()); // intha package for req.cookies vara data va edudhu use panradhu parser panni object kudukkum
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");

const errorMiddleware = require("./middlewares/error");
//ipo intha products middleware oru kurupita address ku use pannikalam
app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

if (process.env.NODE_ENV === "production") {
  // inga irudhu front end folder access panna express la static endra method ah access pandrom
  //express.static() method middleware return pannum atha app.use la kudukanum

  app.use(express.static(path.join(__dirname, `../frontend/build`)));
  app.get("*", (req, res) => {
    //frontend la vara ella req index.html file than handle panna poradhu
    res.sendFile(
      path.resolve(path.join(__dirname, `../frontend/build/index.html`))
    );
  });
}

//app exports panna than vera file use panna mudium

//ellam mudincha pragu than error middleware trigger pannaum, suppose routes req success achuna angaye res annumpidum error midddleware trigger agadhu
app.use(errorMiddleware);
module.exports = app;

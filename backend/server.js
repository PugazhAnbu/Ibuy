const app = require("./app");

const connectDatabase = require("./config/database");

connectDatabase();

// app.js file create panna server ah oru kurupita port run pannaum , app la listen oru method iruku atha use panni run pannanum

// http server create acha illayanu 2nd argument la oru callback kuduthu therinjukalam
//server varible oru server udai instance
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to unhandled rejection");

  server.close(() => {
    process.exit(1);
  });
  //server.close() method only stop the server program running, but node program run agite irukum atha irutharadhuku epo lam server program shutdown agudho apo node oda program stop agidanum
});

//Handling "Uncaught exception" error

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception error");
  server.close(() => {
    process.exit(1);
  });
});

const mongoose = require("mongoose");

const connectDatabase = () => {
  //2nd argument ah kuduka poradhu sila options,
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      //yen intha options la kuduram na old mongodb parser , anthanudaya functionality use pannitu irukum, adhu use panna venam new one use panna solli namma options true kudukurom
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    //connect method promise return panradhala inga .then() use pandrom
    .then((con) => {
      console.log(`mongoDb is Connected to the host: ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(`error in connecting db: ${err}`);
    });
};

module.exports = connectDatabase;

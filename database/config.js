const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_CNN);
    console.log("DB online");
  } catch (e) {
    console.log(e);
    throw new Error("Error al iniciar DB");
  }
};

module.exports = {
  dbConnection,
};

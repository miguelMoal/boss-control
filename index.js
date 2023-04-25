const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");
const fileUpload = require("express-fileupload");

const app = express();

//BASE DE DATOS
dbConnection();

app.use(cors());

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/auth", require("./routes/Auth.router"));
app.use("/api/product", require("./routes/Product.router"));
app.use("/api/sale", require("./routes/Sale.router"));
app.use("/api/subuser", require("./routes/SubUser.router"));
app.use("/api/analytics", require("./routes/Analytics.router"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});

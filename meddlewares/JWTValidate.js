const jwt = require("jsonwebtoken");

const JWTValidate = (req, res, next) => {
  //x-token HEADERS
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      statusok: false,
      msg: "Invalid token",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.name = name;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }

  next();
};

module.exports = { JWTValidate };

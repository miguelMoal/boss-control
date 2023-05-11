const User = require("../models/User");

const verifySubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.uid);
    if (user.subscriptionActive) {
      next();
    } else {
      return res.status(500).json({
        ok: false,
        msg: "invalidSubscription",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Algo fallo",
    });
  }
};
module.exports = verifySubscription;

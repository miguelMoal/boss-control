const User = require("../models/User");
const SubUser = require("../models/SubUser");

const verifySubscription = async (req, res, next) => {
  try {
    let user = await User.findById(req.uid);
    if (!user) {
      const _SubUser = await SubUser.findById(req.uid);
      user = await User.findById(_SubUser.adminId);
    }
    if (
      user.statusSubscription == "active" ||
      user.statusSubscription == "trialing"
    ) {
      next();
    } else {
      return res.status(500).json({
        ok: false,
        msg: "Subscripción inactiva",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Algo fallo al verificar subscripción",
    });
  }
};
module.exports = verifySubscription;

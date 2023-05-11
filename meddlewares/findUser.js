const SubUser = require("../models/SubUser");

const findUser = async (req, res, next) => {
  try {
    let user = await SubUser.findById(req.uid);
    if (!user) {
      req.userId = req.uid;
    } else {
      req.userId = user.adminId;
    }
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { findUser };

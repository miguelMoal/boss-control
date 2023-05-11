const SubUser = require("../models/SubUser");
const User = require("../models/User");

const getInfoUser = async (req, res) => {
  try {
    let user = await SubUser.findById(req.uid);
    if (!user) {
      user = await User.findById(req.uid);
    }
    res.status(200).json({
      ok: true,
      msg: {
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { getInfoUser };

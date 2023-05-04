const SubUser = require("../models/SubUser");
const User = require("../models/User");

const validatePermissions = (requiredPermission) => async (req, res, next) => {
  let user = null;
  const id = req.uid;
  user = await SubUser.findById(id);
  if (!user) {
    user = await User.findById(id);
  }

  if (!user) {
    return res.status(404).json({ ok: false, msg: "SubUser not found" });
  }
  if (user.role != "ADMIN_ROLE") {
    const { permissions } = user;

    const hasPermission = permissions.some(
      (permission) =>
        permission.name === requiredPermission && permission.active === true
    );

    if (!hasPermission) {
      return res.status(403).json({
        ok: false,
        msg: "You do not have permission to access this resource",
      });
    }
  }

  next();
};

module.exports = { validatePermissions };

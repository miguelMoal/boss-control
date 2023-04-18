const SubUser = require("../models/SubUser");
const bcrypt = require("bcryptjs");

const createSubUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await SubUser.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Email already exists",
      });
    }
    const newSubUser = new SubUser({
      adminId: req.uid,
      ...req.body,
    });
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    newSubUser.password = bcrypt.hashSync(password, salt);
    await newSubUser.save();
    res.status(200).json({
      ok: true,
      msg: { name, email },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error when crete user",
    });
  }
};

const updateSubUser = async (req, res) => {
  const { name, email, permissions } = req.body;
  try {
    let usersUp = {
      name,
      email,
      permissions,
      password: req.body.password,
    };
    if (usersUp?.password) {
      const salt = bcrypt.genSaltSync();
      usersUp.password = bcrypt.hashSync(req.body.password, salt);
    }
    await SubUser.updateOne({ _id: req.body.userId }, usersUp);
    res.status(200).json({
      ok: true,
      msg: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error when update user",
    });
  }
};

// const deleteSubUser = async (req, res) => {
//   try {
//     const userDeleted = await SubUser.findByIdAndDelete(req.params.id);
//     if (!userDeleted) {
//       return res.status(404).json({
//         ok: false,
//         msg: "The user was not found",
//       });
//     }
//     res.status(200).json({
//       ok: true,
//       msg: "The user was deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       msg: "Error deleting user",
//     });
//   }
// };

module.exports = { createSubUser, updateSubUser };

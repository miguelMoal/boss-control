const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Email already exists",
      });
    }

    const userInfo = new User(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    userInfo.password = bcrypt.hashSync(password, salt);

    await userInfo.save();

    //Generate JWT
    const token = await generateJWT(userInfo.id, userInfo.name);

    res.status(201).json({
      ok: true,
      uid: userInfo.id,
      name: userInfo.name,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el daministrador",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid Email",
      });
    }

    //Confirmación de password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid Password",
      });
    }

    //Generar JWT
    const token = await generateJWT(user.id, user.name);

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el daministrador",
    });
  }
};

const renewToken = async (req, res) => {
  const { uid, name } = req;

  //Generar JWT
  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};

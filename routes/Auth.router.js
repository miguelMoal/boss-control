/*
Rutas deUusarios / Auth
host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const { JWTValidate } = require("../meddlewares/JWTValidate");

// const Role = require("../models/Role");

const {
  createUser,
  loginUser,
  renewToken,
} = require("../controllers/Auth.controller");

const router = Router();

router.post(
  "/new",
  [
    check("name", "The name is required").not().isEmpty(),
    check("email", "The email is required").isEmail(),
    check("password", "Invalid password").isLength({ min: 6 }),
    check("phone", "The email is required").isLength({ min: 10 }),
    check("role", "Invalid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    fieldValidator,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "The email is required").isEmail(),
    check("password", "Invalid password").isLength({ min: 6 }),
    fieldValidator,
  ],
  loginUser
);

router.get("/renew", [JWTValidate], renewToken);

module.exports = router;

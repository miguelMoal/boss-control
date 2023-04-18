const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const {
  createSubUser,
  updateSubUser,
  deleteSubUser,
  getSubUsers,
} = require("../controllers/SubUser.controller");

router.use(JWTValidate);

router.get("/", getSubUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("password", "Name is required").not().isEmpty(),
    fieldValidator,
  ],
  createSubUser
);

router.put(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("permissions", "Permissions is required").not().isEmpty(),
    check("userId", "UserId is required").not().isEmpty(),
    fieldValidator,
  ],
  updateSubUser
);

router.delete("/:id", deleteSubUser);

module.exports = router;

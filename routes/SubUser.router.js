const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const verifySubscription = require("../meddlewares/verifySubscription");
const { validatePermissions } = require("../meddlewares/validatePermissions");

const {
  createSubUser,
  updateSubUser,
  deleteSubUser,
  getSubUsers,
} = require("../controllers/SubUser.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.get("/", getSubUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("password", "Name is required").not().isEmpty(),
    fieldValidator,
  ],
  validatePermissions("add"),
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
  validatePermissions("edit"),
  updateSubUser
);

router.delete("/:id",validatePermissions("delete"), deleteSubUser);

module.exports = router;

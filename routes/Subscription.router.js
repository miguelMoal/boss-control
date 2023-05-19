const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const { findUser } = require("../meddlewares/findUser");

const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const {
  createSubscription,
  cancelSubscription,
} = require("../controllers/Subscription.controller");

router.use(JWTValidate);


router.post("/", findUser, createSubscription);
router.post("/cancel-subscription", cancelSubscription);

module.exports = router;

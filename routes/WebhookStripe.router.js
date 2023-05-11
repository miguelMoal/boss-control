const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const bodyParser = require("body-parser");
const {
  verifyStripeSignature,
} = require("../meddlewares/verifyStripeSignature");
const { eventsStripe } = require("../controllers/WebhookStripe.controller");

// router.use(JWTValidate);

router.post("/", eventsStripe);

module.exports = router;

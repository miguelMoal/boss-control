/*
    Rutas de Sell
    host + /api/sell
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const verifySubscription = require("../meddlewares/verifySubscription");
const { findUser } = require("../meddlewares/findUser");

const { sale } = require("../controllers/Sale.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.post(
  "/",
  [
    check("products", "Products is required").not().isEmpty(),
    findUser,
    fieldValidator,
  ],
  sale
);

module.exports = router;

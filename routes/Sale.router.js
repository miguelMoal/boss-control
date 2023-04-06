/*
    Rutas de Sell
    host + /api/sell
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const { sale } = require("../controllers/Sale.controller");

router.use(JWTValidate);

router.post(
  "/",
  [
    check("productId", "ID is required").not().isEmpty(),
    check("quantity", "Quantity is required").not().isEmpty(),
    check("amount", "Amount is required").not().isEmpty(),
    fieldValidator,
  ],
  sale
);

module.exports = router;

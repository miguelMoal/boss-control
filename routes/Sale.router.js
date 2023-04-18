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
  [check("products", "Products is required").not().isEmpty(), fieldValidator],
  sale
);

module.exports = router;

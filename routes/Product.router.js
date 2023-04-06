/*
    Rutas de products
    host + /api/products
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Product.controller");

router.use(JWTValidate);

router.get("/", getProducts);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("priceSale", "Price sell is required").not().isEmpty(),
    check("priceBuy", "Price buy is required").not().isEmpty(),
    check("available", "Available is required").not().isEmpty(),
    check("brand", "Brand is required").not().isEmpty(),
    check("color", "Color is required").not().isEmpty(),
    check("preferenceInStock", "Preference in stock is required")
      .not()
      .isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    fieldValidator,
  ],
  createProduct
);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

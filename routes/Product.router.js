/*
    Rutas de products
    host + /api/products
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const { validatePermissions } = require("../meddlewares/validatePermissions");
const verifySubscription = require("../meddlewares/verifySubscription");
const { findUser } = require("../meddlewares/findUser");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addToStock,
} = require("../controllers/Product.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.get("/", findUser, getProducts);
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
    validatePermissions("add"),
  ],
  findUser,
  createProduct
);
router.put("/:id", validatePermissions("edit"), updateProduct);
router.patch("/add-to-stock/:id", validatePermissions("edit"), addToStock);
router.delete("/:id", validatePermissions("delete"), findUser, deleteProduct);

module.exports = router;
//
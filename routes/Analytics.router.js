const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const verifySubscription = require("../meddlewares/verifySubscription");
const { findUser } = require("../meddlewares/findUser");

const {
  infoPeriods,
  getTopSellingProducts,
  getTotalInvest,
  getTotalProducts,
  getWeeklySales,
} = require("../controllers/Analytics.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.get("/info-periods", findUser, infoPeriods);
router.get("/get-top-selling", findUser, getTopSellingProducts);
router.get("/total-invest", findUser, getTotalInvest);
router.get("/total-products", findUser, getTotalProducts);
router.get("/weekly-sales", findUser, getWeeklySales);

module.exports = router;

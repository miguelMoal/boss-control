const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const {
  infoPeriods,
  getTopSellingProducts,
  getTotalInvest,
} = require("../controllers/Analytics.controller");

router.use(JWTValidate);

router.get("/info-periods", infoPeriods);
router.get("/get-top-selling", getTopSellingProducts);
router.get("/total-invest", getTotalInvest);

module.exports = router;

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");

const {
  infoPeriods,
  getInfoLastWeek,
  getInfoLastMonth,
  getTopSellingProducts,
} = require("../controllers/Analytics.controller");

router.use(JWTValidate);

router.get("/info-periods", infoPeriods);
router.get("/info-last-week", getInfoLastWeek);
router.get("/info-last-month", getInfoLastMonth);
router.get("/get-top-selling", getTopSellingProducts);

module.exports = router;

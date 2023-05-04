const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");
const router = Router();
const { JWTValidate } = require("../meddlewares/JWTValidate");
const { findUser } = require("../meddlewares/findUser");

const {
  infoPeriods,
  getTopSellingProducts,
  getTotalInvest,
} = require("../controllers/Analytics.controller");

router.use(JWTValidate);

router.get("/info-periods", findUser, infoPeriods);
router.get("/get-top-selling", findUser, getTopSellingProducts);
router.get("/total-invest", findUser, getTotalInvest);

module.exports = router;

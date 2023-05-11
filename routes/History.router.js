const { Router } = require("express");
const { JWTValidate } = require("../meddlewares/JWTValidate");
const verifySubscription = require("../meddlewares/verifySubscription");
const { findUser } = require("../meddlewares/findUser");
const router = Router();

//Controllers
const { getHistories } = require("../controllers/History.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.post("/", findUser, getHistories);

module.exports = router;

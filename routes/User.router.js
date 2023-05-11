const { Router } = require("express");
const { JWTValidate } = require("../meddlewares/JWTValidate");
const verifySubscription = require("../meddlewares/verifySubscription");
const router = Router();

//Controllers
const { getInfoUser } = require("../controllers/User.controller");

router.use(JWTValidate);
router.use(verifySubscription);

router.get("/", getInfoUser);

module.exports = router;

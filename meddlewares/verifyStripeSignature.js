const stripe = require("../config/configStripe");

const verifyStripeSignature = (req, res, next) => {
  const sigHeader = req.headers["stripe-signature"];
  const secret =
    "whsec_079629eca5fe7633b4ba18f84424ba494a3e5875c09449297757e92a977d84d0";
  try {
    req.rawBody = Buffer.from(JSON.stringify(req.body), "utf-8");
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sigHeader,
      secret
    );
    req.event = event;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { verifyStripeSignature };

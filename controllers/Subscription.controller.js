const stripe = require("../config/configStripe");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

const createSubscription = async (req, res) => {
  const { paymentMethod } = req.body;
  const { uid } = req;
  try {
    const user = await User.findById(uid);

    const customer = await stripe.customers.create({
      payment_method: paymentMethod,
      email: user.email,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: "plan_Nof20WDnKrtN4C" }],
    });

    console.log("sub>>>>>>>>$$$$$$$$$$$$$$$$$$$", subscription);

    // const _subscription = new Subscription({
    //   ...subscription,
    //   subscriptionId: subscription.id,
    //   userId: uid,
    //   currentPeriodStart: subscription.current_period_start,
    //   currentPeriodEnd: subscription.current_period_end,
    // });

    // await _subscription.save();

    res.status(200).json({
      ok: true,
      msg: "The subscription was generated correctly",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { createSubscription };
